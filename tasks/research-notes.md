# iOS 26 Liquid Glass + motion.dev 动画重构 — 调研路径与参考

## 1. 调研路径总览

```
问题识别 → 技术选型 → 视觉风格调研 → 动画库评估 → 架构设计 → 实施
```

### 1.1 问题识别

现有实现的痛点：

| 问题 | 根因 |
|------|------|
| 组件卸载时无退场动画，瞬间消失 | React 卸载 DOM 后 CSS animation 无法播放 |
| CSS `linear()` 模拟弹簧手感偏硬 | `linear()` 是分段线性近似，非真实弹簧微分方程求解 |
| 不透明白色背景与 iOS 26 设计语言脱节 | 缺少 `backdrop-filter` + 半透明材质 |

### 1.2 技术选型：为什么是 motion.dev（原 Framer Motion）

**候选方案对比：**

| 方案 | 退场动画 | 弹簧物理 | Layout 动画 | 包体积 | React 集成 |
|------|---------|---------|------------|--------|-----------|
| CSS Keyframes | ❌ 无法做 | ❌ 只能 `linear()` 近似 | ❌ | 0 KB | N/A |
| react-spring | ✅ | ✅ | ❌ 需手动 | ~18 KB | ✅ |
| motion.dev (Framer Motion v12+) | ✅ `AnimatePresence` | ✅ 真实弹簧 | ✅ `layout` prop | ~18 KB (tree-shake) | ✅ 一等公民 |
| GSAP | ✅ 但需手动 | ✅ | ❌ | ~30 KB | 需适配 |
| @formkit/auto-animate | ✅ 自动 | ❌ | ✅ | ~2 KB | 有限 |

**选择 motion.dev 的决定因素：**
- `AnimatePresence` 一行代码解决 React 卸载退场动画（核心痛点）
- `layout` prop 自动计算布局变化并插值动画（Toolbar 展开/折叠）
- 弹簧参数直觉化：`bounce` + `duration` 比 `stiffness/damping/mass` 更好调
- v12 起独立发布为 `motion` 包（脱离 Framer 品牌），API 稳定

### 1.3 视觉风格调研：iOS 26 Liquid Glass

**Apple WWDC25 关键信息：**
- iOS 26 (原 iOS 19) 引入 "Liquid Glass" 设计语言
- 核心特征：半透明材质 + 实时背景模糊 + 高饱和度 + 细边框 + 柔和阴影
- 官方 Human Interface Guidelines 更新了 Materials 章节

**提取的 CSS 参数：**

```css
/* 从 Apple 设计资源和社区还原中提炼 */
--glass-bg: rgba(255, 255, 255, 0.72);       /* 72% 白色，非全透 */
--glass-border: rgba(255, 255, 255, 0.3);     /* 极细边框，30% 白 */
--glass-shadow: 0 8px 32px rgba(0,0,0,0.08);  /* 大扩散、低透明度 */
--glass-blur: blur(20px) saturate(180%);       /* 20px 模糊 + 饱和度提升 */
```

**为什么选这组数值：**
- `blur(20px)` — Apple 系统级毛玻璃通常在 16-24px 之间，20px 是平衡点
- `saturate(180%)` — 提升背景色彩浓度，避免模糊后画面发灰
- `rgba(255,255,255,0.72)` — 足够透出背景内容，又能保证文字可读性（WCAG 对比度）
- `0.5px border` — Retina 屏下的亚像素细线，iOS 原生控件常用手法

## 2. 实际参考的文章与资源（规划阶段 WebFetch/WebSearch 记录）

### 2.1 iOS 26 Liquid Glass — 实际 fetch 过的页面

#### [Apple Newsroom — Apple introduces a delightful and elegant new software design](https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/)
- **提取信息：** Liquid Glass 官方定义 — 半透明材质实时反射折射周围环境，specular 高光，明暗模式自适应色彩，Tab bar 滚动时缩小/展开时流体动画，圆角与硬件同心，San Francisco 字体动态缩放 weight/width/height

