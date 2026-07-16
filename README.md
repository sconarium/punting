# Thames Punting · 口袋河图

这是一个随船使用的手机河图，把 [Where Thames Smooth Waters Glide](https://thames.me.uk/) 的地理目录重组为“当前位置—航路点—河段—沿岸掌故”的交互结构。目标不是完整复制网站，而是在 punting 时快速看路线、前后船闸和途经地方的故事入口。

当前版本包含：

- Lechlade 航行上限到 Teddington 的 2,020 个河道坐标点；
- 44 座可点击船闸；
- 44 段相邻船闸之间的可点击河段；
- River Cherwell 拆成 5 个可点击的 Oxford punting 分段：Old Mouth / New Cut 环线、Magdalen–Rollers、Rollers–Bardwell、Bardwell–Victoria Arms、Victoria Arms–Islip；
- Cherwell 主路线使用 413 个 OSM 河道节点，另画出 Magdalen Water、King's Mill 等不建议支汊和 rollers 搬船线；
- 265 个桥、泊位、支流口、酒馆、岛屿等航路点，其中 24 个是带现场转向说明的 Cherwell 专用航点；
- 613 个站点目录条目，支持中英文界面搜索；
- 手机 GPS 定位、最近河段及上下游船闸距离；在 Cherwell 上显示当前位置距所处分段两端的沿线距离；
- “随身夹”收藏常走河段和想看的掌故，保存在本机；
- 离线平移、缩放、搜索和目录浏览；
- 可选在线 OpenStreetMap 街道底图；
- PWA 缓存和移动端布局；
- 获得许可后可运行的正文/图片镜像工具。

## 运行

在本目录执行：

```bash
python3 -m http.server 4173
```

然后访问 <http://127.0.0.1:4173/>。地图核心不需要联网；“在线街道底图”只有在用户主动开启时才请求 OpenStreetMap 图块。

## 数据来源与覆盖范围

地图目录由站点公开的 `menu.js` 提取；非潮汐河道与船闸坐标由公开的 `SatNav.js` 提取。生成脚本只保存名称、说明、原始链接和地理坐标，不复制作者文章正文或图片。

如需在源站更新后重建目录：

```bash
curl -L -o /tmp/thames-menu.js https://thames.me.uk/menu.js
curl -L -o /tmp/thames-satnav.js https://thames.me.uk/SatNav.js
python3 scripts/build_catalog.py \
  --menu /tmp/thames-menu.js \
  --satnav /tmp/thames-satnav.js \
  --output data/catalog.js
```

旧 SatNav 数据只覆盖 Lechlade 航行上限至 Teddington，因此 Cherwell 另外逐段依据作者的 Oxford punting 专题说明整理，并以 Google Maps 作视觉交叉核对、以 OpenStreetMap 可再利用的河道节点作为实际线形。作者所述的 T 字口、岛汊、两处侧向堰流、rollers 搬船点、A40 上游左侧主航道和 Ray 汇入口均在地图中单列。613 个目录条目包括潮汐河段和河口内容，但潮汐河段尚未绘制成可点击线段；后续可用合规许可的 OSM/PMTiles 河道几何补全。

## 掌故的轻量使用方式

路线、船闸、航路点、短说明与文章索引都会随 App 离线保存。选中地点后，可以把卡片收入“随身夹”；需要深入阅读时再打开 John Eade 的原文。这样安装包保持很小，也不必完整复制网站。

如已获得许可，且确实需要为某次航程准备少量无网络阅读材料，可使用下面的镜像工具。日常使用不需要运行它。

## 可选：获授权后导入正文与图片

源站页面声明 John Eade 的版权；首页也说明部分图片和文字是经第三方许可后展示。因此，完整离线镜像或对外发布 App 前，应先取得作者和相关权利人的许可。

取得许可后运行：

```bash
python3 scripts/mirror_site.py \
  --confirm-rights \
  --output content
```

工具会：

- 按目录逐页下载并限速；
- 下载同站图片、PDF、样式等资源；
- 删除脚本、iframe 和内联事件，避免离线副本后台联网；
- 保留原始页面归属链接；
- 生成 `content/manifest.js`，地图会自动显示“阅读离线正文”按钮；
- 默认限制单个资源为 30 MB、总量为 1.5 GB，可通过命令参数调整。

未提供 `--confirm-rights` 时，工具会直接退出，不会下载内容。

## 变成手机/桌面 App

这套静态应用已经具备 PWA 基础。完成内容授权与离线底图后，可以：

1. 直接作为 PWA 安装；
2. 用 Capacitor 包装为 iOS/Android App；
3. 用 Tauri 包装为 macOS/Windows 桌面 App；
4. 将 Thames 沿岸 PMTiles 放进安装包，实现真正的离线街道、地名与缩放级别。

### 安装到 iPhone

发布到 HTTPS 地址后，在 iPhone 的 Safari 中打开网址，点“分享”→“添加到主屏幕”，开启“作为网页 App 打开”后点“添加”。第一次从主屏幕启动时保持联网片刻，让路线、航点和目录写入离线缓存。

本地的 `file://` 地址和 Mac 局域网的 `http://` 地址只适合预览，不能作为可靠的离线安装地址。

### GitHub Pages

项目中的资源都使用相对路径，可以直接发布在 `https://<用户名>.github.io/<仓库名>/` 这样的子目录下。将仓库推送到 GitHub 后，在仓库 Settings → Pages 中选择 **Deploy from a branch**，并把来源设为 `main` / `(root)`。根目录中的 `.nojekyll` 会让 GitHub Pages 原样发布静态文件。

## 第三方组件与归属

- 站点目录与 SatNav 数据：John Eade / [thames.me.uk](https://thames.me.uk/)。
- Cherwell 河道几何与部分航点位置：© OpenStreetMap contributors，ODbL 1.0；作者专题页提供路线分段与 punting 上限语境。
- Leaflet 1.9.4：BSD-2-Clause，许可证见 [`vendor/LEAFLET-LICENSE.txt`](vendor/LEAFLET-LICENSE.txt)。
- 用户主动开启的在线街道底图：© OpenStreetMap contributors。

本项目当前是本地技术原型，不包含源站文章正文和图片，也未宣称获得转载或再发行许可。
