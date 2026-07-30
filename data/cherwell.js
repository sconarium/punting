(function () {
  "use strict";

  const data = window.THAMES_DATA;
  if (!data) return;

  // Polyline precision 5. Coordinates decode as [longitude, latitude].
  // Geometry follows OpenStreetMap waterways; route choices and cautions follow
  // John Eade's seven Cherwell punting pages on thames.me.uk.
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

  function joinRoutes(...routes) {
    return routes.reduce((joined, route) => {
      if (!joined.length) return [...route];
      const first = route[0];
      const last = joined[joined.length - 1];
      const startsAtLast = first && last && first[0] === last[0] && first[1] === last[1];
      return joined.concat(startsAtLast ? route.slice(1) : route);
    }, []);
  }

  const route = {
    oldMouth: decodePolyline("}gyzHlnsFQoAK_ABq@NaAJe@H[DY@e@Ic@Si@M_@Ne@Vg@AoAUg@Kk@EYY{@SM_@Ik@Sc@KIKUU"),
    newCut: decodePolyline("_yxzHpyrFmAg@kAq@a@Os@_@uCqA{Ay@{@ImARiAP"),
    lowerCommon: decodePolyline("unyzHvqrF{ATu@^i@l@a@b@g@j@YVaAb@_@VYLa@EWGcAE[IWHMXEhAA`@WXe@RcAk@s@s@cA?OSQk@CQm@cEUy@SeAIi@QSaAEg@Eg@OEa@[g@QP"),
    lowerEast: decodePolyline("k}yzH~yrFaAmE[aBm@{@i@{@kAu@uAc@aAUe@?]Fw@e@i@u@EY_@s@"),
    magdalenMain: decodePolyline("stzzHdkrFBc@Iu@KgAWwBu@cFUu@aA}Aq@kBGMMYg@q@Wy@s@qB[s@g@q@MKw@o@_AOOE@KJqABq@JqBa@SSG_@S[a@e@U_AR[|@}@Su@b@o@h@w@d@o@Nc@b@_@r@Wv@ULm@Zm@v@e@P[l@c@|BS^It@{@hD[lA_@xADnAL~BEt@Oz@a@d@y@|@Sl@SZ_@NO@a@Ac@Y"),
    magdalenWater: decodePolyline("stzzHdkrFSJ_@Qi@i@s@i@o@_@g@M_@U_@_@MGc@@aAXi@Hm@LcAB]KOeAi@yB@MDi@D}@B{@FwBLuDNwE@W@SB}@B_A"),
    kingsMillBackwater: decodePolyline("{r{zHj~pF@{A^Iv@Ud@A~@D}DZI@E@M@[L{AzAeBpAg@`@}@vAa@jAo@hBmAzFw@dC_@|AApALt@Jl@?lAOl@_@`@yAbB{@P_@O[D"),
    rollersToBardwell: decodePolyline("}l|zH`hrFk@Z]h@Hz@\\pAFbAUjADx@Oj@Y\\a@HWP_LvL[\\a@Vk@TcALUBm@Wa@KkAJoA?EAiDNyADs@Zc@\\Sl@Or@GbBKh@iCvAsARaCt@mCfA"),
    bardwellToVictoria: decodePolyline("ch~zHjysFwAL{@YMEsAQ_AsAc@_G{BmCsF}ByBaBqAaA}EgDuAu@g@ESAy@FcAF"),
    victoriaToIslip: decodePolyline("gt_{HlyrF]@o@H_@r@wA`DiAxC_BbB_AlBgA~ASvCgAlFQn@sBbHiClJ}@vFe@tAoBPgAV}@HwBmC}Aq@aBl@[@cBsEq@qCa@_DMwBQ{BWu@CI_AkACEQQSc@IQISIk@?o@BaABwDCiB@{E@}AQoFGkACe@Ok@u@k@c@e@UYMMMIKGCAGAOCOAeAFIAIAGAOEMGKIIMEMGOG[G[EgACQGKKIQGQ?EAIGGEACCGAQBiBAUEe@AECMEIGK[s@EGEGGEKCMCI@G?{@TYH[Fw@DODOBg@ZKHSV[\\iAhAgAv@gBjAo@b@SNWVYZa@h@QZOZUh@O`@M`@G^Mp@CX?^Bv@AJ?LCPI^KZiBjDm@nAg@x@aBxCWj@Wh@gBxEaAvBOTQTSPMFUH[B{@RY?uAG_@KMGIGIIKMS]Qu@Os@e@mAKi@OeAGw@AS?O?O@SB]B{BAKEm@m@}DyAoEa@{@_@c@YYSOEECGKY[a@OMIGYKGEm@@gAYoAUsAB_@N]p@YhAu@`E{@nBy@lAoCtDcCpD{@dAa@Vg@Ba@Um@o@c@o@]u@W}AUqA]{Ac@eBW_BK{AGyAKq@Sg@m@{A_@eAO}AUiAe@wAsAwCuImMeAaAuC_CaDcCkAaAiCq@sAY}AQcAI_A?yBRo@D_Cd@w@\\aB|@}Br@kAh@wAv@wClDgA~@[RKJ"),
    rayWeirSpur: decodePolyline("e_h{HzsqFKIa@I"),
  };

  const portageAtRollers = [
    [-1.2459168, 51.7602069],
    [-1.2459349, 51.7603943],
    [-1.2456135, 51.760307],
  ];

  const branches = [
    {
      id: "cherwell-lower-loop",
      name: "Cherwell 1 · Old Mouth / New Cut 环线",
      from: "Isis / Thames",
      to: "Magdalen Bridge",
      comment: "牛津市中心经典小环线：Old Mouth 与 New Cut 都连接 Isis；进入共同河道后，经 Jubilee Bridge 和 Botanic Garden 一带抵达 Magdalen Bridge。",
      note: "Old Mouth 较窄且弯；New Cut 更直接。共同河道在 Botanic Garden 岛附近有两条可见水道，地图同时保留，现场按水深和通行状况选择。",
      route: joinRoutes(route.oldMouth, route.lowerCommon),
      segments: [route.oldMouth, route.newCut, route.lowerCommon, route.lowerEast],
      distanceKm: 1.3,
      fitZoom: 15,
      difficulty: "市区环线",
      pageIds: ["s02408-htm", "s02410-htm", "s02412-htm", "s01669-htm", "s01675-htm"],
    },
    {
      id: "cherwell-magdalen-rollers",
      name: "Cherwell 2 · Magdalen Bridge 至 Punt Rollers",
      from: "Magdalen Bridge",
      to: "Cherwell Punt Rollers",
      comment: "最需要辨认岔口的一段：主路线绕 Magdalen Water、在两处 T 字口按作者指示转向，再沿 Mesopotamia 的主航道到 rollers 下游。",
      note: "逆流顺序：第一个带大管道的 footbridge 后右转；下一个 T 字口左转；绕 King's Mill 一带保持主航道。赭色虚线是作者不建议的浅支汊，不应当作主路线。",
      route: route.magdalenMain,
      segments: [route.magdalenMain],
      advisorySegments: [route.magdalenWater, route.kingsMillBackwater],
      distanceKm: 1.6,
      fitZoom: 15,
      difficulty: "多岔口",
      pageIds: ["s02412-htm", "s02412a-htm", "s02413-htm", "s02414-htm", "s01675-htm"],
    },
    {
      id: "cherwell-rollers-bardwell",
      name: "Cherwell 3 · Punt Rollers 至 Bardwell Road",
      from: "Punt Rollers",
      to: "Cherwell Boathouse",
      comment: "rollers 把 Lower Cherwell 与 Upper Cherwell 分开；上岸搬船后，经 Parson's Pleasure、High / Rainbow Bridge 到 Bardwell Road。",
      note: "橙色点线是搬船而不是水路。作者建议全员在 rollers 左侧混凝土平台下船，重 punt 最好多人或用长绳直拉。",
      route: route.rollersToBardwell,
      segments: [route.rollersToBardwell],
      portageSegments: [portageAtRollers],
      distanceKm: 1.4,
      fitZoom: 15,
      difficulty: "需搬船",
      pageIds: ["s02413-htm", "s02414-htm", "s02420-htm", "s01675-htm"],
    },
    {
      id: "cherwell-bardwell-victoria",
      name: "Cherwell 4 · Bardwell Road 至 Victoria Arms",
      from: "Cherwell Boathouse",
      to: "Victoria Arms",
      comment: "作者最推荐给初学者的安静往返段；从 Bardwell Road 经 Wolfson College 和乡野弯道，到 Marston Ferry Road bridge 后的 Victoria Arms。",
      note: "从 Cherwell Boathouse 出发比 Magdalen Bridge 安静直接。Victoria Arms 的上岸点在左岸、道路桥上游不远处。",
      route: route.bardwellToVictoria,
      segments: [route.bardwellToVictoria],
      distanceKm: 0.9,
      fitZoom: 15,
      difficulty: "初学者友好",
      pageIds: ["s02420-htm", "s02425-htm", "s01675-htm"],
    },
    {
      id: "cherwell-victoria-islip",
      name: "Cherwell 5 · Victoria Arms 至 Islip",
      from: "Victoria Arms",
      to: "River Ray Weir / Islip",
      comment: "长距离 Upper Cherwell 探索段，经 A40 Cherwell Bridge、Water Eaton 与连续乡野弯道，到 River Ray 汇入口旁的 Ray Weir。",
      note: "这不是 River Ray 长距离路线：绝大部分仍沿 Cherwell；终点只在汇入口处短短进入 Ray 至 weir。作者记录过浅水、较强流速和倒树，不能把历史记录当成当天可通行保证。",
      route: joinRoutes(route.victoriaToIslip, route.rayWeirSpur),
      segments: [route.victoriaToIslip, route.rayWeirSpur],
      distanceKm: 7.1,
      fitZoom: 13,
      difficulty: "经验者长途",
      pageIds: ["s02425-htm", "s02430-htm", "s01675-htm"],
    },
  ];

  const lower = "cherwell-lower-loop";
  const magdalen = "cherwell-magdalen-rollers";
  const rollers = "cherwell-rollers-bardwell";
  const bardwell = "cherwell-bardwell-victoria";
  const upper = "cherwell-victoria-islip";

  const branchWaypoints = [
    {
      id: "cherwell-old-mouth",
      name: "Old Mouth of Cherwell",
      lat: 51.7441535,
      lng: -1.2517502,
      comment: "Christ Church Meadow 旁、桥下转入；狭窄弯曲，只适合无动力小艇。",
      kind: "turn",
      pageId: "s02408-htm",
      branchId: lower,
      branchIds: [lower],
    },
    {
      id: "cherwell-new-cut",
      name: "New Cut of Cherwell",
      lat: 51.7417551,
      lng: -1.2484099,
      comment: "Boathouses 下游的较直接入口；与 Old Mouth 可组成经典牛津小环线。",
      kind: "turn",
      pageId: "s01669-htm",
      branchId: lower,
      branchIds: [lower],
    },
    {
      id: "cherwell-mouths-junction",
      name: "Old Mouth / New Cut 汇合口",
      lat: 51.7452308,
      lng: -1.247159,
      comment: "逆流往 Magdalen Bridge 继续北行；从 Old Mouth 来时，右转会经 New Cut 返回 Isis。",
      kind: "turn",
      pageId: "s02410-htm",
      branchId: lower,
      branchIds: [lower],
    },
    {
      id: "cherwell-jubilee-bridge",
      name: "Jubilee Bridge · Christ Church Meadow",
      lat: 51.7475206,
      lng: -1.2486438,
      comment: "作者称 Cherwell footbridge；从 Isis 进入后最醒目的早期定位点。",
      kind: "bridge",
      pageId: "s02410-htm",
      branchId: lower,
      branchIds: [lower],
    },
    {
      id: "cherwell-botanic-split",
      name: "Botanic Garden 水道分岔",
      lat: 51.7475801,
      lng: -1.2484758,
      comment: "岛两侧水道都画入地图；作者概览称可绕行，现场仍应选水深清楚、无阻塞的一侧。",
      kind: "turn",
      pageId: "s02410-htm",
      branchId: lower,
      branchIds: [lower],
    },
    {
      id: "cherwell-magdalen-bridge",
      name: "Magdalen Bridge Boathouse",
      lat: 51.7513841,
      lng: -1.2463244,
      comment: "租船站在桥上游左岸；此处水流和船流都可能让刚出发的几米最难操控。",
      kind: "hire",
      pageId: "s02412-htm",
      branchId: lower,
      branchIds: [lower, magdalen],
    },
    {
      id: "cherwell-pipe-footbridge-turn",
      name: "Pipe footbridge 后第一个 T 字口",
      lat: 51.7542498,
      lng: -1.2400464,
      comment: "逆流到带大管道的 footbridge 后右转；左转是经 mill 回 Magdalen Bridge 的浅支流，不建议。",
      kind: "turn",
      pageId: "s02413-htm",
      branchId: magdalen,
      branchIds: [magdalen],
    },
    {
      id: "cherwell-kings-mill-turn",
      name: "King's Mill 前第二个 T 字口",
      lat: 51.7551791,
      lng: -1.2383431,
      comment: "逆流左转进入主航道；右侧回钻桥后的支汊有低管阻断。",
      kind: "turn",
      pageId: "s02413-htm",
      branchId: magdalen,
      branchIds: [magdalen],
    },
    {
      id: "cherwell-kings-mill-island",
      name: "King's Mill 岛汊",
      lat: 51.758353,
      lng: -1.241796,
      comment: "按作者指示保持左侧主航道；另一侧通向旧 mill weir，浅且曾经阻塞。",
      kind: "turn",
      pageId: "s02413-htm",
      branchId: magdalen,
      branchIds: [magdalen],
    },
    {
      id: "cherwell-side-weir-one",
      name: "Mesopotamia 侧向堰流 · 1",
      lat: 51.757949,
      lng: -1.240407,
      comment: "Mill Stream 从右岸侧向汇入；夏季通常容易通过，侧流会把 punt 整体横移。",
      kind: "warning",
      pageId: "s02413-htm",
      branchId: magdalen,
      branchIds: [magdalen],
    },
    {
      id: "cherwell-side-weir-two",
      name: "Mesopotamia 侧向堰流 · 2",
      lat: 51.758977,
      lng: -1.244885,
      comment: "第二处右岸侧流；作者提醒若侧流已难以通过，rollers 通常也不会适合使用。",
      kind: "warning",
      pageId: "s02413-htm",
      branchId: magdalen,
      branchIds: [magdalen],
    },
    {
      id: "cherwell-punt-rollers",
      name: "Cherwell Punt Rollers · 下游平台",
      lat: 51.7603943,
      lng: -1.2459349,
      comment: "此处不是连续水路：所有乘员先在左侧混凝土平台下船，再把 punt 拉过 rollers。",
      kind: "portage",
      pageId: "s02413-htm",
      branchId: magdalen,
      branchIds: [magdalen, rollers],
    },
    {
      id: "cherwell-high-bridge",
      name: "High Bridge · Rainbow Bridge",
      lat: 51.7631151,
      lng: -1.2501298,
      comment: "University Parks 的高拱步桥，是 Upper Cherwell 上极清楚的定位点。",
      kind: "bridge",
      pageId: "s02414-htm",
      branchId: rollers,
      branchIds: [rollers],
    },
    {
      id: "cherwell-boathouse",
      name: "Cherwell Boathouse · Bardwell Road",
      lat: 51.7697346,
      lng: -1.2539515,
      comment: "左岸 punt hire；作者认为这里安静直接，最适合初次练习。",
      kind: "hire",
      pageId: "s02420-htm",
      branchId: rollers,
      branchIds: [rollers, bardwell],
    },
    {
      id: "cherwell-wolfson-harbour",
      name: "Wolfson College Punt Harbour",
      lat: 51.7707258,
      lng: -1.2540374,
      comment: "左岸浅小港；经过后河流逐渐离开建筑，进入连续乡野弯道。",
      kind: "place",
      pageId: "s02420-htm",
      branchId: bardwell,
      branchIds: [bardwell],
    },
    {
      id: "cherwell-marston-ferry-bridge",
      name: "Marston Ferry Road Bridge",
      lat: 51.7762118,
      lng: -1.2483072,
      comment: "有车流声的道路桥；Victoria Arms 在桥上游约百米左岸。",
      kind: "bridge",
      pageId: "s02420-htm",
      branchId: bardwell,
      branchIds: [bardwell],
    },
    {
      id: "cherwell-victoria-arms",
      name: "Victoria Arms · 左岸上岸点",
      lat: 51.7767163,
      lng: -1.2480596,
      comment: "常见往返折返点；作者记录的 mooring / pub 位于逆流方向左岸。",
      kind: "hospitality",
      pageId: "s02425-htm",
      branchId: bardwell,
      branchIds: [bardwell, upper],
    },
    {
      id: "cherwell-a40-bridge",
      name: "A40 Cherwell Bridge",
      lat: 51.7861462,
      lng: -1.2540044,
      comment: "进入更偏远 Upper Cherwell 的明确界标；作者称到这里已可考虑折返。",
      kind: "bridge",
      pageId: "s02430-htm",
      branchId: upper,
      branchIds: [upper],
    },
    {
      id: "cherwell-upper-island",
      name: "A40 上游岛汊 · 保持左侧",
      lat: 51.7866995,
      lng: -1.2477135,
      comment: "作者指示逆流保持左侧主航道；另一水道未勘察，不列为 punting 路线。",
      kind: "turn",
      pageId: "s02430-htm",
      branchId: upper,
      branchIds: [upper],
    },
    {
      id: "cherwell-sparsey-bridge",
      name: "Sparsey Footbridge",
      lat: 51.8033128,
      lng: -1.249376,
      comment: "Water Eaton 前的乡野步桥；用于在长而曲折的上游段确认进度。",
      kind: "bridge",
      pageId: "s02430-htm",
      branchId: upper,
      branchIds: [upper],
    },
    {
      id: "cherwell-water-eaton",
      name: "Water Eaton Manor",
      lat: 51.805049,
      lng: -1.251555,
      comment: "从河上可见 Jacobean manor；作者曾收到这里可能被倒树阻塞的报告。",
      kind: "history",
      pageId: "s02430-htm",
      branchId: upper,
      branchIds: [upper],
    },
    {
      id: "cherwell-upper-east-bend",
      name: "Upper Cherwell 大弯 · 仍沿 Cherwell",
      lat: 51.8099895,
      lng: -1.2419822,
      comment: "这里是 Cherwell 自身的大弯，不是转入 River Ray；继续沿曲折主河道往 Islip。",
      kind: "turn",
      pageId: "s02430-htm",
      branchId: upper,
      branchIds: [upper],
    },
    {
      id: "cherwell-ray-confluence",
      name: "River Ray 汇入口",
      lat: 51.819549,
      lng: -1.2423759,
      comment: "Ray 在这里汇入 Cherwell；Ray Weir 位于汇入口上方约 30 米，不要继续接近堰流。",
      kind: "warning",
      pageId: "s02430-htm",
      branchId: upper,
      branchIds: [upper],
    },
    {
      id: "cherwell-islip-weir",
      name: "Ray Weir · 作者传统 punt 上限",
      lat: 51.8197839,
      lng: -1.2422763,
      comment: "作者在低水位时到此折返；堰脚浅、有石块，地图终点不表示安全接近。",
      kind: "weir",
      pageId: "s02430-htm",
      branchId: upper,
      branchIds: [upper],
    },
  ];

  const branchIds = new Set(branches.map((branch) => branch.id));
  branches.forEach((branch) => { branch.region = "oxford"; });
  branchWaypoints.forEach((waypoint) => { waypoint.region = "oxford"; });
  data.branches = [...(data.branches || []).filter((branch) => !branchIds.has(branch.id)), ...branches];
  const waypointIds = new Set(branchWaypoints.map((waypoint) => waypoint.id));
  data.branchWaypoints = [...(data.branchWaypoints || []).filter((waypoint) => !waypointIds.has(waypoint.id)), ...branchWaypoints];

  branches.forEach((branch) => {
    branch.pageIds.forEach((pageId) => {
      const page = data.pages.find((item) => item.id === pageId);
      if (!page) return;
      page.branchIds = [...new Set([...(page.branchIds || []), branch.id])];
      if (!page.branchId) page.branchId = branch.id;
    });
  });

  data.meta.branchCount = data.branches.length;
  data.meta.branchWaypointCount = data.branchWaypoints.length;
  data.meta.coverage = `${data.meta.coverage}; five detailed Oxford Cherwell punting sections from the Isis mouths to Ray Weir at Islip`;
})();
