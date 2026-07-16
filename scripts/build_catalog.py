#!/usr/bin/env python3
"""Build the Thames map catalogue from the site's public navigation data.

This script deliberately extracts only factual catalogue fields and coordinates.
It does not copy article text or images.
"""

from __future__ import annotations

import argparse
import difflib
import html
import json
import re
import unicodedata
from pathlib import Path


INDEX_RE = re.compile(
    r'^\s*index\(\s*"(?P<name>(?:[^"\\]|\\.)*)"\s*,\s*'
    r'"(?P<address>(?:[^"\\]|\\.)*)"'
    r'(?:\s*,\s*"(?P<comment>(?:[^"\\]|\\.)*)")?'
)
POINT_RE = re.compile(
    r'PLACE\[p\]="(?P<name>(?:[^"\\]|\\.)*)";\s*'
    r'LAT\[p\]=(?P<lat>-?\d+(?:\.\d+)?);\s*'
    r'LNG\[p\]=(?P<lng>-?\d+(?:\.\d+)?);\s*'
    r'COMMENT\[p\]="(?P<comment>(?:[^"\\]|\\.)*)"'
)
POSITION_RE = re.compile(r"^s(?P<position>\d+)", re.IGNORECASE)


def js_string(value: str) -> str:
    """Decode the limited JavaScript string syntax used by the source files."""
    try:
        return json.loads(f'"{value}"')
    except json.JSONDecodeError:
        return value.replace(r"\"", '"').replace(r"\\", "\\")


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode()
    value = re.sub(r"[^a-zA-Z0-9]+", "-", value).strip("-").lower()
    return value or "item"


def normalized(value: str) -> str:
    value = html.unescape(value).casefold()
    value = value.replace("molesey", "molesy")
    value = value.replace("st. ", "st ")
    value = value.replace("john's", "johns")
    value = value.replace("king's", "kings")
    value = re.sub(r"\b(the|river|tea|ph|at)\b", " ", value)
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


def classify(name: str, comment: str) -> str:
    text = f"{name} {comment}".casefold()
    if "lock" in text and not any(
        excluded in text for excluded in ("lock wood", "lock ait", "locks needed")
    ):
        return "lock"
    if "reach" in text or re.search(r"\bfrom\b.+\bto\b", text):
        return "reach"
    if "bridge" in text or re.search(r"\bbr\b", text):
        return "bridge"
    if "church" in text:
        return "church"
    if any(word in text for word in ("inn", "pub", "restaurant", "cafe", "@")):
        return "hospitality"
    if any(word in text for word in ("rowing", "regatta", "boat race")):
        return "rowing"
    if any(word in text for word in ("history", "historic", "poetry", "novel")):
        return "history"
    return "place"


def parse_pages(menu_path: Path) -> list[dict]:
    pages: list[dict] = []
    seen: set[str] = set()
    for line in menu_path.read_text(encoding="utf-8", errors="replace").splitlines():
        match = INDEX_RE.match(line)
        if not match:
            continue
        address = js_string(match.group("address"))
        if not address or address in seen:
            continue
        seen.add(address)
        name = js_string(match.group("name"))
        comment = js_string(match.group("comment") or "")
        position_match = POSITION_RE.match(address)
        position = int(position_match.group("position")) if position_match else None
        pages.append(
            {
                "id": slugify(address),
                "name": name,
                "address": address,
                "comment": comment,
                "position": position,
                "kind": classify(name, comment),
                "originalUrl": f"https://thames.me.uk/{address}",
            }
        )
    return pages


def parse_points(satnav_path: Path) -> list[dict]:
    points: list[dict] = []
    text = satnav_path.read_text(encoding="utf-8", errors="replace")
    for index, match in enumerate(POINT_RE.finditer(text)):
        points.append(
            {
                "index": index,
                "name": js_string(match.group("name")),
                "lat": round(float(match.group("lat")), 6),
                "lng": round(float(match.group("lng")), 6),
                "comment": js_string(match.group("comment")),
            }
        )
    return points


def best_page_for_point(point: dict, pages: list[dict], kind: str | None = None) -> dict | None:
    candidates = [page for page in pages if kind is None or page["kind"] == kind]
    target = normalized(point["name"])
    if not target:
        return None

    best: tuple[float, dict] | None = None
    for page in candidates:
        name_candidate = normalized(page["name"])
        full_candidate = normalized(f'{page["name"]} {page["comment"]}')
        name_score = difflib.SequenceMatcher(None, target, name_candidate).ratio()
        full_score = difflib.SequenceMatcher(None, target, full_candidate).ratio()
        score = max(name_score, full_score * 0.9)
        if target == name_candidate:
            score += 0.5
        elif target in name_candidate or name_candidate in target:
            score += 0.24
        elif target in full_candidate:
            score += 0.08
        if kind == "lock" and "lock" in name_candidate:
            score += 0.05
        if best is None or score > best[0]:
            best = (score, page)
    threshold = 0.56 if kind == "lock" else 0.78
    return best[1] if best and best[0] >= threshold else None


