(function () {
  "use strict";

  const data = window.THAMES_DATA;
  if (!data) return;

  const source = {
    title: "Punting: its history and techniques",
    author: "R. T. Rivington",
    year: 1983,
  };

  function story({ id, name, comment, pages, summary, lat, lng, reachId, branchIds = [], kind = "history" }) {
    return {
      id,
      name,
      address: `book:${id}`,
      comment,
      kind,
      lat,
      lng,
      reachId,
      branchId: branchIds[0] || null,
      branchIds,
      bookSummary: true,
      source: { ...source, pages },
      summary,
    };
  }

  const stories = [
    story({
      id: "book-eynsham-aelfric",
      name: "Aelfric 与 “punt” 的最早英文记录",
      comment: "Eynsham · 1005 年前后的词源掌故",
      pages: "4",
      lat: 51.774751,
      lng: -1.356844,
      reachId: "eynsham-lock-to-kings-lock",
      summary: [
        "书中把英语里 “punt” 的最早记录追溯到 Aelfric 编写的 Anglo-Saxon / Latin 词汇表。他在 1005 年成为 Eynsham 的首任 Abbot，词条只写了简洁的对应：pontonium - punt。",
        "当时的 punt 还不是今天狭义的 Thames pleasure punt，而是泛指小船。19 世纪后期，dinghy 逐渐接替许多旧用法，punt 才越来越专指 Thames 上的平底船。",
      ],
    }),
    story({
      id: "book-south-hinksey-poles",
      name: "South Hinksey 的 Oxford 船篙",
      comment: "F. Collar、Faulkner 与不同河段的 pole 长度",
      pages: "10",
      lat: 51.734058,
      lng: -1.263187,
      reachId: "osney-lock-to-iffley-lock",
      branchIds: ["cherwell-lower-loop", "cherwell-magdalen-rollers"],
      summary: [
        "书成书时，Oxford 与 Cambridge 租船商使用的木 pole 都由 South Hinksey 的 F. Collar 供应：silver spruce，长 16 ft，表面上清漆。1900-1910 年间的 Isis 照片显示，当时也大致使用这一长度。",
        "Lower Cherwell 更浅，Magdalen Bridge 的 Faulkner 则把 pole 做成 15 ft。这个差别说明 pole 并非越长越好，而是要与水深、河宽和树枝高度相配。",
      ],
    }),
    story({
      id: "book-oxford-river-names",
      name: "Isis、Upper River 与 Cherwell",
      comment: "Oxford 水路名称背后的使用习惯",
      pages: "117-118",
      lat: 51.746346,
      lng: -1.256336,
      reachId: "osney-lock-to-iffley-lock",
      summary: [
        "Oxford 附近的 Thames 曾广泛被称作 Isis，但到书写作时，Isis 通常特指 Folly Bridge 至 Iffley Lock、由 college boat clubs 使用的河段。Port Meadow 一带、旧 Medley flash lock 以上则常称 Upper River。",
        "书中把 Isis 描写成 rowing 与纪律的空间，把较窄、安静的 Cherwell 描写成 leisurely punting 的空间。这种用途差异后来也成为 Oxford 文学与学生文化反复调侃的主题。",
      ],
    }),
    story({
      id: "book-bablock-hithe",
      name: "Bablock Hithe：Matthew Arnold 与 ferry girl",
      comment: "The Scholar-Gipsy 的慢 punt 与一桩婚姻传说",
      pages: "118",
      lat: 51.735138,
      lng: -1.371735,
      reachId: "northmoor-lock-to-pinkhill-lock",
      summary: [
        "Matthew Arnold 在 The Scholar-Gipsy 中写到 Bablock Hithe。1853 年初版描绘的是 rope ferry 转向，修订版却换成手指拖在凉水中、punt 缓缓回旋的画面；书中推测，这个更浪漫的场景可能来自 Arnold 少年时熟悉的 Laleham ferry。",
        "Bablock Hithe 还流传一则 18 世纪轶事：Christ Church 的 undergraduate Viscount Ashbrook 据说在这里娶了 ferry girl。Hithe 本义就是河边装卸货物的登陆点。",
      ],
    }),
    story({
      id: "book-west-oxford-floods",
      name: "West Oxford 洪水中的 punts",
      comment: "William Turner、1894 年 Botley Road 与水上交通",
      pages: "119-120",
      lat: 51.752527,
      lng: -1.272563,
      reachId: "godstow-lock-to-osney-lock",
      summary: [
        "Oxford 西侧的低地过去经常整体被淹。William Turner 留下一幅 Seacourt 一带洪水画：载货的 waterman’s punt 穿过被水覆盖的平原。1894 年照片中，Botley Road 通往 railway station 的桥下同样成了水道，旁边停着一只 punt。",
        "在道路与水位尚未充分控制的年代，punt 不只是消遣，而是洪水时最合适的运输工具。书中也提到，直到 1977 年左右，Iffley Lock 上方的 Isis Hotel 仍会用 ferry punt 运送 beer。",
      ],
    }),
    story({
      id: "book-oxford-literary-punts",
      name: "Dorothy Sayers 的 punting 式 chivalry",
      comment: "Gaudy Night 中关于“自己 punt”的机锋",
      pages: "119",
      lat: 51.746346,
      lng: -1.256336,
      reachId: "osney-lock-to-iffley-lock",
      summary: [
        "书中引用 Dorothy Sayers 的 Gaudy Night：Lord Peter Wimsey 认为，自己 punt 比被别人 punt 更有趣，而想把乐趣全占了，正是 chivalry 的大半逻辑。",
        "Rivington 借这句机锋指出，Oxford 的 punting 既是水上技能，也是一种关于礼仪、性别角色和谁来掌 pole 的社交表演。",
      ],
    }),
    story({
      id: "book-christ-church-ferries",
      name: "Christ Church Meadow 的 ferry punts",
      comment: "伪造 badges、1889 年事故与 college watermen",
      pages: "120",
      lat: 51.742848,
      lng: -1.249657,
      reachId: "osney-lock-to-iffley-lock",
      branchIds: ["cherwell-lower-loop"],
      summary: [
        "19 世纪 rowing 兴起后，crews 必须从 Christ Church Meadow 渡到 towpath。1843 年，O.U.B.C. 试图只让持 badge 的 punt ferrymen 载客，但 badges 很快被大量仿造，制度失效。",
        "1889 年，一只超载 ferry punt 发生致命事故。此后 O.U.B.C. 要求每个 college boat club 配自己的 waterman 和 ferry punt，并对超载罚款。随着 college barges 逐渐被 boathouses 取代，ferry punts 的数量才慢慢减少。",
      ],
    }),
    story({
      id: "book-fisher-row",
      name: "Fisher Row 的 watermen 家族",
      comment: "Bossom、Beesley 与 Oxford 河上社会",
      pages: "120-121",
      lat: 51.75315,
      lng: -1.26503,
      reachId: "godstow-lock-to-osney-lock",
      summary: [
        "Fisher Row 位于通往旧 castle mill 的水道旁，从 medieval Oxford 起就是 fishermen 与 watermen 的社区。17 世纪末，Bossom 与 Beesley 两个家族迁入 St Thomas’s parish，到 19 世纪初已主导当地河上生计，也形成激烈竞争。",
        "1841 年创办的 Oxford Regatta 给了这两个家族公开较量的新舞台。1842 年 Samuel Beesley 赢得 punt race；此后 Beesley、Bossom 和后来兴起的 Tims 家族共同塑造了 Oxford 的职业 waterman 传统。",
      ],
    }),
    story({
      id: "book-bossom-beesley-race",
      name: "Beesley 对 Bossom：一场闹上法庭的比赛",
      comment: "Port Meadow、Binsey Gate 与 Godstow · 1850",
      pages: "122-123",
      lat: 51.7692,
      lng: -1.2892,
      reachId: "godstow-lock-to-osney-lock",
      summary: [
        "1850 年，Sampson Beesley 与 John Bossom junior 在 Port Meadow Stream 比赛。接近 Binsey Gate 时，Beesley 被指把即将领先的 Bossom 挤向岸边约 30 yards；umpires 判 Bossom 获胜，但 Beesley 仍继续赶到 Godstow，并先过终点。",
        "争议随后牵出赌金、拦路索款、Bell’s Life 的场外裁决和 Small Debts Court 诉讼。Beesley 最终败诉；报道说，这件“punting-match affair”数周间成了所有 boating 圈人物的热门话题。",
      ],
    }),
    story({
      id: "book-abel-beesley",
      name: "Abel Beesley：Oxford 的 punting legend",
      comment: "冠军、救生员、billiard cue 与 steam launch",
      pages: "123-126",
      lat: 51.764195,
      lng: -1.280299,
      reachId: "godstow-lock-to-osney-lock",
      summary: [
        "Abel Beesley 在 1878 年击败首位 professional champion Ned Andrews，1886-1890 年又连续五次赢得 championship，直到 W. H. Grenfell 劝他退赛，好让其他人愿意报名。他同时是 Oxford University Humane Society 的 chief waterman，能用 pole 判断河底、救起遇险 rowers，甚至寻找遗体和失物。",
        "关于他的传奇包括：坐着用 billiard cue 当 pole 仍赢过正常装备的对手；1910 年在 Medley 至 Godstow 的半英里赛道上，以 110 yards 优势击败载有五人的 steam launch。Beesley 也训练 W. H. Grenfell，并把 Oxford 的 stern-first 与 long-shove 技术推到极高水平。",
      ],
    }),
    story({
      id: "book-oxford-end",
      name: "为什么从 “Oxford end” punting",
      comment: "stern-first 传统与 Beesley 的 long-shove",
      pages: "12, 125-126",
      lat: 51.746346,
      lng: -1.256336,
      reachId: "osney-lock-to-iffley-lock",
      summary: [
        "Oxford 传统上让 punt stern-first 前进，也就是站在 open end、朝 covered till 或 box 的反方向推进，因此这一站位被称为从 “Oxford end” punting。它可能源自早期 fishing-punt 布局：乘客靠 till 坐，punter 留在 open end，既能面对乘客，也不会把水滴在他们身上。",
        "在 racing 中，Beesley 家族把 standing-still 的 pricking 发展成有力的 long-shove。书中强调，这不是唯一正确的姿势，而是一项由旧船型、社交习惯和本地职业 watermen 共同保存下来的 Oxford 传统。",
      ],
    }),
    story({
      id: "book-godley-isis-cherwell",
      name: "A. D. Godley：Isis 与 Cherwell 的伦理争论",
      comment: "rowing 的纪律对 punting 的闲逸",
      pages: "127-128",
      lat: 51.744154,
      lng: -1.25175,
      reachId: "osney-lock-to-iffley-lock",
      branchIds: ["cherwell-lower-loop"],
      summary: [
        "1899 年，A. D. Godley 在 A Dialogue on Ethics 中把 Isis 与 Cherwell 写成两位争论者。Isis 代表 rowing、纪律和自觉的美德，指责 Cherwell 上的人躺在 cushion 上读 novel、flirt；Cherwell 则反击 rowing 有损人的尊严，赞美 cultivated leisure。",
        "结尾让 summer、Ver 与 Venus 来裁决：Eights 一结束，athletes 也会离开 Isis，转向 Cherwell。作品把两条实际相连的水路，变成 Oxford 两种生活理想的鲜明对照。",
      ],
    }),
    story({
      id: "book-parsons-pleasure",
      name: "Parson’s Pleasure、screens 与 rollers",
      comment: "nude bathing 时代的水路礼仪",
      pages: "128",
      lat: 51.760394,
      lng: -1.245935,
      branchIds: ["cherwell-magdalen-rollers", "cherwell-rollers-bardwell"],
      summary: [
        "Parson’s Pleasure 长期是 men’s nude bathing place，至少从 1832 年起已有 attendant。书中转述 Henry Taunt 的说法：1692 年这里叫 Patten’s Pleasure，后来的名字可能是讹变。河道两侧曾设 screens，遮挡浴场。",
        "rollers 安装后，ladies 通常在上游下船，步行绕过浴场，再到 rollers 与船会合；men 则把船带过浴场。更早时没有 rollers，watermen 要用 wooden water-slide 把船在两个水位之间拖运。",
      ],
    }),
    story({
      id: "book-fowler-naval-battle",
      name: "W. W. Fowler 的 Upper Cherwell naval battle",
      comment: "拒付 sixpence 后发生的 punt 对抗",
      pages: "128-129",
      lat: 51.763115,
      lng: -1.25013,
      branchIds: ["cherwell-rollers-bardwell"],
      summary: [
        "W. W. Fowler 回忆 1870 年左右第一次越过 Parson’s Pleasure 探索 Upper Cherwell。一名 punt 中的男子向他们索要 sixpence；同行那位强壮而固执的 London barrister 拒绝付款。",
        "返程时，对方用 punt 横封河道，还拿着长 boat-hook 阻拦。双方于是展开一场激烈的“naval battle”，岸上刚洗完澡的人一边晾干一边大声助威。书中推测，拦路者也许把 fishing rights 误当成 navigation rights。",
      ],
    }),
    story({
      id: "book-upper-cherwell-rights",
      name: "Upper Cherwell：boathouses、private water 与 Islip",
      comment: "A. L. Smith、Max Muller 与 19 世纪的航行权",
      pages: "129-130",
      lat: 51.769735,
      lng: -1.253952,
      branchIds: ["cherwell-rollers-bardwell", "cherwell-bardwell-victoria", "cherwell-victoria-islip"],
      summary: [
        "1882 年，A. L. Smith、Max Muller 等人向 St John’s College 申请 Upper Cherwell 的 secure boathouse site，理由是 boats 常遭 trespass 与 vandalism。St John’s 的 bursar 同时警告：University rights 到 Great Wisley corner 为止，再往上 Summer Fields 等 riparian owners 仍可能把 punters 当成 trespassers。",
        "这些限制没有阻止 undergraduates 把 punt 到 Islip 当作一日远足。到 1888-1890 年，Lady Margaret Hall、Somerville Hall 与 St Hugh’s Hall 都已在 Upper Cherwell 使用 boats；新的需求也促成 Parson’s Pleasure rollers 与后来的 Tims’s boathouse。",
      ],
    }),
    story({
      id: "book-college-punt-captains",
      name: "Lady Margaret Hall 的 “punt captains”",
      comment: "通过水上技能测试，才可独自用船",
      pages: "130, 140-141",
      lat: 51.76575,
      lng: -1.25115,
      branchIds: ["cherwell-magdalen-rollers", "cherwell-rollers-bardwell"],
      summary: [
        "Lady Margaret Hall 在 1896 年建自己的 boathouse。成员必须通过 competence test 才能独自用 skiff、canoe 或 punt；合格者按船型取得 skiff captain、canoe captain 或 punt captain 的称号。punt captain 要会 pick up in three、half shove 与 back-shove。",
        "St Hilda’s College 也有类似制度，要求能在 shove 过程中完成 steering，而不是等 stroke 结束才补救。书中借此说明，Victorian Oxford 很早就把 punting 视为特别适合 women 的 recreation，同时又认真要求 watermanship。",
      ],
    }),
    story({
      id: "book-tom-tims",
      name: "Tom Tims 与 Cherwell Boathouse",
      comment: "1901 年的 landing stage 与邻居们的反感",
      pages: "131-132",
      lat: 51.769735,
      lng: -1.253952,
      branchIds: ["cherwell-rollers-bardwell", "cherwell-bardwell-victoria"],
      summary: [
        "Tom Tims 是著名 Oxford University Boatman。1901 年，他在 North Oxford 居民支持下，从 St John’s College 租下 Bardwell Road 外的 landing-stage site；1904 年建成的 boathouse 正面仍留下他的 initials，foundation stone 则刻着 Walker 家长女 Sarah 的 S.L.W.。",
        "新生意并不讨邻居喜欢。Mrs Haldane 说附近居民都觉得受了打扰；Dragon School 当时还叫 Lynam’s，boys 甚至计划 scuttle 或炸掉新 boats。她劝他们别做，因为 Mr Tims 很有钱，炸掉一批也能再换一批。",
      ],
    }),
    story({
      id: "book-barbara-goes-oxford",
      name: "Barbara Goes to Oxford：掉进 Mesopotamia",
      comment: "Pons Asinorum、mud 与一次狼狈的自救课",
      pages: "132",
      lat: 51.7588,
      lng: -1.2444,
      branchIds: ["cherwell-magdalen-rollers"],
      summary: [
        "Barbara Burke 是 Oona Ball 的 pseudonym。她在 1907 年小说 Barbara Goes to Oxford 中，让两位 young ladies 租下一只名为 Pons Asinorum 的轻 punt，沿 college barges、Christ Church Meadow 和 Magdalen walks 进入 Cherwell。",
        "到 Mesopotamia 附近，河道又窄又弯，mud 很深。叙述者一时分不清是自己控制 pole，还是 pole 控制自己，随后整个人掉进水里。路过的 waterman 把她从泥里捞起，并帮她把 punt 拖过 Parson’s Pleasure rollers。",
      ],
    }),
    story({
      id: "book-prince-edward-magdalen",
      name: "Prince Edward 的 Magdalen punt",
      comment: "1912 年：punting 与一次 college climbing route",
      pages: "133",
      lat: 51.751384,
      lng: -1.246324,
      branchIds: ["cherwell-lower-loop", "cherwell-magdalen-rollers"],
      summary: [
        "Edward, Prince of Wales 曾由 Old Windsor 的 Haines 教 punting。书中说，他 1912 年在 Oxford 时 punt 得很好，还曾借一只 punt 接近 Magdalen College，以便别人向他展示一条攀爬 college 建筑的 route。",
        "这则短轶事把 early-20th-century Oxford 的两种 undergraduate 技艺放在一起：一项是 river watermanship，另一项是秘密探索 college roofs 与 walls。",
      ],
    }),
    story({
      id: "book-watermens-regatta",
      name: "Oxford Watermen’s Regatta 与 rag races",
      comment: "Pink Post 至 Folly Bridge 的 upstream course",
      pages: "133-134",
      lat: 51.746346,
      lng: -1.256336,
      reachId: "osney-lock-to-iffley-lock",
      summary: [
        "20 世纪初，正式 Oxford Regatta 已很少安排 punting，但 Oxford Watermen’s Regatta 仍定期举行 handicap races。赛道从 New Mouth of Cherwell 下方的 Pink Post 逆流到 Folly Bridge 下方的 head-of-the-river post，只比 upstream、不转弯，可能正是为了简化 fouling 判断。",
        "colleges 还办过较胡闹的 rag regattas，包括 canoe punting、one-armed punting 与 dongola racing。1922 年后一位严厉的 vice-chancellor 禁掉为 Radcliffe Infirmary 筹款的 O.U.B.C. rag regattas；书中顺带说，他也想禁 coffee shops，因为那里供应 “unmanly food”。",
      ],
    }),
    story({
      id: "book-1905-championship",
      name: "1905 Oxford University Punting Championship",
      comment: "Black Jack’s Hole 至 Binsey Gate 的唯一一届",
      pages: "134-136",
      lat: 51.7692,
      lng: -1.2892,
      reachId: "godstow-lock-to-osney-lock",
      summary: [
        "B. H. B. Symons-Jeune 在 1905 年组织了 Oxford 唯一一次 University Punting Championship。来自 Merton、New College、Trinity、Oriel、Christ Church、Queen’s 与 St John’s 的选手参赛；因不少人是 novices，比赛使用普通 light pleasure punts。",
        "赛道位于 Upper River，从 Black Jack’s Hole 至 Binsey Gate。冠军 G. Battock of Trinity 与 A. L. Scott of Merton 分别受 Abel Beesley 和 H. George 指导。原计划约 quarter mile，实际因测量错误接近 three-quarters of a mile。Symons-Jeune 希望赛事年年举行，但 rowing、Eights 与 Schools 的时间压力使它没有第二届。",
      ],
    }),
    story({
      id: "book-binsey-carroll-hopkins",
      name: "Binsey：Black Jack、Hopkins 与 Lewis Carroll",
      comment: "Port Meadow 河段的 folklore 与文学记忆",
      pages: "136-137",
      lat: 51.766811,
      lng: -1.285867,
      reachId: "godstow-lock-to-osney-lock",
      summary: [
        "Black Jack’s Hole 曾是一条围成 island 的 river channel，后来消失。书中按 Fred Thacker 的说法，把 Black Jack 解释为大人编出的 imaginary ogre，用来吓阻 boys 在危险深水处游泳；Anthony Wood 约 1665 年则称这里 Black John’s Pitt。",
        "Gerard Manley Hopkins 1879 年到 Godstow 后，为河岸 aspens 全被砍倒而写下痛惜，这段记忆后来与 Binsey Poplars 相连。更早的 1860s，Charles Dodgson / Lewis Carroll 曾划 pair-oared gig 经过 Binsey，一边想起 St Frideswide 的 healing well，一边给 Dean Liddell 的女儿讲后来成为 Alice in Wonderland 的故事。",
      ],
    }),
    story({
      id: "book-magdalen-hardway-howard",
      name: "Magdalen Bridge：从 horse hardway 到 punt hire",
      comment: "Round、Faulkner 与 Howard 的四次迁移",
      pages: "137-140",
      lat: 51.751384,
      lng: -1.246324,
      branchIds: ["cherwell-lower-loop", "cherwell-magdalen-rollers"],
      summary: [
        "1911 年前，Magdalen Bridge 旁通往水面的 hardway 用来给 horses 饮水，河底铺石正是为马准备。horse-trams 淘汰后，New College waterman William Round 与 Worcester waterman Owen “Joe” Faulkner 租下这里，开办 punt hire。",
        "Charles Howard 最初在 St Clement’s 的 swimming bath 旁一边当 attendant、一边出租 punts。Howard family 之后沿 Lower Cherwell 四次搬迁，每次大约向下游移动 200 yards，终于在 1967 年接手 Magdalen Bridge 的 Faulkner landing stage；业务传到 grandson 与 great-grandson，两人也都叫 Charles Howard。",
      ],
    }),
    story({
      id: "book-donnington-isis-hotel",
      name: "Donnington ferry 与 Isis Hotel 的 beer punt",
      comment: "Thomas Rose 家族与最后的河上送货",
      pages: "138",
      lat: 51.7356,
      lng: -1.242024,
      reachId: "osney-lock-to-iffley-lock",
      summary: [
        "Donnington Bridge 所在地过去有一只由 pole 推动的 free passenger ferry punt，由 City Council 维持。1937 年它被 concrete arched footbridge 取代，1962 年才有 road bridge。最后一位 ferryman 是 Thomas Rose。",
        "Thomas Rose 后来成为 Iffley Lock 上方 Isis public house 的 landlord。因为周围 water-meadow 大半年不适合 lorry 通行，beer barrels 与重物一直用 ferry punt 运到店里，约到 1977 年才改用 towpath trolley。",
      ],
    }),
    story({
      id: "book-cherwell-hotel-sign",
      name: "Cherwell Hotel 的 falling punter sign",
      comment: "Cutteslowe class barrier 与错误的 Cambridge end",
      pages: "138-140",
      lat: 51.786146,
      lng: -1.254004,
      branchIds: ["cherwell-victoria-islip"],
      summary: [
        "Cherwell Tavern 1896 年开业，1900 年重建，后来改名 Cherwell Hotel。它位于 Water Eaton Road、Northern Bypass 以南的河段，曾有 boat-builder landlords，并出租 punts；但作为 riverside hotel 的潜力始终没有真正实现。",
        "1940 年的新 inn sign 画着一名穿 white flannels、戴 straw hat 的 punter 落水。Cutteslowe estate walls 在 1939 年拆掉又重建，激起强烈阶级争议，于是当地人把画中落水者解读为 privileged classes 即将倒下；另有人只评论说，他蠢在从 Cambridge end punting。",
      ],
    }),
    story({
      id: "book-may-morning",
      name: "May Morning：punts、piano 与全面禁租",
      comment: "Magdalen Bridge · 1950s-1967",
      pages: "141-143",
      lat: 51.751384,
      lng: -1.246324,
      branchIds: ["cherwell-lower-loop", "cherwell-magdalen-rollers"],
      summary: [
        "Magdalen College choristers 在 May Morning 清晨从 tower 演唱 Latin hymn。1950s 起听众暴增，punt 成了最好的观礼位置，租船时间不断提前，最后变成通宵 river parties。1962 年一只超载 punt 下沉，乘客跳到相邻船上，引发连锁反应：六只 punts 沉没，约五十人落水，一架被带上船的 piano 也要专门抢救。",
        "接下来几年出现 sunk boats、盗窃、broken poles、袭击与一只被持刀抢走的 punt。1967 年后，主要 punt hirers 决定 May Morning 不再出租；Magdalen College 甚至等 May Morning 结束后才把自己的 punts 下水。",
      ],
    }),
    story({
      id: "book-charon-club",
      name: "Charon Club：落水才有资格入会",
      comment: "Oxford-Cambridge punt race 与 Victoria Arms",
      pages: "143-145",
      lat: 51.776716,
      lng: -1.24806,
      branchIds: ["cherwell-bardwell-victoria", "cherwell-victoria-islip"],
      summary: [
        "Charon Club 因 Cambridge Damper Club 的挑战而在 1953 年正式成立。会员资格是曾非自愿地从 punt、boat 或 canoe 掉进河里；女性会员统称 batons，参加 relay 的是 chief baton，后来称 Queen Baton。club motto 出自 Aeneid，意思是“看，他从船尾掉进水里了”。",
        "年度 Oxford-Cambridge relay 后来在 Victoria Arms、Christ Church Meadow bank 与 Cambridge Backs 轮流举行。项目发展到 jousting、one-handed race、canoe punting，甚至用躺倒的 horizontal recovery 来躲 bridge pole-snatchers。因 boats 在比赛和庆祝中不断损坏，hirers 1973 年禁止把租来的 punts 用于竞赛，传统赛事随之结束。",
      ],
    }),
    story({
      id: "book-cherwell-boathouse-reinvention",
      name: "Cherwell Boathouse：wine、cabaret 与重新造 punt",
      comment: "John Perowne、Anthony Verdin 与 John Mastroddi",
      pages: "147-149",
      lat: 51.769735,
      lng: -1.253952,
      branchIds: ["cherwell-rollers-bardwell", "cherwell-bardwell-victoria"],
      summary: [
        "1964 年 Lieutenant-Commander John Perowne 接手时，约 120 只 punts 只有 40 只可用。他取得 wine licence，在河边竖起两支高大的 gas flambeaux，还尝试 folk duo、buffet 与 cabaret。娱乐没有长期持续，却逐渐演化成全年营业的 Cherwell Boathouse Restaurant。",
        "Anthony Verdin 1968 年接手，并与 John Mastroddi、Paul Hubbucks 重新建立 Oxford 的传统 punt-building craft。为了取得足够长的 mahogany side planks，甚至要买整段 tree-trunk 专门锯切。书成书时，Mastroddi 被称为 Oxford 唯一仍制作 traditional punts 的 builder。",
      ],
    }),
    story({
      id: "book-my-oxford-memories",
      name: "My Oxford：在 punt 上读书、绕圈与怀旧",
      comment: "Ann Thwaite、Lord Boothby、Jo Grimond、John Mortimer、Alan Coren",
      pages: "149-150",
      lat: 51.763115,
      lng: -1.25013,
      branchIds: ["cherwell-rollers-bardwell"],
      summary: [
        "1977 年文集 My Oxford 收集了多种 punting 记忆。Ann Thwaite 想起 willows 下系着的 punts 与 white wine；Lord Boothby 第一次和 Compton Mackenzie 下水时只会绕圈、左右撞 moored punts，把 Mackenzie 笑得差点落水。",
        "Jo Grimond 把 Cherwell、Magdalen Tower 的 carols 和 misty autumn 归入 Oxford nostalgia；John Mortimer 在 punt 上硬读 law books；Alan Coren 则记得河道因人们停下来互相朗读 Salinger、Scott Fitzgerald 与 Doctor Zhivago 而形成缓慢的 log-jams。",
      ],
    }),
    story({
      id: "book-st-catherines-race",
      name: "St Catherine’s 的 pint-before-return race",
      comment: "到 Victoria Arms 喝完一 pint 才能返程",
      pages: "151",
      lat: 51.756689,
      lng: -1.244613,
      branchIds: ["cherwell-magdalen-rollers", "cherwell-rollers-bardwell", "cherwell-bardwell-victoria", "cherwell-victoria-islip"],
      summary: [
        "St Catherine’s College 曾在 St Catherine’s Day 举办 timed punt race：从 college 出发到 Victoria Arms，再返回。规则中特别规定，competitors 必须先在 Victoria Arms 喝完一 pint of beer，才能开始返程。",
        "它把 Upper Cherwell 最常见的 pub outing 变成一种带强制补给环节的计时赛，也体现 Oxford punting 往往介于 watermanship 与社交游戏之间。",
      ],
    }),
    story({
      id: "book-magdalen-nomad",
      name: "Magdalen College 的 Nomad punts",
      comment: "Dr Bellhouse 设计的 glass-fibre college fleet",
      pages: "151",
      lat: 51.751384,
      lng: -1.246324,
      branchIds: ["cherwell-lower-loop", "cherwell-magdalen-rollers"],
      summary: [
        "Magdalen College 没有完全沿用 traditional Thames punt，而是采用由 engineering tutor Dr Bellhouse 设计、Nomad Ltd 在 Sussex 制造的 glass-fibre punt。书中说 college 当时约有 24 只。",
        "设计特别考虑长船体的 torque，成品轻、短、容易操控，更接近 canoe，也便宜易维护。Rivington 承认其实用性，但认为它不像 long, heavy Thames punt 那样给熟练 waterman 带来同样的操控乐趣。",
      ],
    }),
    story({
      id: "book-rainbow-bridge",
      name: "Rainbow Bridge 的 unemployment-relief 来历",
      comment: "University Parks · 1923",
      pages: "152",
      lat: 51.763115,
      lng: -1.25013,
      branchIds: ["cherwell-rollers-bardwell"],
      summary: [
        "University Parks 河段的 concrete Rainbow Bridge 建于 1923 年。资金由 Oxford mayor 募集，项目的目的之一是为当时的 unemployment relief 提供工作。",
        "它后来成为 Upper Cherwell 最醒目的定位点之一，也见证了从 Parson’s Pleasure 向 Lady Margaret Hall 与 Bardwell Road 延伸的 North Oxford punting landscape。",
      ],
    }),
    story({
      id: "book-marston-ferry",
      name: "Victoria Arms 与 600 年 Marston Ferry",
      comment: "rope punt-ferry 变成 car park 里的花槽",
      pages: "153",
      lat: 51.776716,
      lng: -1.24806,
      branchIds: ["cherwell-bardwell-victoria", "cherwell-victoria-islip"],
      summary: [
        "Victoria Arms 一带曾是 Marston Ferry 的位置。书中说，这只 rope punt-ferry 的历史延续约 600 年，直到不久前才停用。",
        "旧 ferry 没有彻底消失：它被移到 car park，改种 flowers。对今日 punter 来说，pub landing 不只是折返点，也叠在一条非常古老的横渡路线之上。",
      ],
    }),
    story({
      id: "book-long-distance-punts",
      name: "从 Oxford 出发的 long-distance punts",
      comment: "Jesus、Christ Church 与 Magdalen 的远征记录",
      pages: "105",
      lat: 51.746346,
      lng: -1.256336,
      reachId: "osney-lock-to-iffley-lock",
      summary: [
        "1979 年，两名 Christ Church undergraduates punt 了 364 miles。1980 年，两名 Magdalen College undergraduates 从 Oxford 出发，经 Thames、Grand Union Canal、Leicester、Trent 等水路绕回 Oxford，36 天完成约 694 miles、418 locks，每天约 14 小时，并在 camping punt 中睡觉。",
        "更早的 1961 年，五名 Jesus College undergraduates 组成 shareholders’ company 买下自己的 punt，随后多年从 Oxford 远行；1965 年路线因 canal 封闭而绕行，总计 721 miles。旅行记录、Guardian articles 与幽默的 shareholders’ minutes 最后装成四卷档案。",
      ],
    }),
    story({
      id: "book-folly-bridge-hirers",
      name: "Folly Bridge 的 punt-hiring lineage",
      comment: "Talboys、Harris、Hubbucks 与旧 toll-house",
      pages: "126, 145-146, 154",
      lat: 51.746346,
      lng: -1.256336,
      reachId: "osney-lock-to-iffley-lock",
      summary: [
        "1880-1900 年间，Salter、Rough、Talboys、Tims、Harris 等 boat builders 与 hirers 都在 Folly Bridge 附近出租 punts。最初多是 fishing-punt design，saloon punts 来到 Oxford 的时间反而较晚。",
        "1957 年 Talboys 去世，1958 年 George Harris 退出 punt hire，W. T. Hubbucks 接手业务并使用旧 Folly Bridge toll-house。书成书时，Hubbucks 仍保有多种 traditional Thames punts，也愿意提供 camping punts、特殊用途 boats 与 repair。",
      ],
    }),
  ];

  const storyIds = new Set(stories.map((item) => item.id));
  data.pages = [...data.pages.filter((item) => !storyIds.has(item.id)), ...stories];

  const historyWaypoints = [
    {
      id: "history-fisher-row",
      name: "Fisher Row · watermen community",
      lat: 51.75315,
      lng: -1.26503,
      routeIndex: 699,
      kind: "history",
      comment: "Bossom、Beesley 与旧 Oxford watermen 社区所在的 Castle Mill Stream 河岸。",
      pageIds: ["book-fisher-row"],
    },
    {
      id: "history-binsey-gate",
      name: "Binsey Gate / Black Jack’s Hole",
      lat: 51.7692,
      lng: -1.2892,
      routeIndex: 650,
      kind: "history",
      comment: "Port Meadow 旧 punting course 与 Black Jack folklore 所在河段。",
      pageIds: ["book-bossom-beesley-race", "book-1905-championship", "book-binsey-carroll-hopkins"],
    },
    {
      id: "history-south-hinksey-poles",
      name: "South Hinksey · punt pole makers",
      lat: 51.734058,
      lng: -1.263187,
      routeIndex: 740,
      kind: "history",
      comment: "F. Collar 为 Oxford 与 Cambridge punt hirers 制作 wooden poles。",
      pageIds: ["book-south-hinksey-poles"],
    },
  ];

  const historyBranchWaypoints = [
    {
      id: "history-lmh-boathouse",
      name: "Lady Margaret Hall Boathouse",
      lat: 51.76575,
      lng: -1.25115,
      kind: "history",
      comment: "1896 年建立；使用 boats 的 members 曾须先取得相应 captain 资格。",
      pageIds: ["book-college-punt-captains"],
      branchId: "cherwell-rollers-bardwell",
      branchIds: ["cherwell-rollers-bardwell"],
    },
    {
      id: "history-mesopotamia",
      name: "Mesopotamia · literary mishap",
      lat: 51.7588,
      lng: -1.2444,
      kind: "history",
      comment: "Barbara Goes to Oxford 中 punter 被 pole 带进 mud 的河段。",
      pageIds: ["book-barbara-goes-oxford"],
      branchId: "cherwell-magdalen-rollers",
      branchIds: ["cherwell-magdalen-rollers"],
    },
    {
      id: "history-st-catherines-boathouse",
      name: "St Catherine’s College Boathouse",
      lat: 51.756689,
      lng: -1.244613,
      kind: "history",
      comment: "曾有到 Victoria Arms 喝完一 pint 才折返的 timed punt race。",
      pageIds: ["book-st-catherines-race"],
      branchId: "cherwell-magdalen-rollers",
      branchIds: ["cherwell-magdalen-rollers"],
    },
  ];

  const waypointIds = new Set(historyWaypoints.map((item) => item.id));
  data.waypoints = [...data.waypoints.filter((item) => !waypointIds.has(item.id)), ...historyWaypoints]
    .sort((a, b) => a.routeIndex - b.routeIndex || a.name.localeCompare(b.name));

  const branchWaypointIds = new Set(historyBranchWaypoints.map((item) => item.id));
  data.branchWaypoints = [
    ...data.branchWaypoints.filter((item) => !branchWaypointIds.has(item.id)),
    ...historyBranchWaypoints,
  ];

  function appendPageIds(item, pageIds) {
    if (!item) return;
    item.pageIds = [...new Set([...(item.pageIds || []), ...pageIds])];
  }

  const waypointStories = {
    "eynsham-lock-567": ["book-eynsham-aelfric"],
    "bablock-hythe-474": ["book-bablock-hithe"],
    "osney-bridge-687": ["book-west-oxford-floods"],
    "folly-bridge-716": ["book-oxford-river-names", "book-oxford-literary-punts", "book-oxford-end", "book-watermens-regatta", "book-long-distance-punts", "book-folly-bridge-hirers"],
    "boathouse-island-725": ["book-christ-church-ferries"],
    "medley-sailing-club-664": ["book-abel-beesley"],
    "perch-ph-mooring-659": ["book-binsey-carroll-hopkins"],
    "donnington-road-bridge-741": ["book-donnington-isis-hotel"],
  };
  Object.entries(waypointStories).forEach(([id, pageIds]) => appendPageIds(data.waypoints.find((item) => item.id === id), pageIds));

  const branchWaypointStories = {
    "cherwell-old-mouth": ["book-godley-isis-cherwell"],
    "cherwell-magdalen-bridge": ["book-prince-edward-magdalen", "book-magdalen-hardway-howard", "book-may-morning", "book-magdalen-nomad", "book-south-hinksey-poles"],
    "cherwell-punt-rollers": ["book-parsons-pleasure", "book-barbara-goes-oxford"],
    "cherwell-high-bridge": ["book-fowler-naval-battle", "book-my-oxford-memories", "book-rainbow-bridge"],
    "cherwell-boathouse": ["book-upper-cherwell-rights", "book-tom-tims", "book-cherwell-boathouse-reinvention"],
    "cherwell-victoria-arms": ["book-charon-club", "book-marston-ferry", "book-st-catherines-race"],
    "cherwell-a40-bridge": ["book-cherwell-hotel-sign"],
  };
  Object.entries(branchWaypointStories).forEach(([id, pageIds]) => appendPageIds(data.branchWaypoints.find((item) => item.id === id), pageIds));

  stories.forEach((page) => {
    if (page.reachId) appendPageIds(data.reaches.find((item) => item.id === page.reachId), [page.id]);
    page.branchIds.forEach((branchId) => appendPageIds(data.branches.find((item) => item.id === branchId), [page.id]));
  });

  data.meta.bookStoryCount = stories.length;
  data.meta.pageCount = data.pages.length;
})();