#### [NN/g — Liquid Glass](https://www.nngroup.com/articles/liquid-glass/)
- **提取信息：** Nielsen Norman Group 的可用性批评 — 文字在复杂背景上伪装，Mail 中 "文字叠文字" 不可读，图标与背景融合，搜索栏几乎消失，控件不必要的动画造成干扰，触控目标显著缩小，导航元素不可预测地出现/消失/重定位
- **对项目的影响：** 确认了我们需要 `rgba(255,255,255,0.72)` 这种较高不透明度（而非 Apple 默认的更低值），保证文字可读性

#### [Dev.to — WWDC 2025: Apple's Liquid Glass Design System](https://dev.to/arshtechpro/wwdc-2025-apples-liquid-glass-design-system-52an)
- **提取信息：** 设计系统细节 — UI 层浮于内容之上，系统色在 Light/Dark/Increased Contrast 模式间调整，更粗的文字渲染，三种核心形状：Fixed Shapes（固定圆角）、Capsules（圆角 = 容器高度一半，iOS 触控推荐）、Concentric Shapes（圆角 = 父级圆角 - padding），每个视图仅一个滚动边缘效果
- **对项目的影响：** 确认 Toolbar 应使用 Capsule 形状（`border-radius: 9999px`）

#### [LiquidGlass.shop — Liquid Glass Guide](https://liquidglass.shop/en/guides/liquid-glass)
- **提取信息：** CSS 实现配方 — `background: rgba(255,255,255,0.7)`, `backdrop-filter: blur(10px)`, `border-radius: 16px`, `border: 1px solid rgba(255,255,255,0.1)`, `box-shadow: 0 4px 30px rgba(0,0,0,0.05)`；SwiftUI 用 `.background(.ultraThinMaterial)`；弹簧动画 + 触控响应反馈 + 一致的海拔层级
- **对项目的影响：** 直接参考了 blur/background/border 参数，在此基础上调高了 blur(10→20px) 和 background opacity(0.7→0.72)

#### [LogRocket — How to create liquid glass effects with CSS and SVG](https://blog.logrocket.com/how-create-liquid-glass-effects-css-and-svg/)
- **提取信息：** CSS/SVG 具体实现 — `backdrop-filter: blur(4px) brightness(150%)`，`border-radius: 60px`，`background-color: hsl(0 100% 100% / 15%)`，`box-shadow: 0 4px 12px rgba(0,0,0,0.04)`；SVG filter 原语：`feGaussianBlur stdDeviation="1"` + `feDisplacementMap scale="55"` 模拟折射 + `feColorMatrix type="saturate" values="50"` + `feComposite/feBlend` 合成
- **对项目的影响：** SVG filter 方案过于重量级不适合 widget，但其 `saturate()` 叠加的思路被采纳（我们用 `saturate(180%)`）

#### [Medium — iOS 26 Motion Design Guide (foks.wang)](https://medium.com/@foks.wang/ios-26-motion-design-guide-key-principles-and-practical-tips-for-transition-animations-74def2edbf7c)
- **结果：** 403 Forbidden，未能获取内容

### 2.2 motion.dev — 实际 fetch 过的页面

#### [motion.dev/docs/react](https://motion.dev/docs/react) | [react-motion-component](https://motion.dev/docs/react-motion-component) | [react-installation](https://motion.dev/docs/react-installation) | [react-animation](https://motion.dev/docs/react-animation)
- **结果：** 均只提取到 CSS 字体定义，motion.dev 站点用 Framer 构建、客户端渲染，WebFetch 无法抓取实际文档内容
- **备注：** 改用 Context7 工具成功获取了文档

#### Context7 查询 `/websites/motion_dev_react`（成功获取）
- **查询 1：** AnimatePresence + exit 动画 + spring 配置
  - 获取：`AnimatePresence` 组件用法（`initial`/`animate`/`exit` props），`useSpring` hook（`stiffness: 300`），layout 动画 `transition` prop 定制
- **查询 2：** spring 参数 + layout + variants
  - 获取：spring 动画配置详细参数（stiffness, damping, mass, bounce, duration），`layout` prop，`layoutId`，variants API
- **查询 3：** 安装 + whileHover + whileTap + 手势
  - 获取：`npm install motion`，`import { motion } from "motion/react"`，按钮动画示例 `whileHover={{ scale: 1.1 }}` + `whileTap={{ scale: 0.9 }}`