def build_catalog(pages: list[dict], points: list[dict]) -> dict:
    named_points = [point for point in points if point["name"].strip()]
    lock_points = [
        point
        for point in named_points
        if re.search(r"\blocks?\b", point["name"], re.IGNORECASE)
        and "layby" not in point["name"].casefold()
    ]

    locks: list[dict] = []
    lock_page_positions: dict[str, int] = {}
    for point in lock_points:
        page = best_page_for_point(point, pages, kind="lock")
        lock_id = slugify(point["name"])
        lock = {
            "id": lock_id,
            "name": point["name"],
            "lat": point["lat"],
            "lng": point["lng"],
            "comment": point["comment"],
            "routeIndex": point["index"],
            "pageId": page["id"] if page else None,
        }
        locks.append(lock)
        if page and page["position"] is not None:
            lock_page_positions[lock_id] = page["position"]

    # Match strongly named non-lock places to their most likely catalogue page.
    point_by_page: dict[str, dict] = {}
    page_by_point_index: dict[int, dict] = {}
    for point in named_points:
        page = best_page_for_point(point, pages)
        if page:
            page_by_point_index[point["index"]] = page
        if page and page["id"] not in point_by_page:
            point_by_page[page["id"]] = point
    for page in pages:
        point = point_by_page.get(page["id"])
        if point:
            page["lat"] = point["lat"]
            page["lng"] = point["lng"]

    reaches: list[dict] = []
    boundaries: list[tuple[dict, int | None]] = []
    first = points[0]
    boundaries.append(
        (
            {
                "id": "navigation-limit",
                "name": "Limit of navigation",
                "lat": first["lat"],
                "lng": first["lng"],
                "routeIndex": first["index"],
            },
            2390,
        )
    )
    boundaries.extend((lock, lock_page_positions.get(lock["id"])) for lock in locks)

    for upstream, downstream in zip(boundaries, boundaries[1:]):
        start, start_position = upstream
        end, end_position = downstream
        if start_position is None or end_position is None:
            page_ids: list[str] = []
        else:
            high, low = max(start_position, end_position), min(start_position, end_position)
            page_ids = [
                page["id"]
                for page in pages
                if page["position"] is not None and low <= page["position"] <= high
            ]
        reach_id = f'{start["id"]}-to-{end["id"]}'
        coordinates = [
            [point["lng"], point["lat"]]
            for point in points[start["routeIndex"] : end["routeIndex"] + 1]
        ]
        reaches.append(
            {
                "id": reach_id,
                "name": f'{start["name"]} → {end["name"]}',
                "from": start["name"],
                "to": end["name"],
                "startRouteIndex": start["routeIndex"],
                "endRouteIndex": end["routeIndex"],
                "coordinates": coordinates,
                "pageIds": page_ids,
            }
        )
        for page in pages:
            if page["id"] in page_ids and "reachId" not in page:
                page["reachId"] = reach_id

    route_coordinates = [[point["lng"], point["lat"]] for point in points]
    lock_route_indexes = {lock["routeIndex"] for lock in locks}
    waypoints = [
        {
            "id": f'{slugify(point["name"])}-{point["index"]}',
            "name": point["name"],
            "lat": point["lat"],
            "lng": point["lng"],
            "comment": point["comment"],
            "routeIndex": point["index"],
            "kind": classify(point["name"], point["comment"]),
            "pageId": page_by_point_index[point["index"]]["id"]
            if point["index"] in page_by_point_index
            else None,
            "isLock": point["index"] in lock_route_indexes,
        }
        for point in named_points
    ]
    return {
        "meta": {
            "title": "Where Thames Smooth Waters Glide — map catalogue",
            "source": "https://thames.me.uk/",
            "sourceAuthor": "John Eade",
            "coverage": "Lechlade navigation limit to Teddington",
            "pageCount": len(pages),
            "routePointCount": len(points),
            "lockCount": len(locks),
            "reachCount": len(reaches),
            "waypointCount": len(waypoints),
            "contentIncluded": False,
        },
        "route": route_coordinates,
        "locks": locks,
        "waypoints": waypoints,
        "reaches": reaches,
        "pages": pages,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--menu", type=Path, required=True, help="Downloaded menu.js")
    parser.add_argument("--satnav", type=Path, required=True, help="Downloaded SatNav.js")
    parser.add_argument("--output", type=Path, required=True, help="Output catalog.js")
    args = parser.parse_args()

    pages = parse_pages(args.menu)
    points = parse_points(args.satnav)
    if len(pages) < 500:
        raise SystemExit(f"Expected at least 500 pages; found {len(pages)}")
    if len(points) < 1_500:
        raise SystemExit(f"Expected at least 1,500 route points; found {len(points)}")

    catalog = build_catalog(pages, points)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(catalog, ensure_ascii=False, separators=(",", ":"))
    args.output.write_text(f"window.THAMES_DATA={payload};\n", encoding="utf-8")
    print(json.dumps(catalog["meta"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
