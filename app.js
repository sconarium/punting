(function () {
  "use strict";

  const data = window.THAMES_DATA;
  const contentManifest = window.THAMES_CONTENT_MANIFEST || { pages: {} };
  if (!data || !window.L) {
    document.body.innerHTML = "<p style='padding:2rem'>地图数据或离线地图库未能加载。</p>";
    return;
  }

  const pageById = new Map(data.pages.map((page) => [page.id, page]));
  const reachById = new Map(data.reaches.map((reach) => [reach.id, reach]));
  const branches = data.branches || [];
  const branchWaypoints = data.branchWaypoints || [];
  const branchById = new Map(branches.map((branch) => [branch.id, branch]));
  const branchWaypointById = new Map(branchWaypoints.map((waypoint) => [waypoint.id, waypoint]));
  const lockById = new Map(data.locks.map((lock) => [lock.id, lock]));
  const waypointById = new Map(data.waypoints.map((waypoint) => [waypoint.id, waypoint]));
  const lockByRouteIndex = new Map(data.locks.map((lock) => [lock.routeIndex, lock]));
  const navigationItems = [
    ...data.waypoints.map((waypoint) => {
      const lock = lockByRouteIndex.get(waypoint.routeIndex);
      return lock ? { type: "lock", item: lock } : { type: "waypoint", item: waypoint };
    }),
    ...branchWaypoints.map((item) => ({ type: "branchWaypoint", item })),
  ];
  const state = { view: "reaches", query: "", selectedType: null, selectedId: null };
  const SAVED_KEY = "thames-punting-saved-v1";
  const BASEMAP_KEY = "thames-punting-basemap-v1";
  let savedItems = readSavedItems();

  const elements = {
    catalog: document.querySelector(".catalog-panel"),
    catalogList: document.getElementById("catalog-list"),
    searchInput: document.getElementById("search-input"),
    tabs: Array.from(document.querySelectorAll("[data-view]")),
    detail: document.getElementById("detail-panel"),
    detailContent: document.getElementById("detail-content"),
    detailClose: document.getElementById("detail-close"),
    basemapButton: document.getElementById("basemap-button"),
    locationButton: document.getElementById("location-button"),
    savedButton: document.getElementById("saved-button"),
    savedCount: document.getElementById("saved-count"),
    offlineState: document.getElementById("offline-state"),
    mobileCatalogButton: document.getElementById("mobile-catalog-button"),
    positionHud: document.getElementById("position-hud"),
    positionKicker: document.getElementById("position-kicker"),
    positionReach: document.getElementById("position-reach"),
    positionDistances: document.getElementById("position-distances"),
    positionOpen: document.getElementById("position-open"),
    reader: document.getElementById("reader-dialog"),
    readerTitle: document.getElementById("reader-title"),
    readerFrame: document.getElementById("reader-frame"),
    readerClose: document.getElementById("reader-close"),
  };

  document.getElementById("reach-count").textContent = data.reaches.length + branches.length;
  document.getElementById("waypoint-count").textContent = data.waypoints.length + branchWaypoints.length;
  document.getElementById("page-count").textContent = data.pages.length;
  updateSavedCount();

  const map = L.map("map", {
    zoomControl: false,
    minZoom: 7,
    maxZoom: 17,
    preferCanvas: true,
    attributionControl: true,
  });
  L.control.zoom({ position: "bottomright" }).addTo(map);
  map.attributionControl.setPrefix(false);

  const latLngs = data.route.map(([lng, lat]) => [lat, lng]);
  const routeBounds = L.latLngBounds(latLngs);
  const oxfordBounds = L.latLngBounds([]);
  branches.forEach((branch) => branchSegmentDescriptors(branch).forEach(({ segment }) => {
    const segmentBounds = L.latLngBounds(segment.map(([lng, lat]) => [lat, lng]));
    routeBounds.extend(segmentBounds);
    oxfordBounds.extend(segmentBounds);
  }));
  const routeDistances = buildRouteDistances(data.route);
  const branchRouteDistances = new Map(branches.map((branch) => [branch.id, buildRouteDistances(branch.route)]));
  L.polyline(latLngs, {
    color: "#8db9b7",
    weight: 9,
    opacity: 0.28,
    lineCap: "round",
    interactive: false,
  }).addTo(map);

  const reachLayers = new Map();
  data.reaches.forEach((reach) => {
    const coordinates = reach.coordinates.map(([lng, lat]) => [lat, lng]);
    const visible = L.polyline(coordinates, {
      color: "#177f8d",
      weight: 4,
      opacity: 0.76,
      lineCap: "round",
      interactive: false,
    }).addTo(map);
    const hit = L.polyline(coordinates, {
      color: "#177f8d",
      weight: 20,
      opacity: 0,
      lineCap: "round",
      interactive: true,
    }).addTo(map);
    hit.on("click", (event) => {
      L.DomEvent.stopPropagation(event);
      selectReach(reach.id, true);
    });
    hit.bindTooltip(reach.name, { sticky: true, className: "lock-tooltip" });
    reachLayers.set(reach.id, { visible, hit });
  });

  const branchLayers = new Map();
  branches.forEach((branch) => {
    const visible = [];
    const hit = [];
    branchSegmentDescriptors(branch).forEach(({ segment, kind }) => {
      const coordinates = segment.map(([lng, lat]) => [lat, lng]);
      const visibleLine = L.polyline(coordinates, {
        ...branchSegmentStyle(kind, false),
        lineCap: "round",
        interactive: false,
      }).addTo(map);
      const hitLine = L.polyline(coordinates, {
        color: "#65733f",
        weight: 22,
        opacity: 0,
        lineCap: "round",
        interactive: true,
      }).addTo(map);
      hitLine.on("click", (event) => {
        L.DomEvent.stopPropagation(event);
        selectBranch(branch.id, true);
      });
      const suffix = kind === "advisory" ? " · 不建议支汊" : kind === "portage" ? " · 上岸搬船" : "";
      hitLine.bindTooltip(`${branch.name}${suffix}`, { sticky: true, className: "lock-tooltip" });
      visible.push({ line: visibleLine, kind });
      hit.push(hitLine);
    });
    branchLayers.set(branch.id, { visible, hit });
  });

  const lockLayers = new Map();
  data.locks.forEach((lock) => {
    const marker = L.circleMarker([lock.lat, lock.lng], {
      radius: 5,
      color: "#f3efe4",
      weight: 2,
      fillColor: "#c76b45",
      fillOpacity: 1,
    }).addTo(map);
    marker.bindTooltip(lock.name, { direction: "top", offset: [0, -5], className: "lock-tooltip" });
    marker.on("click", (event) => {
      L.DomEvent.stopPropagation(event);
      selectLock(lock.id, true);
    });
    lockLayers.set(lock.id, marker);
  });

  const waypointGroup = L.layerGroup();
  const waypointLayers = new Map();
  data.waypoints.filter((waypoint) => !waypoint.isLock).forEach((waypoint) => {
    const marker = L.circleMarker([waypoint.lat, waypoint.lng], {
      radius: 3,
      color: "#f3efe4",
      weight: 1,
      fillColor: "#123f46",
      fillOpacity: 0.9,
    });
    marker.bindTooltip(waypoint.name, { direction: "top", offset: [0, -4], className: "lock-tooltip" });
    marker.on("click", (event) => {
      L.DomEvent.stopPropagation(event);
      selectWaypoint(waypoint.id, true);
    });
    marker.addTo(waypointGroup);
    waypointLayers.set(waypoint.id, marker);
  });
  branchWaypoints.forEach((waypoint) => {
    const isCaution = ["warning", "weir", "portage"].includes(waypoint.kind);
    const marker = L.circleMarker([waypoint.lat, waypoint.lng], {
      radius: isCaution ? 5 : 4,
      color: "#f3efe4",
      weight: isCaution ? 2 : 1,
      fillColor: isCaution ? "#c76b45" : "#65733f",
      fillOpacity: 1,
    });
    marker.bindTooltip(waypoint.name, { direction: "top", offset: [0, -4], className: "lock-tooltip" });
    marker.on("click", (event) => {
      L.DomEvent.stopPropagation(event);
      selectBranchWaypoint(waypoint.id, true);
    });
    marker.addTo(waypointGroup);
    waypointLayers.set(waypoint.id, marker);
  });

  map.fitBounds(oxfordBounds.isValid() ? oxfordBounds : routeBounds, { padding: [38, 38], maxZoom: 11 });
  map.on("zoomend", updateWaypointVisibility);
  map.on("click", () => elements.catalog.classList.remove("is-open"));
  updateWaypointVisibility();

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function normalized(value) {
    return String(value ?? "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, " ")
      .trim();
  }

  function kindLabel(kind) {
    return {
      lock: "船闸",
      reach: "河段",
      bridge: "桥梁",
      hire: "租船与上岸点",
      turn: "转向点",
      warning: "水流提示",
      portage: "搬船点",
      weir: "堰与折返点",
      church: "教堂",
      hospitality: "旅店与补给",
      rowing: "赛艇与船艇",
      history: "历史与文学",
      place: "沿岸地点",
    }[kind] || "航路点";
  }

  function branchSegmentDescriptors(branch) {
    return [
      ...(branch.segments || []).map((segment) => ({ segment, kind: "route" })),
      ...(branch.alternativeSegments || []).map((segment) => ({ segment, kind: "alternative" })),
      ...(branch.advisorySegments || []).map((segment) => ({ segment, kind: "advisory" })),
      ...(branch.portageSegments || []).map((segment) => ({ segment, kind: "portage" })),
    ];
  }

  function branchSegmentStyle(kind, selected) {
    const styles = {
      route: { color: "#65733f", weight: 5, opacity: 0.94 },
      alternative: { color: "#7d8c56", weight: 4, opacity: 0.86, dashArray: "8 6" },
      advisory: { color: "#a87745", weight: 4, opacity: 0.84, dashArray: "5 7" },
      portage: { color: "#c76b45", weight: 5, opacity: 1, dashArray: "2 7" },
    };
    const style = styles[kind] || styles.route;
    if (!selected) return style;
    return {
      ...style,
      weight: style.weight + 2,
      opacity: 1,
      color: kind === "advisory" ? "#9b593e" : kind === "portage" ? "#c75238" : "#c76b45",
    };
  }

  function waypointBelongsToBranch(waypoint, branchId) {
    return waypoint.branchId === branchId || (waypoint.branchIds || []).includes(branchId);
  }

  function readSavedItems() {
    try {
      const value = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]");
      return new Set(Array.isArray(value) ? value : []);
    } catch {
      return new Set();
    }
  }

  function saveItems() {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify([...savedItems]));
    } catch {
      // Private browsing can disable storage; the session still remains usable.
    }
  }

  function savedKey(type, id) {
    return `${type}:${id}`;
  }

  function isSaved(type, id) {
    return savedItems.has(savedKey(type, id));
  }

  function updateSavedCount() {
    elements.savedCount.textContent = savedItems.size;
  }

  function saveActionHTML(type, id) {
    return `<button type="button" data-save-type="${escapeHTML(type)}" data-save-id="${escapeHTML(id)}">${isSaved(type, id) ? "✓ 已在随身夹" : "+ 收入随身夹"}</button>`;
  }

  function itemFromSavedKey(key) {
    const separator = key.indexOf(":");
    const type = key.slice(0, separator);
    const id = key.slice(separator + 1);
    if (type === "reach") return { type, item: reachById.get(id) };
    if (type === "branch") return { type, item: branchById.get(id) };
    if (type === "lock") return { type, item: lockById.get(id) };
    if (type === "waypoint") return { type, item: waypointById.get(id) };
    if (type === "branchWaypoint") return { type, item: branchWaypointById.get(id) };
    if (type === "page") return { type, item: pageById.get(id) };
    return null;
  }

  function renderCatalog() {
    let items;
    if (state.query) {
      const query = normalized(state.query);
      const score = (text) => {
        const candidate = normalized(text);
        if (candidate.startsWith(query)) return 0;
        const index = candidate.indexOf(query);
        return index === -1 ? 9999 : index + 1;
      };
      items = [
        ...navigationItems.map(({ type, item }) => ({ type, item, score: score(`${item.name} ${item.comment || ""}`) })),
        ...data.reaches.map((item) => ({ type: "reach", item, score: score(item.name) })),
        ...branches.map((item) => ({ type: "branch", item, score: score(`${item.name} ${item.comment}`) })),
        ...data.pages.map((item) => ({ type: "page", item, score: score(`${item.name} ${item.comment}`) })),
      ]
        .filter((result) => result.score < 9999)
        .sort((a, b) => a.score - b.score || a.item.name.localeCompare(b.item.name))
        .slice(0, 80);
    } else if (state.view === "waypoints") {
      items = navigationItems;
    } else if (state.view === "pages") {
      items = data.pages.map((item) => ({ type: "page", item }));
    } else if (state.view === "saved") {
      items = [...savedItems].map(itemFromSavedKey).filter((item) => item && item.item);
    } else {
      items = [
        ...branches.map((item) => ({ type: "branch", item })),
        ...data.reaches.map((item) => ({ type: "reach", item })),
      ];
    }

    if (!items.length) {
      const message = state.view === "saved" ? "随身夹还是空的。把常走河段和想看的掌故收进来，手机上会更快找到。" : "没有找到匹配条目。";
      elements.catalogList.innerHTML = `<p class="more-note">${message}</p>`;
      return;
    }

    elements.catalogList.innerHTML = items
      .map(({ type, item }, index) => {
        let subtitle = "";
        let meta = "";
        if (type === "reach" || type === "branch") {
          subtitle = `${item.from} 至 ${item.to}`;
          meta = type === "branch" ? `${item.difficulty || "CHERWELL"} · ${item.distanceKm.toFixed(1)} km` : `${item.pageIds.length} 则掌故`;
        } else if (type === "lock") {
          subtitle = item.comment || "River Thames lock";
          meta = "船闸";
        } else if (type === "waypoint" || type === "branchWaypoint") {
          subtitle = item.comment || "River navigation point";
          meta = kindLabel(item.kind);
        } else {
          subtitle = item.comment || item.address;
          meta = kindLabel(item.kind);
        }
        const isSelected = state.selectedType === type && state.selectedId === item.id;
        return `
          <button class="catalog-item${isSelected ? " is-selected" : ""}" type="button"
            data-select-type="${type}" data-select-id="${escapeHTML(item.id)}">
            <span class="catalog-index">${String(index + 1).padStart(2, "0")}</span>
            <span class="catalog-copy">
              <strong>${escapeHTML(item.name)}</strong>
              <small>${escapeHTML(subtitle)}</small>
            </span>
            <span class="catalog-meta">${escapeHTML(meta)}</span>
          </button>`;
      })
      .join("");
  }

  function updateWaypointVisibility() {
    if (map.getZoom() >= 11) {
      if (!map.hasLayer(waypointGroup)) waypointGroup.addTo(map);
    } else if (map.hasLayer(waypointGroup)) {
      map.removeLayer(waypointGroup);
    }
  }

  function updateMapSelection() {
    reachLayers.forEach(({ visible }, id) => {
      const selected = state.selectedType === "reach" && state.selectedId === id;
      visible.setStyle({
        color: selected ? "#c76b45" : "#177f8d",
        weight: selected ? 7 : 4,
        opacity: selected ? 1 : 0.76,
      });
      if (selected) visible.bringToFront();
    });
    branchLayers.forEach(({ visible }, id) => {
      const selected = state.selectedType === "branch" && state.selectedId === id;
      visible.forEach(({ line, kind }) => {
        line.setStyle(branchSegmentStyle(kind, selected));
        if (selected) line.bringToFront();
      });
    });
    lockLayers.forEach((marker, id) => {
      const selected = state.selectedType === "lock" && state.selectedId === id;
      marker.setRadius(selected ? 8 : 5);
      marker.setStyle({ fillColor: selected ? "#123f46" : "#c76b45", weight: selected ? 3 : 2 });
      if (selected) marker.bringToFront();
    });
    waypointLayers.forEach((marker, id) => {
      const selected = (state.selectedType === "waypoint" || state.selectedType === "branchWaypoint") && state.selectedId === id;
      const isBranchWaypoint = branchWaypointById.has(id);
      const waypoint = branchWaypointById.get(id);
      const isCaution = waypoint && ["warning", "weir", "portage"].includes(waypoint.kind);
      marker.setRadius(selected ? 7 : isCaution ? 5 : isBranchWaypoint ? 4 : 3);
      marker.setStyle({
        fillColor: selected ? "#123f46" : isCaution ? "#c76b45" : isBranchWaypoint ? "#65733f" : "#123f46",
        weight: selected || isCaution ? 2 : 1,
      });
    });
  }

  function openDetail(htmlContent) {
    elements.detailContent.innerHTML = htmlContent;
    elements.detail.classList.add("is-open");
    elements.detail.setAttribute("aria-hidden", "false");
  }

  function pageListHTML(pageIds, limit = 36) {
    const pages = pageIds.map((id) => pageById.get(id)).filter(Boolean);
    if (!pages.length) return '<p class="more-note">此处暂时没有匹配到作者目录。</p>';
    const visible = pages.slice(0, limit);
    const remainder = pages.length - visible.length;
    return `
      <div class="article-list">
        ${visible.map((page) => `
          <button class="article-button" type="button" data-page-id="${escapeHTML(page.id)}">
            <span><strong>${escapeHTML(page.name)}</strong><small>${escapeHTML(page.comment || page.address)}</small></span>
            <span aria-hidden="true">›</span>
          </button>`).join("")}
      </div>
      ${remainder > 0 ? `<p class="more-note">另有 ${remainder} 个条目，可在搜索中找到。</p>` : ""}`;
  }

  function navigationListHTML(reach, limit = 10) {
    const items = data.waypoints
      .filter((waypoint) => waypoint.routeIndex >= reach.startRouteIndex && waypoint.routeIndex <= reach.endRouteIndex)
      .slice(0, limit);
    if (!items.length) return '<p class="more-note">此段没有额外航路点。</p>';
    return `<div class="article-list">${items.map((waypoint) => {
      const lock = lockByRouteIndex.get(waypoint.routeIndex);
      if (lock) {
        return `<button class="article-button" type="button" data-lock-id="${escapeHTML(lock.id)}"><span><strong>${escapeHTML(lock.name)}</strong><small>${escapeHTML(lock.comment || "船闸")}</small></span><span aria-hidden="true">›</span></button>`;
      }
      return `<button class="article-button" type="button" data-waypoint-id="${escapeHTML(waypoint.id)}"><span><strong>${escapeHTML(waypoint.name)}</strong><small>${escapeHTML(waypoint.comment || kindLabel(waypoint.kind))}</small></span><span aria-hidden="true">›</span></button>`;
    }).join("")}</div>`;
  }

  function branchNavigationListHTML(branch) {
    const items = branchWaypoints.filter((waypoint) => waypointBelongsToBranch(waypoint, branch.id));
    if (!items.length) return '<p class="more-note">此段没有额外航路点。</p>';
    return `<div class="article-list">${items.map((waypoint) => `
      <button class="article-button" type="button" data-branch-waypoint-id="${escapeHTML(waypoint.id)}">
        <span><strong>${escapeHTML(waypoint.name)}</strong><small>${escapeHTML(waypoint.comment)}</small></span>
        <span aria-hidden="true">›</span>
      </button>`).join("")}</div>`;
  }

  function fitReach(reach) {
    const desktop = window.innerWidth > 900;
    map.fitBounds(reachLayers.get(reach.id).visible.getBounds(), {
      paddingTopLeft: [45, 45],
      paddingBottomRight: desktop ? [390, 45] : [45, 250],
      maxZoom: 13,
    });
  }

  function fitBranch(branch) {
    const layers = branchLayers.get(branch.id);
    const bounds = L.latLngBounds([]);
    layers.visible.forEach(({ line }) => bounds.extend(line.getBounds()));
    const desktop = window.innerWidth > 900;
    map.fitBounds(bounds, {
      paddingTopLeft: [45, 45],
      paddingBottomRight: desktop ? [390, 45] : [45, 250],
      maxZoom: branch.fitZoom || 14,
    });
  }

  function selectReach(id, moveMap) {
    const reach = reachById.get(id);
    if (!reach) return;
    state.selectedType = "reach";
    state.selectedId = id;
    updateMapSelection();
    renderCatalog();
    if (moveMap) fitReach(reach);
    openDetail(`
      <p class="detail-type">PUNTING REACH · 行舟河段</p>
      <h2>${escapeHTML(reach.name)}</h2>
      <p class="detail-lede">航路点在前，沿岸掌故在后；都已做成轻量卡片，适合在船上快速翻看。</p>
      <div class="article-actions">${saveActionHTML("reach", reach.id)}</div>
      <div class="detail-rule"></div>
      <p class="detail-section-title">航路参考</p>
      ${navigationListHTML(reach)}
      <p class="detail-section-title" style="margin-top:20px">沿岸掌故 · ${reach.pageIds.length}</p>
      ${pageListHTML(reach.pageIds)}
      <p class="rights-message">路线、地点和目录卡片离线可看；深入阅读时再打开作者原文。</p>
    `);
    elements.catalog.classList.remove("is-open");
  }

  function selectBranch(id, moveMap) {
    const branch = branchById.get(id);
    if (!branch) return;
    state.selectedType = "branch";
    state.selectedId = id;
    updateMapSelection();
    renderCatalog();
    if (moveMap) fitBranch(branch);
    openDetail(`
      <p class="detail-type">OXFORD PUNTING · ${escapeHTML(branch.difficulty || "CHERWELL 分段")}</p>
      <h2>${escapeHTML(branch.name)}</h2>
      <p class="detail-lede">${escapeHTML(branch.comment)}</p>
      <p class="route-note"><strong>现场路线：</strong>${escapeHTML(branch.note || "按地图航路点逐段核对。")}</p>
      <p class="more-note">单程约 ${branch.distanceKm.toFixed(1)} km · ${escapeHTML(branch.from)} → ${escapeHTML(branch.to)}</p>
      <div class="article-actions">${saveActionHTML("branch", branch.id)}</div>
      <div class="detail-rule"></div>
      <p class="detail-section-title">Cherwell 航路点</p>
      ${branchNavigationListHTML(branch)}
      <p class="detail-section-title" style="margin-top:20px">作者整理 · ${branch.pageIds.length}</p>
      ${pageListHTML(branch.pageIds)}
      <p class="rights-message">绿色实线为主路线；赭色虚线为作者不建议的浅支汊；橙色点线表示必须上岸搬船。地图可离线查看，行前仍须核对水位、倒树和现场通行情况。</p>
    `);
    elements.catalog.classList.remove("is-open");
  }

  function selectLock(id, moveMap) {
    const lock = lockById.get(id);
    if (!lock) return;
    state.selectedType = "lock";
    state.selectedId = id;
    updateMapSelection();
    renderCatalog();
    if (moveMap) map.flyTo([lock.lat, lock.lng], Math.max(map.getZoom(), 13), { duration: 0.7 });
    const adjacent = data.reaches.filter((reach) => reach.from === lock.name || reach.to === lock.name);
    openDetail(`
      <p class="detail-type">LOCK · 船闸</p>
      <h2>${escapeHTML(lock.name)}</h2>
      <p class="detail-lede">${escapeHTML(lock.comment || "River Thames navigation lock")}</p>
      <div class="article-actions">${saveActionHTML("lock", lock.id)}</div>
      <div class="detail-rule"></div>
      <p class="detail-section-title">作者条目</p>
      ${pageListHTML(lock.pageId ? [lock.pageId] : [], 4)}
      <p class="detail-section-title" style="margin-top:20px">前后河段</p>
      <div class="article-list">${adjacent.map((reach) => `<button class="article-button" type="button" data-reach-id="${escapeHTML(reach.id)}"><span><strong>${escapeHTML(reach.name)}</strong><small>${reach.pageIds.length} 则沿岸掌故</small></span><span aria-hidden="true">›</span></button>`).join("")}</div>
    `);
    elements.catalog.classList.remove("is-open");
  }

  function reachForRouteIndex(routeIndex) {
    return data.reaches.find((reach) => routeIndex >= reach.startRouteIndex && routeIndex <= reach.endRouteIndex) || null;
  }

  function selectWaypoint(id, moveMap) {
    const waypoint = waypointById.get(id);
    if (!waypoint) return;
    state.selectedType = "waypoint";
    state.selectedId = id;
    updateMapSelection();
    renderCatalog();
    if (moveMap) map.flyTo([waypoint.lat, waypoint.lng], Math.max(map.getZoom(), 14), { duration: 0.7 });
    const reach = reachForRouteIndex(waypoint.routeIndex);
    openDetail(`
      <p class="detail-type">${escapeHTML(kindLabel(waypoint.kind).toUpperCase())} · 航路点</p>
      <h2>${escapeHTML(waypoint.name)}</h2>
      <p class="detail-lede">${escapeHTML(waypoint.comment || "River Thames navigation point")}</p>
      <div class="article-actions">
        ${saveActionHTML("waypoint", waypoint.id)}
        ${reach ? `<button type="button" data-reach-id="${escapeHTML(reach.id)}">查看所在河段</button>` : ""}
      </div>
      ${waypoint.pageId ? `<div class="detail-rule"></div><p class="detail-section-title">相关掌故</p>${pageListHTML([waypoint.pageId], 4)}` : ""}
    `);
    elements.catalog.classList.remove("is-open");
  }

  function selectBranchWaypoint(id, moveMap) {
    const waypoint = branchWaypointById.get(id);
    if (!waypoint) return;
    const priorBranchId = state.selectedType === "branch" && waypointBelongsToBranch(waypoint, state.selectedId) ? state.selectedId : null;
    const relatedBranches = (waypoint.branchIds || [waypoint.branchId]).map((branchId) => branchById.get(branchId)).filter(Boolean);
    if (priorBranchId) relatedBranches.sort((a) => a.id === priorBranchId ? -1 : 1);
    state.selectedType = "branchWaypoint";
    state.selectedId = id;
    updateMapSelection();
    renderCatalog();
    if (moveMap) map.flyTo([waypoint.lat, waypoint.lng], Math.max(map.getZoom(), 14), { duration: 0.7 });
    openDetail(`
      <p class="detail-type">${escapeHTML(kindLabel(waypoint.kind).toUpperCase())} · CHERWELL 航路点</p>
      <h2>${escapeHTML(waypoint.name)}</h2>
      <p class="detail-lede">${escapeHTML(waypoint.comment)}</p>
      <div class="article-actions">
        ${saveActionHTML("branchWaypoint", waypoint.id)}
        ${relatedBranches.map((item) => `<button type="button" data-branch-id="${escapeHTML(item.id)}">查看 ${escapeHTML(item.name.replace(/^Cherwell \d · /, ""))}</button>`).join("")}
      </div>
      ${waypoint.pageId ? `<div class="detail-rule"></div><p class="detail-section-title">相关掌故</p>${pageListHTML([waypoint.pageId], 4)}` : ""}
    `);
    elements.catalog.classList.remove("is-open");
  }

  function selectPage(id, moveMap) {
    const page = pageById.get(id);
    if (!page) return;
    state.selectedType = "page";
    state.selectedId = id;
    updateMapSelection();
    renderCatalog();
    if (moveMap) {
      if (Number.isFinite(page.lat) && Number.isFinite(page.lng)) {
        map.flyTo([page.lat, page.lng], Math.max(map.getZoom(), 13), { duration: 0.7 });
      } else if (page.branchId && branchLayers.has(page.branchId)) {
        fitBranch(branchById.get(page.branchId));
      } else if (page.reachId && reachLayers.has(page.reachId)) {
        fitReach(reachById.get(page.reachId));
      }
    }
    const snapshot = contentManifest.pages && contentManifest.pages[page.address];
    const reach = page.reachId ? reachById.get(page.reachId) : null;
    const pageBranches = (page.branchIds || (page.branchId ? [page.branchId] : [])).map((branchId) => branchById.get(branchId)).filter(Boolean);
    const branch = pageBranches[0] || null;
    openDetail(`
      <p class="detail-type">${escapeHTML(kindLabel(page.kind).toUpperCase())} · 沿岸掌故</p>
      <h2>${escapeHTML(page.name)}</h2>
      <p class="detail-lede">${escapeHTML(page.comment || "Where Thames Smooth Waters Glide")}</p>
      ${reach ? `<p class="more-note">所在河段：${escapeHTML(reach.name)}</p>` : ""}
      ${pageBranches.length ? `<p class="more-note">相关 Cherwell 分段：${pageBranches.map((item) => escapeHTML(item.name)).join(" · ")}</p>` : ""}
      <div class="detail-rule"></div>
      <p class="detail-section-title">随船阅读</p>
      <div class="article-actions">
        ${saveActionHTML("page", page.id)}
        ${snapshot ? `<button type="button" data-open-snapshot="${escapeHTML(page.id)}">阅读离线正文</button>` : ""}
        <a href="${escapeHTML(page.originalUrl)}" target="_blank" rel="noreferrer">打开作者原文 ↗</a>
        ${reach ? `<button type="button" data-reach-id="${escapeHTML(reach.id)}">查看所在河段</button>` : ""}
        ${pageBranches.map((item) => `<button type="button" data-branch-id="${escapeHTML(item.id)}">查看 ${escapeHTML(item.name.replace(/^Cherwell \d · /, ""))}</button>`).join("")}
      </div>
      <p class="rights-message">随身夹保存这张地点卡片；路线与说明离线可看，原文需要网络。</p>
    `);
    elements.catalog.classList.remove("is-open");
  }

  function refreshDetail() {
    if (state.selectedType === "reach") selectReach(state.selectedId, false);
    if (state.selectedType === "branch") selectBranch(state.selectedId, false);
    if (state.selectedType === "lock") selectLock(state.selectedId, false);
    if (state.selectedType === "waypoint") selectWaypoint(state.selectedId, false);
    if (state.selectedType === "branchWaypoint") selectBranchWaypoint(state.selectedId, false);
    if (state.selectedType === "page") selectPage(state.selectedId, false);
  }

  function openSnapshot(pageId) {
    const page = pageById.get(pageId);
    if (!page) return;
    const snapshot = contentManifest.pages && contentManifest.pages[page.address];
    if (!snapshot) return;
    elements.readerTitle.textContent = page.name;
    elements.readerFrame.src = snapshot;
    elements.reader.showModal();
  }

  function haversine(lat1, lng1, lat2, lng2) {
    const radius = 6371;
    const toRadians = (value) => value * Math.PI / 180;
    const dLat = toRadians(lat2 - lat1);
    const dLng = toRadians(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
    return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function buildRouteDistances(coordinates) {
    const distances = [0];
    for (let index = 1; index < coordinates.length; index += 1) {
      const [previousLng, previousLat] = coordinates[index - 1];
      const [lng, lat] = coordinates[index];
      distances[index] = distances[index - 1] + haversine(previousLat, previousLng, lat, lng);
    }
    return distances;
  }

  function nearestRoutePoint(lat, lng) {
    let bestIndex = 0;
    let bestDistance = Infinity;
    data.route.forEach(([routeLng, routeLat], index) => {
      const distance = haversine(lat, lng, routeLat, routeLng);
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });
    return { index: bestIndex, distance: bestDistance };
  }

  function nearestBranchRoutePoint(lat, lng) {
    let best = null;
    branches.forEach((branch) => {
      branch.route.forEach(([routeLng, routeLat], index) => {
        const distance = haversine(lat, lng, routeLat, routeLng);
        if (!best || distance < best.distance) best = { branch, index, distance };
      });
    });
    return best;
  }

  function formatDistance(kilometres) {
    if (!Number.isFinite(kilometres)) return "—";
    return kilometres < 1 ? `${Math.max(0, Math.round(kilometres * 1000))} m` : `${kilometres.toFixed(1)} km`;
  }

  let locationWatchId = null;
  let userMarker = null;
  let accuracyCircle = null;
  let currentMapItem = null;
  let followingLocation = false;

  function stopLocation() {
    if (locationWatchId !== null && navigator.geolocation) navigator.geolocation.clearWatch(locationWatchId);
    locationWatchId = null;
    followingLocation = false;
    elements.locationButton.setAttribute("aria-pressed", "false");
    elements.locationButton.querySelector("span").textContent = "定位我";
    elements.positionHud.hidden = true;
  }

  function startLocation() {
    if (!navigator.geolocation) {
      elements.positionHud.hidden = false;
      elements.positionKicker.textContent = "此设备不支持定位";
      elements.positionReach.textContent = "无法显示河上位置";
      elements.positionDistances.textContent = "仍可手动浏览路线与掌故";
      return;
    }
    elements.positionHud.hidden = false;
    elements.positionKicker.textContent = "正在请求手机定位…";
    elements.positionReach.textContent = "寻找最近河段";
    elements.positionDistances.textContent = "首次使用时请允许位置权限";
    elements.locationButton.setAttribute("aria-pressed", "true");
    elements.locationButton.querySelector("span").textContent = "停止定位";
    followingLocation = true;
    locationWatchId = navigator.geolocation.watchPosition(updatePosition, handleLocationError, {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 20000,
    });
  }

  function handleLocationError(error) {
    const message = error && error.code === 1 ? "位置权限未开启" : "暂时无法取得位置";
    elements.positionKicker.textContent = message;
    elements.positionReach.textContent = "可继续手动浏览河图";
    elements.positionDistances.textContent = "在系统设置中允许定位后可再试";
    stopLocation();
    elements.positionHud.hidden = false;
  }

  function updatePosition(position) {
    const lat = Number(position.coords.latitude);
    const lng = Number(position.coords.longitude);
    const accuracy = Number(position.coords.accuracy || 0);
    const nearest = nearestRoutePoint(lat, lng);
    const nearestBranch = nearestBranchRoutePoint(lat, lng);
    const onBranch = nearestBranch && nearestBranch.distance + 0.01 < nearest.distance;
    const reach = onBranch ? null : reachForRouteIndex(nearest.index);
    currentMapItem = onBranch
      ? { type: "branch", id: nearestBranch.branch.id }
      : reach ? { type: "reach", id: reach.id } : null;

    if (onBranch) {
      const branch = nearestBranch.branch;
      const nearbyWaypoint = branchWaypoints
        .filter((waypoint) => waypointBelongsToBranch(waypoint, branch.id))
        .map((waypoint) => ({ waypoint, distance: haversine(lat, lng, waypoint.lat, waypoint.lng) }))
        .sort((a, b) => a.distance - b.distance)[0];
      const distances = branchRouteDistances.get(branch.id);
      const fromStart = distances[nearestBranch.index];
      const toEnd = distances[distances.length - 1] - fromStart;
      elements.positionKicker.textContent = nearestBranch.distance > 0.35
        ? `距 Cherwell 路线约 ${formatDistance(nearestBranch.distance)}`
        : `最近 ${nearbyWaypoint ? nearbyWaypoint.waypoint.name : branch.from} · 精度约 ${Math.round(accuracy)} m`;
      elements.positionReach.textContent = branch.name;
      elements.positionDistances.textContent = `距 ${branch.from} ${formatDistance(fromStart)} · 至 ${branch.to} ${formatDistance(toEnd)}`;
      updateUserLocationMarker(lat, lng, accuracy);
      return;
    }

    let upstream = null;
    let downstream = null;
    data.locks.forEach((lock) => {
      if (lock.routeIndex <= nearest.index) upstream = lock;
      if (!downstream && lock.routeIndex >= nearest.index) downstream = lock;
    });
    const nearbyWaypoint = data.waypoints
      .map((waypoint) => ({ waypoint, distance: haversine(lat, lng, waypoint.lat, waypoint.lng) }))
      .sort((a, b) => a.distance - b.distance)[0];

    if (nearest.distance > 0.35) {
      elements.positionKicker.textContent = `距泰晤士主河道约 ${formatDistance(nearest.distance)}`;
    } else {
      elements.positionKicker.textContent = `最近 ${nearbyWaypoint.waypoint.name} · 精度约 ${Math.round(accuracy)} m`;
    }
    elements.positionReach.textContent = reach ? reach.name : "Lechlade–Teddington 河图范围外";
    const upstreamDistance = upstream ? routeDistances[nearest.index] - routeDistances[upstream.routeIndex] : NaN;
    const downstreamDistance = downstream ? routeDistances[downstream.routeIndex] - routeDistances[nearest.index] : NaN;
    elements.positionDistances.textContent = `${upstream ? `上游 ${upstream.name} ${formatDistance(upstreamDistance)}` : "已在最上游"} · ${downstream ? `下游 ${downstream.name} ${formatDistance(downstreamDistance)}` : "已过 Teddington"}`;

    updateUserLocationMarker(lat, lng, accuracy);
  }

  function updateUserLocationMarker(lat, lng, accuracy) {
    const icon = L.divIcon({ className: "", html: '<span class="user-location-marker" aria-label="我的位置"></span>', iconSize: [18, 18], iconAnchor: [9, 9] });
    if (!userMarker) userMarker = L.marker([lat, lng], { icon, zIndexOffset: 1000 }).addTo(map);
    else userMarker.setLatLng([lat, lng]);
    if (!accuracyCircle) accuracyCircle = L.circle([lat, lng], { radius: accuracy, color: "#177f8d", weight: 1, fillOpacity: 0.08 }).addTo(map);
    else accuracyCircle.setLatLng([lat, lng]).setRadius(accuracy);
    if (followingLocation) map.setView([lat, lng], Math.max(map.getZoom(), 14));
  }

  elements.catalogList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-select-type]");
    if (!button) return;
    const type = button.dataset.selectType;
    const id = button.dataset.selectId;
    if (type === "reach") selectReach(id, true);
    if (type === "branch") selectBranch(id, true);
    if (type === "lock") selectLock(id, true);
    if (type === "waypoint") selectWaypoint(id, true);
    if (type === "branchWaypoint") selectBranchWaypoint(id, true);
    if (type === "page") selectPage(id, true);
  });

  elements.detail.addEventListener("click", (event) => {
    const pageButton = event.target.closest("[data-page-id]");
    const reachButton = event.target.closest("[data-reach-id]");
    const branchButton = event.target.closest("[data-branch-id]");
    const lockButton = event.target.closest("[data-lock-id]");
    const waypointButton = event.target.closest("[data-waypoint-id]");
    const branchWaypointButton = event.target.closest("[data-branch-waypoint-id]");
    const snapshotButton = event.target.closest("[data-open-snapshot]");
    const saveButton = event.target.closest("[data-save-type]");
    if (pageButton) selectPage(pageButton.dataset.pageId, true);
    if (reachButton) selectReach(reachButton.dataset.reachId, true);
    if (branchButton) selectBranch(branchButton.dataset.branchId, true);
    if (lockButton) selectLock(lockButton.dataset.lockId, true);
    if (waypointButton) selectWaypoint(waypointButton.dataset.waypointId, true);
    if (branchWaypointButton) selectBranchWaypoint(branchWaypointButton.dataset.branchWaypointId, true);
    if (snapshotButton) openSnapshot(snapshotButton.dataset.openSnapshot);
    if (saveButton) {
      const key = savedKey(saveButton.dataset.saveType, saveButton.dataset.saveId);
      if (savedItems.has(key)) savedItems.delete(key);
      else savedItems.add(key);
      saveItems();
      updateSavedCount();
      renderCatalog();
      refreshDetail();
    }
  });

  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      state.view = tab.dataset.view;
      state.query = "";
      elements.searchInput.value = "";
      elements.tabs.forEach((item) => item.setAttribute("aria-pressed", String(item === tab)));
      renderCatalog();
    });
  });

  elements.searchInput.addEventListener("input", () => {
    state.query = elements.searchInput.value;
    renderCatalog();
  });
  document.getElementById("search-form").addEventListener("submit", (event) => event.preventDefault());
  document.addEventListener("keydown", (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      elements.searchInput.focus();
      elements.searchInput.select();
    }
  });

  document.querySelector(".brand").addEventListener("click", (event) => {
    event.preventDefault();
    map.fitBounds(routeBounds, { padding: [38, 38] });
  });
  document.getElementById("fit-button").addEventListener("click", () => map.fitBounds(routeBounds, { padding: [38, 38] }));
  elements.mobileCatalogButton.addEventListener("click", () => elements.catalog.classList.toggle("is-open"));
  elements.locationButton.addEventListener("click", () => locationWatchId === null ? startLocation() : stopLocation());
  elements.savedButton.addEventListener("click", () => {
    state.view = "saved";
    state.query = "";
    elements.searchInput.value = "";
    elements.tabs.forEach((item) => item.setAttribute("aria-pressed", "false"));
    renderCatalog();
    elements.catalog.classList.add("is-open");
  });
  elements.positionOpen.addEventListener("click", () => {
    if (!currentMapItem) return;
    if (currentMapItem.type === "reach") selectReach(currentMapItem.id, false);
    if (currentMapItem.type === "branch") selectBranch(currentMapItem.id, false);
  });
  map.on("dragstart", () => { followingLocation = false; });

  elements.detailClose.addEventListener("click", () => {
    elements.detail.classList.remove("is-open");
    elements.detail.setAttribute("aria-hidden", "true");
  });
  elements.readerClose.addEventListener("click", () => elements.reader.close());
  elements.reader.addEventListener("close", () => { elements.readerFrame.src = "about:blank"; });

  let tileLayer = null;

  function readBasemapPreference() {
    try {
      const stored = localStorage.getItem(BASEMAP_KEY);
      return stored === null ? true : stored === "true";
    } catch {
      return true;
    }
  }

  function saveBasemapPreference(enabled) {
    try {
      localStorage.setItem(BASEMAP_KEY, String(enabled));
    } catch {
      // Keep the current session usable when storage is unavailable.
    }
  }

  function addReferenceBasemap() {
    if (tileLayer || !navigator.onLine) return;
    tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      opacity: 0.48,
      className: "reference-basemap",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    tileLayer.bringToBack();
  }

  function setReferenceBasemap(enabled, persist = false) {
    elements.basemapButton.setAttribute("aria-pressed", String(enabled));
    const label = enabled ? "隐藏浅色参考地图" : "显示浅色参考地图";
    elements.basemapButton.setAttribute("aria-label", label);
    elements.basemapButton.title = label;
    if (persist) saveBasemapPreference(enabled);

    if (enabled && navigator.onLine) {
      addReferenceBasemap();
      elements.basemapButton.dataset.status = "available";
      elements.offlineState.textContent = "浅色参考地图已开启";
    } else if (enabled) {
      elements.basemapButton.dataset.status = "unavailable";
      elements.offlineState.textContent = "离线路线可用 · 联网显示参考地图";
    } else {
      if (tileLayer) map.removeLayer(tileLayer);
      tileLayer = null;
      elements.basemapButton.dataset.status = "disabled";
      elements.offlineState.textContent = "离线路线可用";
    }
  }

  elements.basemapButton.addEventListener("click", () => {
    setReferenceBasemap(elements.basemapButton.getAttribute("aria-pressed") !== "true", true);
  });
  window.addEventListener("online", () => {
    if (elements.basemapButton.getAttribute("aria-pressed") === "true") setReferenceBasemap(true);
  });
  window.addEventListener("offline", () => {
    if (elements.basemapButton.getAttribute("aria-pressed") === "true") setReferenceBasemap(true);
  });
  setReferenceBasemap(readBasemapPreference());

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    let reloadingForUpdate = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (reloadingForUpdate) return;
      reloadingForUpdate = true;
      location.reload();
    });
    navigator.serviceWorker
      .register("sw.js", { updateViaCache: "none" })
      .then((registration) => registration.update())
      .catch(() => {});
  }

  renderCatalog();
})();