### 2.3 WebSearch 搜索记录（5 次查询）

| # | 搜索词 | 目的 |
|---|--------|------|
| 1 | `iOS 26 Liquid Glass design language WWDC 2025` | 定位官方来源和权威解读 |
| 2 | `iOS 26 Liquid Glass visual characteristics blur translucency typography` | 深入视觉细节参数 |
| 3 | `motion.dev react framer-motion API 2025` | 确认 motion 包现状和迁移路径 |
| 4 | `motion.dev npm install "motion" package react import motion AnimatePresence 2025` | 确认安装方式和导入路径 |
| 5 | `iOS 26 Liquid Glass animation motion principles spring physics shape morphing pill capsule` | 调研动画原则，定位弹簧参数 |

### 2.4 补充参考（未直接 fetch 但影响了决策）

| 资源 | 链接 | 要点 |
|------|------|------|
| motion.dev AnimatePresence 文档 | https://motion.dev/docs/react-animate-presence | 退场动画核心机制 |
| motion.dev Layout Animations | https://motion.dev/docs/react-layout-animations | `layout` prop 自动布局过渡 |
| motion.dev Spring 过渡配置 | https://motion.dev/docs/react-transitions | `type: "spring"`, `bounce`, `duration` 参数 |
| CSS `backdrop-filter` (MDN) | https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter | 浏览器兼容性，`blur()` + `saturate()` 用法 |
| Can I Use backdrop-filter | https://caniuse.com/css-backdrop-filter | Safari 需 `-webkit-` 前缀，Chrome 76+ 原生 |
| Glassmorphism CSS Generator | https://css.glass/ | 在线可视化调参工具 |

## 3. 关键技术决策记录

### 3.1 为什么 Toolbar 用 `motion.div animate` 而不是 CSS class 切换

```
CSS class 切换: .toolbar--collapsed { background: blue } → 需要 transition 属性
motion animate:  animate={{ background: "rgb(37,99,235)" }} → 自动弹簧插值
```

motion 的 `animate` prop 在值变化时自动应用 `transition` 配置（弹簧），无需手动维护 `transition` 属性列表。且 collapsed→expanded 的多属性同步变化（background、padding、gap、boxShadow、borderColor）用 motion 一个 `animate` 对象搞定，比 CSS 的 `transition: prop1, prop2, prop3...` 更简洁。

### 3.2 为什么 expand 用 AnimatePresence + width:0→auto 而不是 layout

Toolbar 展开区域是条件渲染（`{open && <div>...</div>}`），layout 动画要求元素始终在 DOM 中。`AnimatePresence` + `width: 0 → "auto"` 组合：
- 支持真正的 DOM 卸载（collapsed 时不占 DOM）
- `width: "auto"` 是 motion.dev 独有能力，CSS transition 无法 animate 到 `auto`

### 3.3 为什么 ElementHighlight 不用 motion

```
鼠标跟踪 → 每帧更新位置 → 需要 < 16ms 响应
CSS transition 0.05s ease-out → 原生合成器线程，零 JS 开销
motion.div → 每帧触发 React 重渲染 + JS 弹簧求解 → 可能掉帧
```

高频更新场景下 CSS transition 性能优于 JS 动画库。

### 3.4 tsup external 策略

```ts
// Library build (ESM/CJS) — 消费者自行提供 motion
external: ["react", "react-dom", "motion", "motion/react"]

// Standalone build (IIFE) — 全量打包，直接 <script> 引入即用
// 不设 external，noExternal 已包含 react/react-dom
```

Library 用户通常有自己的打包工具，externalize 避免重复打包。Standalone 是 `<script>` 直接用，必须自包含。

### 3.5 弹簧参数选择

```ts
{ type: "spring", bounce: 0.15, duration: 0.5 }
```

- `bounce: 0.15` — 15% 的回弹量，比 iOS 原生略微克制（iOS 约 0.2），适合小型 UI 控件
- `duration: 0.5` — 500ms 总持续时间，与之前 CSS `0.45s-0.6s` 保持视觉一致性
- 全局统一一套参数，保持动画节奏一致（设计系统原则）
