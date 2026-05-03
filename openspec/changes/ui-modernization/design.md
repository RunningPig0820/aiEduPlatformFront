## Context

当前项目是一个基于 React 18 + Tailwind CSS 3 + daisyUI 的 AI 教育平台前端。功能完整但视觉层次停留在"能用"阶段。核心组件包括：首页 Landing、三种角色仪表盘（学生/教师/家长）、管理后台、知识图谱页面、AI 对话面板、登录注册页面。所有页面使用 daisyUI 默认的 `light` 主题，字体为系统默认，图标为内联 SVG，交互无过渡动画。

**约束条件**：
- 必须保持 Tailwind CSS + daisyUI 的技术栈不变
- 不引入重量级 UI 库（如 Material UI、Ant Design）
- 保持所有现有功能兼容性
- 新增依赖应轻量且维护活跃

## Goals / Non-Goals

**Goals:**
- 建立统一的品牌视觉体系（色彩、字体、图标、间距、圆角、阴影）
- 每个页面达到"面试展示级别"的精致度
- 保持代码可维护性，不引入过度工程
- 所有改动通过 `npm run build` 验证

**Non-Goals:**
- 不实现深色模式（本次只做 light 主题的精进）
- 不引入动画库（如 Framer Motion），仅用 CSS 过渡
- 不修改任何业务逻辑或 API 调用
- 不改变现有页面路由结构

## Decisions

### D1: 自定义 daisyUI 主题 vs 全新 CSS 变量体系
**决定**：使用 daisyUI 自定义主题配置（tailwind.config.js 中的 `daisyui.themes`），而非另建 CSS 变量层。

**理由**：daisyUI 组件全部依赖其语义色变量（primary、secondary、success 等），重写变量等于替换所有组件样式。通过自定义 theme 可以一次性注入品牌色，同时保持所有 daisyUI 组件（btn、card、stat、navbar、drawer 等）的默认行为不变。

**备选方案**：另建一套 `--color-brand-*` CSS 变量并在 Tailwind 中 extend。缺点是组件层面仍需映射回 daisyUI 变量，增加维护负担。

### D2: 字体方案 — fontsource + CSS font-family
**决定**：通过 `@fontsource/inter` + `@fontsource/noto-sans-sc` 引入字体文件，在 main.css 中覆盖 Tailwind 的 `font-sans` 和 `font-sans`。

**理由**：fontsource 将字体文件放入 node_modules，Vite 自动处理打包和子集加载。相比 Google Fonts CDN 链接，这种方式在无网/内网环境也能正常工作。

**备选方案**：使用系统字体栈。但面试场景下，专业字体带来的精致度提升是系统字体无法替代的。

### D3: 图标库 — Lucide React
**决定**：使用 `lucide-react` 替换所有内联 SVG 图标。

**理由**：
- Lucide 提供 1000+ 线性风格图标，视觉一致性好
- 支持 `size`、`strokeWidth`、`color` props，与 Tailwind 无缝集成
- 体积友好（tree-shaking，只打包用到的图标）
- 维护活跃（每周更新）

**备选方案**：Heroicons（与 Tailwind 同生态，但图标数量少）、Remix Icon（图标多但风格偏重）。

### D4: 渐变与阴影策略 — Tailwind 原生 utility + 自定义扩展
**决定**：在 tailwind.config.js 中 extend `boxShadow` 和 `backgroundImage`，不使用 CSS-in-JS 或内联 style。

**理由**：保持与现有代码风格一致，新增的渐变卡片/阴影卡片可直接用 `className="bg-gradient-card shadow-card-elevated"` 调用。

### D5: 卡片体系 — 新组件 vs 改造现有 StatCard
**决定**：改造现有 StatCard 组件（增加 variant prop），而非新建组件。原因：StatCard 目前只有一处引用，改造成本低于新建。

### D6: 页面过渡动画 — CSS transitions + React 条件渲染
**决定**：不使用 react-transition-group 等库，用 Tailwind 的 `transition` + `opacity` + `scale` 配合条件渲染实现淡入效果。

**理由**：面试场景下，简单的 fade-in 已足够，引入动画库增加 20KB+ bundle。

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| 字体文件增大 bundle（Inter + Noto Sans SC 约 400KB） | 使用 fontsource 的 subset 版本，仅加载 woff2 格式 |
| Lucide 替换图标工作量大（约 30+ 处内联 SVG） | 分批次替换，优先替换仪表盘和导航区域 |
| 自定义主题可能破坏现有 daisyUI 组件样式 | 逐项验证关键组件（btn、card、stat、table、drawer） |
| 首页重设计可能过度复杂 | 保持简单，用 3-4 个 hero section + feature grid，不做 3D/粒子效果 |
| 颜色调整可能影响知识图谱节点可读性 | 图谱节点使用硬coded Tailwind 类，不受主题色影响 |
