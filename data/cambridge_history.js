(function () {
  "use strict";

  const data = window.THAMES_DATA;
  if (!data) return;

  const source = {
    title: "Punting: its history and techniques",
    author: "R. T. Rivington",
    year: 1983,
  };

  function story({ id, name, comment, pages, summary, lat, lng, branchIds = [], kind = "history" }) {
    return {
      id,
      name,
      address: `book:${id}`,
      comment,
      kind,
      region: "cambridge",
      lat,
      lng,
      branchId: branchIds[0] || null,
      branchIds,
      bookSummary: true,
      source: { ...source, pages },
      summary,
    };
  }

  const backs = "cambridge-backs";
  const grantchester = "cambridge-grantchester";
  const byron = "cambridge-byron-pool";

  const stories = [
    story({
      id: "book-cambridge-first-pleasure-punts",
      name: "Cambridge 的第一批 Thames pleasure punts",
      comment: "Thomas Prime、Don Strange、B. F. H. Dammers 与 S. E. Howard",
      pages: "155-156",
      lat: 52.2019341,
      lng: 0.1157178,
      branchIds: [backs],
      summary: [
        "书中判断 Thames pleasure punts 大约到 1902-1904 年才进入 Cambridge。Don Strange 记得最早两只都是私人从 Thames 带来，一只放在 Dolby's，另一只放在 Strange's；Thomas Prime 则可能是在 Henley 看到 punt racing 后，把这种船带入本地。",
        "B. F. H. Dammers 与 S. E. Howard 的家人相信，两位 Pembroke College undergraduates 早在 1895 年后便自造过一只短而粗朴的 saloon punt。确切“第一只”无法定论，但到 1907 年，pleasure punts 已迅速取代许多 rowing boats，成为 Cambridge river outings 的主角。",
      ],
    }),
    story({
      id: "book-cambridge-fen-navigation",
      name: "The Backs 河床里的 barge causeway",
      comment: "Cam Conservancy、hithes 与在河里拉船的 horses",
      pages: "156-158",
      lat: 52.2037868,
      lng: 0.1141329,
      branchIds: [backs],
      summary: [
        "Cambridge 位于 Fens 南缘，铁路以前依靠 Fen waterways 运入重货。Cam Conservancy 于 1702 年依法成立，负责保持 Clayhithe Ferry 至城内 mills 的航道；barges 必须穿过 college grounds 和 The Backs 才能到达 Mill Lane 一带。",
        "The Backs 没有普通 towpath，因此河床中铺了一条 causeway，让 horses 胸口浸水牵引 barges。今天仍有少数铺石处会让 punt pole 缺乏抓力，甚至发出清脆撞击声；但大多数河床仍浅而坚实，很适合 punting。",
      ],
    }),
    story({
      id: "book-cambridge-cam-granta-names",
      name: "Cam、Granta 与两个水位",
      comment: "Granta Place weir、Jesus Lock 与 Cambridge 的旧名",
      pages: "156-158",
      lat: 52.2013901,
      lng: 0.1158593,
      branchIds: [backs, grantchester],
      summary: [
        "书中用 Granta 指 weir 以上、通往 Grantchester 的 upper river，用 Cam 指 weir 以下、穿过 The Backs 的河段。Granta 可能原本是整条河的旧名；城名从 Grantebrycge 演变为 Cambridge 后，河名 Cam 反而从新城名倒推而来。",
        "南端的 Granta Place weir / rollers 把两条常用 punting 水路分在不同水位；北端则由 Jesus Lock 控制 The Backs 水深。书中把这套水位结构作为 Cambridge 路线比 Oxford 更短、更受管理的根本原因。",
      ],
    }),
    story({
      id: "book-cambridge-backs-decorum",
      name: "白衣、花园礼仪与 pole-snatching",
      comment: "1920s-1930s 的 The Backs，与后来更喧闹的 river playground",
      pages: "158-159",
      lat: 52.2050025,
      lng: 0.1140359,
      branchIds: [backs],
      summary: [
        "1920s 和 1930s 的习惯要求 The Backs 上的人 punt 得好、穿得体面，通常一身 white；想嬉闹或技术不足者会去 Granta 或 St John's College 以下。书中认为，这种礼仪来自一个直观想法：The Backs 本来就是 college gardens 的组成部分。",
        "后来水面越来越像 playground。河窄、桥低、punts 贴得近，抢走对面 punter 的 pole、在桥上勾 pole，甚至把人推进水里，都被当作 Cambridge 式恶作剧；但书也提醒，拥挤水面上的玩笑很容易越界。",
      ],
    }),
    story({
      id: "book-cambridge-fen-punts",
      name: "fen punts、quant 与 Anchor Hotel 的 1811 cartoon",
      comment: "pleasure punt 以前的 East Anglian 平底工作船",
      pages: "159-160",
      lat: 52.2019341,
      lng: 0.1157178,
      branchIds: [backs],
      summary: [
        "Cambridge 一带过去有 double-ended fen punts：约 16 ft 长、4 ft 宽，吃水浅、freeboard 低，适合狭窄 channels 和多风的 Fens。它们常用 quant 推进；quant 顶端有横木，可顶在腋下完成 shove。",
        "Henry Bunbury 的 Fishing in 1811 画了一只类似 fishing punt，复制品曾挂在 Anchor Hotel。画中有圆顶建筑，所以场景并非 Cambridge；与它成对的 Thames fishing punt 版本则挂在 Oxford 附近 Binsey 的 Perch Inn。",
      ],
    }),
    story({
      id: "book-cambridge-raverat-garden-punt",
      name: "Gwen Raverat 家那只会沉的 garden punt",
      comment: "Newnham Grange · Darwin family 的水上“wheel-barrow”",
      pages: "160-161",
      lat: 52.2008878,
      lng: 0.1140164,
      branchIds: [backs, grantchester],
      summary: [
        "在 Thames pleasure punts 普及之前，Cambridge 已熟悉小型 work-punts 或 garden punts。Gwen Raverat 回忆 Newnham Grange 的孩子们用一只方头平底旧船玩耍；它本来供 gardener 割水草，总要舀水，有时会在孩子脚下直接沉掉。",
        "她的妹妹 Margaret Keynes 把同一只船形容为 water-borne cart 或 floating wheel-barrow：捞回掉进河里的 ball、运东西、割 weeds 都靠它。Newnham Grange 今天属于 Darwin College，这则记忆把现代 elegant punt 与本地工作船传统连在一起。",
      ],
    }),
    story({
      id: "book-cambridge-strange-girton",
      name: "Don Strange、J. A. C. Croft 与 Girton women",
      comment: "第一只本地 Thames punt，以及站上 deck 的 Cambridge 姿势",
      pages: "161-162, 167",
      lat: 52.2058501,
      lng: 0.1139577,
      branchIds: [backs],
      summary: [
        "Don Strange 相信 Cambridge 第一只本地制造的 Thames punt 是 cousin Sam Strange 在家族 yard 里仿造的。Don 后来由 Trinity College undergraduate J. A. C. Croft 教授 punting；Croft 来自 Maidenhead，1913 年赢得 Thames Amateur Punting Championship，并把 saloon 拆掉后从船中央示范 racing style。",
        "Strange 坚信站在 deck 上 punting 的做法由 Girton undergraduates 引入，并记得她们初次采用高站位时非常醒目。书中约 1914 年的 cartoon 也画出三人站在 deck 上；Strange 当时在 Garrett Hostel Bridge 下方设有 hiring rafts。",
      ],
    }),
    story({
      id: "book-cambridge-anchor-boatyards",
      name: "The Anchor 周围的 Dolby、Pye 与 Scudamore",
      comment: "从 Dye House 到 Cambridge punting business cluster",
      pages: "162-163",
      lat: 52.2019341,
      lng: 0.1157178,
      branchIds: [backs],
      summary: [
        "The Anchor 旁的 granary 大约建于 1840；Pye 从 1899 到 1913 年租用，之后成为 Dolby's Boat Building Works。F. H. Dolby 自 1897 年经营 Anchor Boat Houses，manager Thomas Prime 则与 Cambridge 最早引入 punts 的传说相连。",
        "到 1922 年，原 works 已由 F. Scudamore 接手。书追溯 pub 更早的名字 Dye House，认为它暗示附近 laundering 行业；Laundress Lane、Laundress Green、boat yards 与 pub 因而共同形成 Mill Pond 南端独特的河岸历史层。",
      ],
    }),
    story({
      id: "book-cambridge-reynolds-gramophones",
      name: "Belle Vue Gardens 的 tea hampers 与 gramophones",
      comment: "George Reynolds 在 Robinson Crusoe Island 一带的 river leisure",
      pages: "163, 167",
      lat: 52.1982067,
      lng: 0.1174662,
      branchIds: [grantchester],
      summary: [
        "George Reynolds 在后来 Garden House Hotel 一带经营 Belle Vue Gardens，园内有 tennis courts、miniature golf，也出租 punts、tea hampers，甚至 gramophones。书中认为 gramophone 与 Cambridge punting 的关系比其他地方更鲜明。",
        "约 1914 年的 The Backs cartoon 里，一只 punt 载着巨大的 gramophone；作者幽默地补充，那只船大概没有正在行驶。Dolby 同期也曾在 Sheep's Green 或 Robinson Crusoe Island 上方设 hire point。",
      ],
    }),
    story({
      id: "book-cambridge-end-technique",
      name: "为什么 Cambridge 站在 deck 上、bow-first",
      comment: "与 Oxford stern-first 传统相反的本地技术",
      pages: "13, 163-164, 173-184",
      lat: 52.2022128,
      lng: 0.1150498,
      branchIds: [backs],
      summary: [
        "Cambridge 的典型做法是站在 deck 上，让 punt bow-first 前进；Oxford 则通常站在 open end，让船 stern-first 前进。书中认为 Cambridge 在 pleasure punt 刚传入时缺少传统 watermen 的统一教学，undergraduates 因而发展出对 novice 方便的本地方法。",
        "Cambridge 的 punts 也逐渐变短、变轻，适合狭窄 Granta 与拥挤 The Backs，但 momentum 较小、重心可能更高。地图只提示路线；实际站位、转身和过桥仍应以 hire staff 当天示范为准。",
      ],
    }),
    story({
      id: "book-cambridge-scudamore-tyrrell",
      name: "Scudamore 与 Tyrrell：从 monopoly 到竞争",
      comment: "71 punts、338 paddles，以及 1956 年的新对手",
      pages: "164",
      lat: 52.2096905,
      lng: 0.116297,
      branchIds: [backs],
      summary: [
        "F. Scudamore 1939 年去世后，George Reynolds 买下 business；stock list 包括 71 punts、45 canoes、140 poles 和 338 paddles，另存放 35 只 private punts。1940 年，他又收购 Dolby 与 Strange 的 businesses。",
        "Bullen 和 Banham 在 1950s 初停止出租后，Reynolds 一度垄断 Cambridge punt hire，并继续使用 Scudamore 名号。原 employee S. J. Tyrrell 看到竞争机会，1956 年自行创业，在 Magdalene Bridge 旁 Quayside 经营并造船。",
      ],
    }),
    story({
      id: "book-cambridge-dampers-membership",
      name: "Dampers Club：全身穿衣落水才可入会",
      comment: "The Anchor 的 Sunday meetings 与 per arduum ad alveum",
      pages: "164-165",
      lat: 52.2019341,
      lng: 0.1157178,
      branchIds: [backs],
      summary: [
        "Cambridge Dampers Club 是一个非正式的 river social club，入会条件是曾非自愿地从 punt 全身穿衣掉进 Cam。名字约在 1958 年由 Damper 变成 Dampers；club motto per arduum ad alveum 意为“through difficulty to the river bed”。",
        "1972/3 的 Varsity Handbook 记载，会员在冬季举行带酒精的社交活动，夏季则有 punt jousting，并在每周日晚上于 The Anchor 聚会。club 也自认为承担维护 Cambridge punting interests 的责任。",
      ],
    }),
    story({
      id: "book-cambridge-dampers-charon",
      name: "Dampers 对 Charon：桥上抢 pole 的 home advantage",
      comment: "1953-1973 Oxford-Cambridge punt relay",
      pages: "144-145, 164-165",
      lat: 52.2058501,
      lng: 0.1139577,
      branchIds: [backs],
      summary: [
        "Dampers Club 1952 年把 challenge 贴到 Oxford，促成 Charon Club 成立。1953 年第一场 relay 在 The Backs 举行；Cambridge 先输 toss，却热心地把泥更多的 bank 推荐给 Oxford。比赛后来在两城水路轮流进行。",
        "The Backs 的桥低到岸上人能勾走 punt pole，这对 Oxford team 是陌生风险。1957 年 Cambridge 场有报道说来了 3000 spectators；Oxford 的一名 competitor 因 pole 被桥上人抢走而输掉比赛，现场似乎仍把它视为 fair play。",
      ],
    }),
    story({
      id: "book-cambridge-dampers-games",
      name: "Bridge of Sighs 上的 tiddlywinks",
      comment: "pooh-sticks、punt jousting 与 underwater pram races",
      pages: "165",
      lat: 52.2083921,
      lng: 0.1158507,
      branchIds: [backs],
      summary: [
        "Dampers Club 与 Archimedeans（Cambridge University Mathematical Society）关系最密切。它们举行 tiddlywink matches，甚至办过横跨 Bridge of Sighs 的 tiddlywink race；winter sport 还有从 John's Old Bridge 到 Bridge of Sighs 的 knockout pooh-sticks championship。",
        "夏季主要项目是每周日 punt jousting，后来又发展出 underwater bicycle 与 underwater pram races：把两三辆 pram 绑在一起，在浅水里当船划。club 还动员会员支持 The Backs 的 Madrigal Concert，演唱者由 punts 载入水面。",
      ],
    }),
    story({
      id: "book-cambridge-graham-chapman-race",
      name: "Graham Chapman 与 70-mile overland punt race",
      comment: "1960 World Refugee Year · 把 punt 装上 pram wheels",
      pages: "165-166",
      lat: 52.2058501,
      lng: 0.1139577,
      branchIds: [backs],
      summary: [
        "1960 年，Dampers 为 World Refugee Year 挑战 London University 与 Oxford Charon Club：把 punts 架在 pram wheels 上，从 London 推到 Cambridge，每船还必须带一名 woman passenger。全程约 70 miles，历时接近两天。",
        "参赛者 Graham Chapman 后来成为 Monty Python 成员。他回忆 Cambridge 一度只剩三个人持续推船，其他人去找新的 pram wheels；London 被指少睡、偏离路线等，Oxford 与 Cambridge 则戏剧性地并列冲线。",
      ],
    }),
    story({
      id: "book-cambridge-dampers-dittons",
      name: "“Yours in submergence” 与 Dittons 的六十人远征",
      comment: "Dampers Club 向 Thames punting clubs 发出的奇特挑战",
      pages: "166-168",
      lat: 52.2066636,
      lng: 0.1138501,
      branchIds: [backs],
      summary: [
        "Dampers 写信向 Wraysbury 与 Dittons Skiff and Punting Clubs 挑战 relay，并总以 “Yours in submergence” 结尾，看上去很像 hoax。Dittons 不但接受，还组织了多达六十名 participants 与 spectators 来 Cambridge。",
        "比赛使用 King's 与 Trinity punts、八人 teams 和 human batons。Dittons 轻松赢得第一场；之后众人重新混编，继续各种 races 与 river games。原定分散在 colleges 的 dinner 因人数过多只好取消。",
      ],
    }),
    story({
      id: "book-cambridge-college-fleets",
      name: "The Backs 的 college punt fleets",
      comment: "Magdalene、St John's、Trinity、King's、Queens' 与 Clare",
      pages: "168-169",
      lat: 52.2066636,
      lng: 0.1138501,
      branchIds: [backs],
      summary: [
        "书成书时，The Backs 上六所 undergraduate colleges 都有自己的 punts，估计数量为 Magdalene 2、St John's 12、Trinity 15、King's 7、Queens' 4、Clare 2。其他 colleges 的 undergraduates 往往只能按市场价格租船。",
        "St John's 还把 Bin Brook 的入河口改造成大型 punt harbour，嵌入新建筑下方、利用旧 fish pond 的低洼地蓄水。书据此比较两城：Cambridge 的 punting 未必像 Oxford 那样普遍成为所有 college members 的日常活动。",
      ],
    }),
    story({
      id: "book-cambridge-two-tees",
      name: "Two Tees 与高 freeboard Cambridge punts",
      comment: "Tyrrell、Tyler、Chesterton 与 college fleets",
      pages: "168-169",
      lat: 52.2096905,
      lng: 0.116297,
      branchIds: [backs],
      summary: [
        "Two Tees 即 Tyrrell and Tyler，在 Chesterton 的 Mathie former yard 于 1970 年开始造 punts，客户包括 Queens'、Magdalene、Jesus、St John's、Wolfson 与 Darwin Colleges。",
        "它们的 punts 以高 freeboard 为特征，设计来自两位 builder 在 Banham 工作时对 motor-launch wash 的经验。船一端开口，marine-ply bottom，back rests 直接固定在 sides；能否造到传统 22 ft 长度，还取决于是否买得到足够长的 mahogany。",
      ],
    }),
    story({
      id: "book-cambridge-camford-punt",
      name: "R. F. Bell 与 double-ended Camford punt",
      comment: "为狭窄 Granta 和 Cambridge deck stance 重新设计",
      pages: "169-170",
      lat: 52.200974,
      lng: 0.1162365,
      branchIds: [grantchester, backs],
      summary: [
        "1964 年，D. M. Reynolds 任命 former merchant seaman R. F. Bell 为 Scudamore manager。Bell 从用途出发重新设计传统 punt，到 1967 年形成 Camford punt：21 ft、box frame、两端完全相同，deck 特别加固供人站立。",
        "Camford punt 比 Thames punt 短、轻，容易在狭窄 Granta 掉头和靠岸，也因双端可用而减少 landing-stage 损伤；但重心较高、momentum 较小，操控更像 delicate canoe。书成书时，Scudamore 一百多只 punts 已全部采用这种设计。",
      ],
    }),
    story({
      id: "book-cambridge-wooden-poles",
      name: "Cambridge 为什么仍用 wooden poles",
      comment: "spruce、16 ft，以及曾被放弃的 aluminium",
      pages: "170",
      lat: 52.2014776,
      lng: 0.1157626,
      branchIds: [backs, grantchester],
      summary: [
        "书成书时，Cambridge 两家主要 hire businesses 只提供 wooden poles。aluminium 曾试用，但早期型号会把手染黑、受力弯曲，因此在 Oxford 后来解决这些问题之前，Cambridge 已经放弃。",
        "spruce poles 仍由 Oxford 的 F. Collar 供应，标准长 16 ft；在 The Backs 这样浅而窄的水面，这个长度有时反而显得笨重。Scudamore 也试过 Polish laminated poles，却没有得到明显优势。",
      ],
    }),
    story({
      id: "book-cambridge-grantchester-goal",
      name: "Grantchester：传统的 upstream goal",
      comment: "The Orchard、The Red Lion、The Green Man 与 meadow country",
      pages: "170-171",
      lat: 52.1778325,
      lng: 0.0995544,
      branchIds: [grantchester, byron],
      summary: [
        "书把 Grantchester 称为 Cambridge punters 通常的 upstream goal。Granta Place 以上水更深、泥更多，河道穿过 fields 与 open country；这与 The Backs 的 college gardens 形成清楚对照。",
        "书中列出 The Orchard Tea Rooms 供 tea，The Red Lion 与 The Green Man 供 drinks 和 meals。今天从 Cambridge 到 Red Lion meadow 的当地指引仍建议为往返预留 2-3 小时；到 river landing 后还需把步行、停留和返程水流计入。",
      ],
    }),
    story({
      id: "book-cambridge-byron-pool",
      name: "Byron's Pool：书中 Cambridge punting 上限",
      comment: "Grantchester 以上半英里，窄河尽头的 weir",
      pages: "158, 171",
      lat: 52.1713229,
      lng: 0.0984129,
      branchIds: [byron],
      summary: [
        "书中说，从 Granta Place 到 Byron's Pool 约 2.5 miles；Grantchester 以上河道愈发狭窄，有些地方窄到“almost be jumped across”。真正阻止继续上行的是 Byron's Pool 的 weir。",
        "现代 Grantchester Village 指引仍确认 punt、canoe 与 rowing boat 可从 Cambridge 上行到 Byron's Pool；British Canoeing route 则要求在 concrete weir / sluice 前折返，并说明 fish pass 不是 boat passage。",
      ],
    }),
    story({
      id: "book-cambridge-chauffeur-punts",
      name: "1975 年出现的 Cambridge “chauffeur” punts",
      comment: "strawberries、Pic-nic Punts 与 Silver Street",
      pages: "171",
      lat: 52.2019117,
      lng: 0.1154009,
      branchIds: [backs],
      summary: [
        "Long Vacation 游客增多后，Cambridge 开始出现由 professional punter 掌篙的服务。1975 年 Conservators 批准 J. M. Nicholson 提供带 “chauffeur” 的 punts，随后又出现第二家同类服务。",
        "再后来，有 punt parties 配 strawberries，Pic-nic Punts 则在船上供应 coffee、lunch、tea 或 cream tea。书中说这些 businesses 大多以 The Anchor 或 Silver Street Bridge 为基地，现代 Cambridge tourist punting 的形态已在这里成形。",
      ],
    }),
  ];

  const storyIds = new Set(stories.map((page) => page.id));
  data.pages = [...data.pages.filter((page) => !storyIds.has(page.id)), ...stories];

  function appendPageIds(item, pageIds) {
    if (!item) return;
    item.pageIds = [...new Set([...(item.pageIds || []), ...pageIds])];
  }

  const waypointStories = {
    "cambridge-granta-boatyard": ["book-cambridge-camford-punt", "book-cambridge-grantchester-goal"],
    "cambridge-mill-rollers-upper": ["book-cambridge-cam-granta-names", "book-cambridge-wooden-poles"],
    "cambridge-mill-rollers-lower": ["book-cambridge-cam-granta-names", "book-cambridge-wooden-poles"],
    "cambridge-silver-street": ["book-cambridge-first-pleasure-punts", "book-cambridge-anchor-boatyards", "book-cambridge-chauffeur-punts"],
    "cambridge-mathematical-bridge": ["book-cambridge-end-technique", "book-cambridge-backs-decorum"],
    "cambridge-kings-bridge": ["book-cambridge-fen-navigation", "book-cambridge-college-fleets"],
    "cambridge-clare-bridge": ["book-cambridge-backs-decorum"],
    "cambridge-garret-hostel-bridge": ["book-cambridge-strange-girton", "book-cambridge-dampers-charon", "book-cambridge-graham-chapman-race"],
    "cambridge-trinity-bridge": ["book-cambridge-college-fleets", "book-cambridge-dampers-dittons"],
    "cambridge-st-johns-old-bridge": ["book-cambridge-dampers-games"],
    "cambridge-bridge-of-sighs": ["book-cambridge-dampers-games", "book-cambridge-dampers-charon"],
    "cambridge-quayside": ["book-cambridge-scudamore-tyrrell", "book-cambridge-two-tees"],
    "cambridge-magdalene-bridge": ["book-cambridge-scudamore-tyrrell"],
    "cambridge-jesus-lock": ["book-cambridge-cam-granta-names", "book-cambridge-college-fleets"],
    "cambridge-paradise": ["book-cambridge-grantchester-goal"],
    "cambridge-grantchester-meadows": ["book-cambridge-grantchester-goal"],
    "cambridge-orchard-landing": ["book-cambridge-grantchester-goal"],
    "cambridge-grantchester-mill-fork": ["book-cambridge-byron-pool"],
    "cambridge-byron-pool-weir": ["book-cambridge-byron-pool"],
  };
  Object.entries(waypointStories).forEach(([id, pageIds]) => appendPageIds(data.branchWaypoints.find((item) => item.id === id), pageIds));

  const historyWaypoints = [
    {
      id: "cambridge-history-anchor",
      region: "cambridge",
      name: "The Anchor · historic boat-hiring cluster",
      lat: 52.2019341,
      lng: 0.1157178,
      kind: "history",
      comment: "Dolby、Thomas Prime、Scudamore、fen-punt cartoon 与 Dampers Club Sunday meetings。",
      pageIds: ["book-cambridge-first-pleasure-punts", "book-cambridge-fen-punts", "book-cambridge-anchor-boatyards", "book-cambridge-dampers-membership"],
      branchId: backs,
      branchIds: [backs],
    },
    {
      id: "cambridge-history-newnham-grange",
      region: "cambridge",
      name: "Newnham Grange · Darwin College",
      lat: 52.2008878,
      lng: 0.1140164,
      kind: "history",
      comment: "Gwen Raverat 与 Margaret Keynes 回忆会漏水、会下沉的 Darwin family garden punt。",
      pageIds: ["book-cambridge-raverat-garden-punt"],
      branchId: grantchester,
      branchIds: [grantchester, backs],
    },
    {
      id: "cambridge-history-robinson-crusoe",
      region: "cambridge",
      name: "Robinson Crusoe Island · Belle Vue Gardens",
      lat: 52.1982067,
      lng: 0.1174662,
      kind: "history",
      comment: "Dolby 的 hire point 与 George Reynolds 出租 tea hampers、gramophones 的 river leisure landscape。",
      pageIds: ["book-cambridge-reynolds-gramophones"],
      branchId: grantchester,
      branchIds: [grantchester],
    },
    {
      id: "cambridge-history-strange-boathouse",
      region: "cambridge",
      name: "Former Strange's Boat House · opposite Alpha Road",
      lat: 52.21272,
      lng: 0.11975,
      kind: "history",
      comment: "Strange family 自 1865 年造船；木质 two-storey boathouse 在 1940 年 business 售出后逐渐失修。",
      pageIds: ["book-cambridge-strange-girton"],
      branchId: backs,
      branchIds: [backs],
    },
  ];

  const historyWaypointIds = new Set(historyWaypoints.map((item) => item.id));
  data.branchWaypoints = [
    ...data.branchWaypoints.filter((item) => !historyWaypointIds.has(item.id)),
    ...historyWaypoints,
  ];

  stories.forEach((page) => {
    page.branchIds.forEach((branchId) => appendPageIds(data.branches.find((item) => item.id === branchId), [page.id]));
  });

  data.meta.cambridgeBookStoryCount = stories.length;
  data.meta.bookStoryCount = data.pages.filter((page) => page.bookSummary).length;
  data.meta.pageCount = data.pages.length;
})();
