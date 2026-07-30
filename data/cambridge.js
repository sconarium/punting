(function () {
  "use strict";

  const data = window.THAMES_DATA;
  if (!data) return;

  // Polyline precision 5. Coordinates decode as [longitude, latitude].
  // Geometry is taken from the current OpenStreetMap River Cam / Granta
  // centreline. Route divisions follow R. T. Rivington's Cambridge map,
  // current Scudamore's hire routes, Grantchester Village guidance and the
  // British Canoeing Cambridge-to-Grantchester trail.
  function decodePolyline(encoded) {
    const coordinates = [];
    let index = 0;
    let latitude = 0;
    let longitude = 0;
    while (index < encoded.length) {
      let result = 0;
      let shift = 0;
      let byte;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      latitude += result & 1 ? ~(result >> 1) : result >> 1;

      result = 0;
      shift = 0;
      do {
        byte = encoded.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);
      longitude += result & 1 ? ~(result >> 1) : result >> 1;
      coordinates.push([longitude / 1e5, latitude / 1e5]);
    }
    return coordinates;
  }

  const route = {
    backs: decodePolyline("grr}HorU]r@YKWXEDU\\m@p@o@l@gAj@}@d@eA^a@Hk@B{ADuAF[@uADwADA@Q@iAFy@L_@?eAm@UQWQIKCK?MK{@QcAOi@Ye@]SwA]s@SOKYDwAISAKASO_@e@q@kAo@gAYc@Y[s@g@{A}@o@YUKa@]g@y@k@kA{@wBm@}BQk@"),
    grantchester: decodePolyline("spr}HwsUTAf@@Z@XB\\B`AHf@@b@C`@Kb@UVSn@m@jB{D`AkAh@m@pAwAt@Gb@f@`@`@jA~ATVnA`BBD`BtAfAt@VHt@TDBr@Xl@f@pBjEfA`ETdAJ~AD`AtArE\\~Bb@jCBvBHl@\\tADRVl@hAHf@h@PPRjABLJxAV`ANb@lAzCTp@@T@ZGV[jBALALNPh@ObAs@vDj@^`@j@bE|@jBpC`DbBr@`C@zAlCdC`Dt@lAh@^h@JrBuApANvBFdAo@l@Hf@p@LvBVt@xBlCbBlAhCHjAYN[v@aBh@aCXMzCa@n@@vA`@"),
    byron: decodePolyline("m~m}HemRZAr@Kr@GfBb@Vk@t@u@h@_@Li@NsARi@TY`@_@rC}@h@ClA^h@PHB\\Lx@rA\\bAj@h@^b@p@XfAQPLXBd@KVAPFL^RVVv@Ld@Bl@Dr@?l@AV"),
  };

  const millRollersPortage = [
    [0.1159597, 52.2012219],
    [0.1158593, 52.2013901],
    [0.1157626, 52.2014776],
  ];

  const backs = "cambridge-backs";
  const grantchester = "cambridge-grantchester";
  const byron = "cambridge-byron-pool";

  const branches = [
    {
      id: backs,
      region: "cambridge",
      name: "Cambridge 1 · The Backs",
      from: "Mill Pond / Silver Street",
      to: "Jesus Lock",
      comment: "Cambridge 城内经典水路：从 Mill Pond 经 Mathematical Bridge、King's、Clare、Trinity、Bridge of Sighs、Magdalene Bridge 与 Quayside，到 Jesus Lock。",
      note: "Mill Pond 与 Grantchester 上游段被 weir / punt rollers 分开；地图上的橙色点线是搬船连接，不是可直接划过的水路。The Backs 高峰时段船多、桥低，靠近桥洞不要勉强补最后一篙。",
      route: route.backs,
      segments: [route.backs],
      portageSegments: [millRollersPortage],
      distanceKm: 1.5,
      fitZoom: 15,
      difficulty: "城内经典线",
      pageIds: [],
    },
    {
      id: grantchester,
      region: "cambridge",
      name: "Cambridge 2 · Granta Place 至 Grantchester",
      from: "Scudamore's Boatyard · Granta Place",
      to: "The Orchard landing · Grantchester",
      comment: "从 upper river 离开 Cambridge，经 Sheep's Green、Paradise Nature Reserve 与 Grantchester Meadows，到可步行前往 The Orchard、The Red Lion 和 The Green Man 的河岸上岸点。",
      note: "这条路线与 The Backs 不在同一水位。当前 hire 说明把 Sheep's Green、Paradise 和 Grantchester Meadows 作为逐步远行目标；到 Grantchester 通常应按长时段往返安排，并预留逆流、停靠与步行时间。",
      route: route.grantchester,
      segments: [route.grantchester],
      distanceKm: 3.5,
      fitZoom: 14,
      difficulty: "乡野长线",
      pageIds: [],
    },
    {
      id: byron,
      region: "cambridge",
      name: "Cambridge 3 · Grantchester 至 Byron's Pool",
      from: "The Orchard landing · Grantchester",
      to: "Byron's Pool weir",
      comment: "Grantchester 以上的窄河延伸：经过通往 Grantchester Mill 的分汊后，沿左侧主线到 Byron's Pool 的 concrete weir / sluice 前折返。",
      note: "书中称这段河在 Grantchester 以上窄到几乎可跃过，泥底还有深坑；现行当地资料虽确认 punt 可到 Byron's Pool，仍只建议有经验、时间充裕且当天无倒树或强流时前往。不要接近 weir 水流。",
      route: route.byron,
      segments: [route.byron],
      distanceKm: 0.9,
      fitZoom: 15,
      difficulty: "经验者延伸",
      pageIds: [],
    },
  ];

  const branchWaypoints = [
    {
      id: "cambridge-granta-boatyard",
      region: "cambridge",
      name: "Scudamore's Boatyard · Granta Place",
      lat: 52.200974,
      lng: 0.1162365,
      comment: "当前 Grantchester 方向 self-hire 出发点；这里的 boats 不能直接带到 lower river / The Backs。",
      kind: "hire",
      branchId: grantchester,
      branchIds: [grantchester],
    },
    {
      id: "cambridge-mill-rollers-upper",
      region: "cambridge",
      name: "Mill Pond weir / punt rollers · upper side",
      lat: 52.2012219,
      lng: 0.1159597,
      comment: "upper river 的北端。乘客必须先下船，才可按现场许可与器材条件把 craft 移过 rollers。",
      kind: "portage",
      branchId: grantchester,
      branchIds: [grantchester, backs],
    },
    {
      id: "cambridge-mill-rollers-lower",
      region: "cambridge",
      name: "Mill Pond weir / punt rollers · The Backs side",
      lat: 52.2014776,
      lng: 0.1157626,
      comment: "The Backs 的南端水面；与 Grantchester 路线之间有 weir 和 rollers，不是连续水路。",
      kind: "portage",
      branchId: backs,
      branchIds: [backs, grantchester],
    },
    {
      id: "cambridge-silver-street",
      region: "cambridge",
      name: "Silver Street Bridge · Mill Pond",
      lat: 52.2019117,
      lng: 0.1154009,
      comment: "城内路线南端的清楚界标；The Anchor、The Mill 与历史上的 boat-hiring sites 都集中在附近。",
      kind: "bridge",
      branchId: backs,
      branchIds: [backs],
    },
    {
      id: "cambridge-mathematical-bridge",
      region: "cambridge",
      name: "Mathematical Bridge · Queens' College",
      lat: 52.2022128,
      lng: 0.1150498,
      comment: "从 Mill Pond 北行遇到的第一座著名 college bridge；桥洞处保持航线，避免被侧风推向木构件。",
      kind: "bridge",
      branchId: backs,
      branchIds: [backs],
    },
    {
      id: "cambridge-kings-bridge",
      region: "cambridge",
      name: "King's College Bridge",
      lat: 52.2037868,
      lng: 0.1141329,
      comment: "King's College Chapel 与 The Backs 的代表性河景；浅处仍可能听到 pole 撞在旧铺石河床上。",
      kind: "bridge",
      branchId: backs,
      branchIds: [backs],
    },
    {
      id: "cambridge-clare-bridge",
      region: "cambridge",
      name: "Clare Bridge",
      lat: 52.2050025,
      lng: 0.1140359,
      comment: "The Backs 中段的石拱桥；南北连续桥洞会让船流汇聚，先观察再进桥。",
      kind: "bridge",
      branchId: backs,
      branchIds: [backs],
    },
    {
      id: "cambridge-garret-hostel-bridge",
      region: "cambridge",
      name: "Garret Hostel Lane Bridge",
      lat: 52.2058501,
      lng: 0.1139577,
      comment: "旧书作 Garrett Hostel Bridge；附近曾有 Strange's hiring rafts，也是 Oxford-Cambridge punt relay 的典型 Backs 场景。",
      kind: "bridge",
      branchId: backs,
      branchIds: [backs],
    },
    {
      id: "cambridge-trinity-bridge",
      region: "cambridge",
      name: "Trinity Bridge",
      lat: 52.2066636,
      lng: 0.1138501,
      comment: "Trinity College 河段；书中记载该 college 在 The Backs 拥有规模很大的自用 punt fleet。",
      kind: "bridge",
      branchId: backs,
      branchIds: [backs],
    },
    {
      id: "cambridge-st-johns-old-bridge",
      region: "cambridge",
      name: "St John's Old Bridge · Wren Bridge",
      lat: 52.2080546,
      lng: 0.115649,
      comment: "Dampers Club 的 pooh-sticks course 曾从 John's Old Bridge 到 Bridge of Sighs。",
      kind: "bridge",
      branchId: backs,
      branchIds: [backs],
    },
    {
      id: "cambridge-bridge-of-sighs",
      region: "cambridge",
      name: "Bridge of Sighs · St John's College",
      lat: 52.2083921,
      lng: 0.1158507,
      comment: "低桥与集中船流使这里成为 pole-snatching、pooh-sticks 和 Dampers Club 掌故最密集的地点之一。",
      kind: "bridge",
      branchId: backs,
      branchIds: [backs],
    },
    {
      id: "cambridge-quayside",
      region: "cambridge",
      name: "Quayside punt stations",
      lat: 52.2096905,
      lng: 0.116297,
      comment: "Magdalene Bridge 南侧的公共上落区；当代 licensed punt stations 集中，出入时留意横向离岸的 boats。",
      kind: "hire",
      branchId: backs,
      branchIds: [backs],
    },
    {
      id: "cambridge-magdalene-bridge",
      region: "cambridge",
      name: "Magdalene Bridge",
      lat: 52.2098489,
      lng: 0.1165565,
      comment: "The Backs 北端最明确的道路桥；过桥后转向 Jesus Green，水面使用方式开始变化。",
      kind: "bridge",
      branchId: backs,
      branchIds: [backs],
    },
    {
      id: "cambridge-jesus-lock",
      region: "cambridge",
      name: "Jesus Lock · city route limit",
      lat: 52.2127883,
      lng: 0.1208425,
      comment: "Jesus Lock 控制 The Backs 水位。下游是 college eights 常用水面，不列入本 app 的普通自助 punting 主路线。",
      kind: "weir",
      branchId: backs,
      branchIds: [backs],
    },
    {
      id: "cambridge-sheeps-green",
      region: "cambridge",
      name: "Sheep's Green Bridge",
      lat: 52.1952199,
      lng: 0.116289,
      comment: "从 Granta Place 出发约 15 分钟的早期界标；离开城市前可在这里重新判断时间与操控。",
      kind: "bridge",
      branchId: grantchester,
      branchIds: [grantchester],
    },
    {
      id: "cambridge-paradise",
      region: "cambridge",
      name: "Paradise Nature Reserve",
      lat: 52.1939356,
      lng: 0.1135972,
      comment: "当前 hire guide 约 35 分钟可达的安静河段；树影较多，仍应留意低枝、swimmers 与对向 craft。",
      kind: "place",
      branchId: grantchester,
      branchIds: [grantchester],
    },
    {
      id: "cambridge-grantchester-meadows",
      region: "cambridge",
      name: "Grantchester Meadows",
      lat: 52.190381,
      lng: 0.1047132,
      comment: "城市建筑在这里让位于 meadow 与 field；长段无明显桥梁，应借河弯、步道和定位确认进度。",
      kind: "place",
      branchId: grantchester,
      branchIds: [grantchester],
    },
    {
      id: "cambridge-orchard-landing",
      region: "cambridge",
      name: "The Orchard landing · Grantchester",
      lat: 52.1778325,
      lng: 0.0995544,
      comment: "右岸小上岸点可步行穿过 meadow 到 The Orchard；也可继续步行去 The Red Lion 与 The Green Man。妥善系船，不要把 landing 当作永久 mooring。",
      kind: "hospitality",
      branchId: grantchester,
      branchIds: [grantchester, byron],
    },
    {
      id: "cambridge-grantchester-mill-fork",
      region: "cambridge",
      name: "Grantchester Mill fork",
      lat: 52.1766458,
      lng: 0.0994755,
      comment: "短的右侧分汊通往 Grantchester Mill；去 Byron's Pool 走左侧延伸，不要在岔口贸然加速。",
      kind: "turn",
      branchId: byron,
      branchIds: [byron],
    },
    {
      id: "cambridge-byron-pool-weir",
      region: "cambridge",
      name: "Byron's Pool weir / sluice",
      lat: 52.1713229,
      lng: 0.0984129,
      comment: "本地图 punting 上限。concrete weir / sluice 前提早折返；旁有 fish pass，但不构成 boat passage。",
      kind: "weir",
      branchId: byron,
      branchIds: [byron],
    },
  ];

  const branchIds = new Set(branches.map((branch) => branch.id));
  data.branches = [...(data.branches || []).filter((branch) => !branchIds.has(branch.id)), ...branches];
  const waypointIds = new Set(branchWaypoints.map((waypoint) => waypoint.id));
  data.branchWaypoints = [...(data.branchWaypoints || []).filter((waypoint) => !waypointIds.has(waypoint.id)), ...branchWaypoints];
})();
