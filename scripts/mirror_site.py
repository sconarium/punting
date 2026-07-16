#!/usr/bin/env python3
"""Create a restrained, offline snapshot of thames.me.uk.

Run this only after the necessary permission has been obtained. The source site
contains John Eade's work and third-party material reproduced with permission.
The mirror removes active scripts/iframes and keeps attribution to the source.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import mimetypes
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from build_catalog import parse_pages


BASE_URL = "https://thames.me.uk/"
USER_AGENT = "ThamesOfflineArchive/0.1 (permissioned personal archive)"
ACTIVE_BLOCK_RE = re.compile(
    r"<(script|iframe|object|embed)\b[^>]*>.*?</\1\s*>", re.IGNORECASE | re.DOTALL
)
SINGLE_ACTIVE_RE = re.compile(r"<(script|iframe|object|embed)\b[^>]*?/?>", re.IGNORECASE)
EVENT_RE = re.compile(
    r"\s+on[a-z]+\s*=\s*(?:\"[^\"]*\"|'[^']*'|[^\s>]+)", re.IGNORECASE
)
BASE_RE = re.compile(r"<base\b[^>]*>", re.IGNORECASE)
META_REFRESH_RE = re.compile(
    r"<meta\b(?=[^>]*http-equiv\s*=\s*['\"]?refresh)[^>]*>", re.IGNORECASE
)
ATTR_RE = re.compile(
    r"(?P<prefix>\b(?P<attr>src|href)\s*=\s*)(?P<quote>['\"])(?P<url>.*?)(?P=quote)",
    re.IGNORECASE,
)
STYLE_URL_RE = re.compile(r"url\(\s*(['\"]?)(?P<url>[^)'\"]+)\1\s*\)", re.IGNORECASE)
ASSET_EXTENSIONS = {
    ".avif",
    ".css",
    ".gif",
    ".ico",
    ".jpeg",
    ".jpg",
    ".js",
    ".pdf",
    ".png",
    ".svg",
    ".webp",
    ".woff",
    ".woff2",
}


def fetch(url: str, max_bytes: int) -> tuple[bytes, str]:
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(request, timeout=40) as response:
        length = response.headers.get("Content-Length")
        if length and int(length) > max_bytes:
            raise ValueError(f"asset exceeds limit ({int(length):,} bytes)")
        data = response.read(max_bytes + 1)
        if len(data) > max_bytes:
            raise ValueError(f"asset exceeds limit ({max_bytes:,} bytes)")
        return data, response.headers.get_content_type()


def canonical_url(url: str) -> str:
    parts = urllib.parse.urlsplit(url)
    path = urllib.parse.quote(urllib.parse.unquote(parts.path), safe="/%:@&+$,;=-_.!~*'()")
    return urllib.parse.urlunsplit((parts.scheme or "https", parts.netloc, path, parts.query, ""))


def same_site(url: str) -> bool:
    host = (urllib.parse.urlsplit(url).hostname or "").casefold()
    return host in {"thames.me.uk", "www.thames.me.uk"}


def asset_name(url: str, content_type: str | None = None) -> str:
    path = urllib.parse.unquote(urllib.parse.urlsplit(url).path)
    stem = Path(path).name or "asset"
    stem = re.sub(r"[^a-zA-Z0-9._-]+", "-", stem)[-90:]
    if "." not in stem and content_type:
        stem += mimetypes.guess_extension(content_type) or ""
    digest = hashlib.sha1(url.encode("utf-8")).hexdigest()[:12]
    return f"{digest}-{stem}"


def page_key(url: str) -> str:
    return urllib.parse.unquote(urllib.parse.urlsplit(url).path).lstrip("/").casefold()


def source_notice(original_url: str) -> str:
    escaped = html.escape(original_url, quote=True)
    return (
        '<aside class="offline-source-note">Offline archival copy. '
        f'Original and attribution: <a href="{escaped}">{escaped}</a>.</aside>'
    )


def inject_notice(document: str, original_url: str) -> str:
    notice = source_notice(original_url)
    body_match = re.search(r"<body\b[^>]*>", document, re.IGNORECASE)
    if not body_match:
        return notice + document
    return document[: body_match.end()] + notice + document[body_match.end() :]


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--confirm-rights",
        action="store_true",
        help="Confirm that permission for this local reproduction has been obtained",
    )
    parser.add_argument("--output", type=Path, default=Path("content"))
    parser.add_argument("--delay", type=float, default=0.6, help="Delay between requests")
    parser.add_argument("--max-pages", type=int, default=0, help="0 means all catalogue pages")
    parser.add_argument("--max-asset-mb", type=int, default=30)
    parser.add_argument("--max-total-mb", type=int, default=1500)
    parser.add_argument("--pages-only", action="store_true", help="Skip images and other assets")
    args = parser.parse_args()

    if not args.confirm_rights:
        raise SystemExit(
            "Not started. Obtain permission, then rerun with --confirm-rights. "
            "The source includes copyrighted text, photographs, and licensed third-party works."
        )

    output = args.output.resolve()
    pages_dir = output / "pages"
    assets_dir = output / "assets"
    pages_dir.mkdir(parents=True, exist_ok=True)
    assets_dir.mkdir(parents=True, exist_ok=True)

    menu_bytes, _ = fetch(urllib.parse.urljoin(BASE_URL, "menu.js"), 5_000_000)
    menu_path = output / "source-menu.js"
    menu_path.write_bytes(menu_bytes)
    pages = parse_pages(menu_path)
    if args.max_pages:
        pages = pages[: args.max_pages]

    page_paths: dict[str, str] = {}
    for page in pages:
        source_url = canonical_url(urllib.parse.urljoin(BASE_URL, page["address"]))
        local_name = f'{page["id"]}.html'
        page_paths[page_key(source_url)] = local_name

    asset_paths: dict[str, str] = {}
    pending_assets: list[str] = []
    total_bytes = 0
    failures: list[dict[str, str]] = []
    manifest: dict[str, str] = {}

    def queue_asset(url: str) -> str:
        nonlocal asset_paths
        url = canonical_url(url)
        if url not in asset_paths:
            local_name = asset_name(url)
            asset_paths[url] = local_name
            pending_assets.append(url)
        return asset_paths[url]

    def rewrite_document(document: str, source_url: str) -> str:
        document = ACTIVE_BLOCK_RE.sub("", document)
        document = SINGLE_ACTIVE_RE.sub("", document)
        document = EVENT_RE.sub("", document)
        document = BASE_RE.sub("", document)
        document = META_REFRESH_RE.sub("", document)

        def replace_attr(match: re.Match[str]) -> str:
            raw = html.unescape(match.group("url")).strip()
            if not raw or raw.startswith(("#", "data:", "mailto:", "tel:")):
                return match.group(0)
            if raw.casefold().startswith("javascript:"):
                return f'{match.group("prefix")}{match.group("quote")}#{match.group("quote")}'
            absolute = canonical_url(urllib.parse.urljoin(source_url, raw))
            if not same_site(absolute):
                return match.group(0)
            key = page_key(absolute)
            if key in page_paths:
                replacement = page_paths[key]
            else:
                extension = Path(urllib.parse.urlsplit(absolute).path).suffix.casefold()
                is_asset = match.group("attr").casefold() == "src" or extension in ASSET_EXTENSIONS
                if args.pages_only or not is_asset:
                    return match.group(0)
                replacement = f"../assets/{queue_asset(absolute)}"
            quote = match.group("quote")
            return f'{match.group("prefix")}{quote}{html.escape(replacement, quote=True)}{quote}'

        document = ATTR_RE.sub(replace_attr, document)

        def replace_style_url(match: re.Match[str]) -> str:
            raw = html.unescape(match.group("url")).strip()
            absolute = canonical_url(urllib.parse.urljoin(source_url, raw))
            if args.pages_only or not same_site(absolute):
                return match.group(0)
            replacement = f"../assets/{queue_asset(absolute)}"
            return f'url("{replacement}")'

        document = STYLE_URL_RE.sub(replace_style_url, document)
        return inject_notice(document, source_url)

    for number, page in enumerate(pages, 1):
        source_url = canonical_url(urllib.parse.urljoin(BASE_URL, page["address"]))
        local_name = page_paths[page_key(source_url)]
        try:
            payload, _ = fetch(source_url, args.max_asset_mb * 1024 * 1024)
            total_bytes += len(payload)
            encoding = "utf-8"
            document = payload.decode(encoding, errors="replace")
            document = rewrite_document(document, source_url)
            (pages_dir / local_name).write_text(document, encoding="utf-8")
            manifest[page["address"]] = f"content/pages/{local_name}"
            print(f"page {number}/{len(pages)}  {page['address']}")
        except (OSError, ValueError, urllib.error.URLError) as exc:
            failures.append({"url": source_url, "error": str(exc)})
            print(f"failed page {source_url}: {exc}")
        if total_bytes > args.max_total_mb * 1024 * 1024:
            raise SystemExit("Stopped at --max-total-mb before downloading assets")
        time.sleep(max(args.delay, 0))

    if not args.pages_only:
        for number, source_url in enumerate(pending_assets, 1):
            try:
                payload, content_type = fetch(source_url, args.max_asset_mb * 1024 * 1024)
                total_bytes += len(payload)
                final_name = asset_name(source_url, content_type)
                provisional_name = asset_paths[source_url]
                if final_name != provisional_name:
                    # Usually identical; keep the original reference stable if an extension was inferred.
                    final_name = provisional_name
                (assets_dir / final_name).write_bytes(payload)
                print(f"asset {number}/{len(pending_assets)}  {source_url}")
            except (OSError, ValueError, urllib.error.URLError) as exc:
                failures.append({"url": source_url, "error": str(exc)})
                print(f"failed asset {source_url}: {exc}")
            if total_bytes > args.max_total_mb * 1024 * 1024:
                raise SystemExit("Stopped at --max-total-mb")
            time.sleep(max(args.delay, 0))

    manifest_payload = {
        "source": BASE_URL,
        "generatedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "pages": manifest,
        "failures": failures,
        "bytes": total_bytes,
    }
    (output / "manifest.json").write_text(
        json.dumps(manifest_payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    (output / "manifest.js").write_text(
        "window.THAMES_CONTENT_MANIFEST="
        + json.dumps(manifest_payload, ensure_ascii=False, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )
    print(f"Done: {len(manifest)} pages, {len(asset_paths)} assets queued, {len(failures)} failures")


if __name__ == "__main__":
    main()
