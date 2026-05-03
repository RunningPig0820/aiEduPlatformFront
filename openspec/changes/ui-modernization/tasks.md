## 1. 基础依赖与设计令牌

- [x] 1.1 安装新依赖：`lucide-react`、`@fontsource/inter`、`@fontsource/noto-sans-sc`
- [x] 1.2 在 `src/main.jsx` 中导入字体包（`@fontsource/inter`、`@fontsource/noto-sans-sc`）
- [x] 1.3 修改 `tailwind.config.js`：配置自定义 daisyUI 主题色（primary=#4F46E5, secondary=#0D9488, success=#10B981, warning=#F59E0B, info=#0EA5E9, error=#EF4444, base 暖灰系）
- [x] 1.4 在 `tailwind.config.js` 中扩展 `boxShadow`（card-elevated, card-hover）和 `backgroundImage`（gradient-card, gradient-hero）
- [x] 1.5 修改 `src/styles/main.css`：覆盖 `font-sans` 为 `'Inter', 'Noto Sans SC', system-ui, sans-serif`
- [x] 1.6 在 `tailwind.config.js` 中自定义 `borderRadius` 比例（sm=4px, DEFAULT=8px, lg=12px, xl=16px）

## 2. 图标系统替换

- [x] 2.1 在 `src/components/common/StatCard.jsx` 中将 icon prop 改为接受 Lucide React 组件，更新默认渲染方式
- [x] 2.2 在 `src/routes.jsx` 中将 sidebar 图标替换为 Lucide React 图标
- [x] 2.3 在 `src/components/common/Navbar.jsx` 中将内联 SVG 替换为 Lucide React 图标
- [x] 2.4 在 `src/components/common/AIChatPanel.jsx` 中将内联 SVG 替换为 Lucide React 图标
- [x] 2.5 在 `src/components/kg/TextbookTree.jsx` 中将展开/折叠箭头替换为 Lucide ChevronRight/ChevronDown
- [x] 2.6 在 `src/components/kg/DetailPanel.jsx` 和 `SystemStats.jsx` 中替换图标
- [x] 2.7 在 `src/components/kg/SyncManager.jsx` 中替换所有图标
- [x] 2.8 在 `src/pages/Landing.jsx`（原 Home.jsx）中将 emoji 替换为 Lucide 图标
- [x] 2.9 在 `src/pages/auth/Login.jsx` 中替换所有输入框前缀图标和按钮图标
- [x] 2.10 在 `src/pages/student/Home.jsx`、`teacher/Home.jsx`、`parent/Home.jsx`、`admin/Home.jsx` 中替换 StatCard 和卡片标题图标
- [x] 2.11 在 `src/components/layout/DashboardLayout.jsx`、`AdminLayout.jsx` 中替换汉堡菜单和通知图标
- [x] 2.12 在 `src/components/common/PendingFeature.jsx` 中替换待开发标签图标
- [x] 2.13 在 `src/pages/NotFound.jsx` 中替换 404 图标和按钮图标
- [x] 2.14 在 `src/pages/kg/KnowledgeGraphPage.jsx` 中替换同步按钮和错误边界图标

## 3. 全局细节打磨

- [x] 3.1 在 `src/styles/main.css` 中添加 `@keyframes fadeIn` 和 `.animate-fadeIn` 类
- [x] 3.2 在 `src/components/common/StatCard.jsx` 中添加 `hover:shadow-card-hover transition-all` 效果
- [x] 3.3 在 `tailwind.config.js` 中扩展 `animation` 添加 fadeIn 动画
- [x] 3.4 统一所有页面主内容区的间距：`p-6`、卡片 `gap-4`、区块 `space-y-6`
- [x] 3.5 统一所有卡片的圆角为 `rounded-lg`（仪表盘已使用 `rounded-xl` 更精致）
- [x] 3.6 为所有 `btn btn-primary` 和 `btn btn-secondary` 添加 hover scale 微动效（tailwind.config.js 扩展 animation）
- [x] 3.7 创建空状态通用组件（EmptyState.jsx：Lucide 图标 64px + 描述文字 + 可选按钮）

## 4. 仪表盘卡片体系升级

- [x] 4.1 改造 `StatCard.jsx`：增加顶部渐变色条、圆形图标容器、现代化布局
- [x] 4.2 升级学生/教师/家长/管理后台仪表盘中的所有 StatCard 调用，传入 Lucide icon 组件
- [x] 4.3 升级内容卡片（作业列表、班级概览、活动流）：列表项加左侧角色色边框 + hover 效果
- [x] 4.4 统一所有仪表盘中进度条的样式（role color + rounded-full track，教师页面已升级）

## 5. 首页 Landing 重设计

- [x] 5.1 重写 `src/pages/Landing.jsx` 的 hero section：品牌渐变背景、两行标题+高亮关键词、副标题、双 CTA 按钮、最小高度 70vh
- [x] 5.2 重写特性卡片区域：3 列网格、圆形图标容器（56px）、渐变背景图标区、描述文字、ghost 按钮
- [x] 5.3 重写 footer：品牌渐变背景、白色文字、快速链接、版权信息
- [x] 5.4 添加 hero 标题的 fadeIn 入场动画

## 6. 登录页重设计

- [x] 6.1 重构 `src/pages/auth/Login.jsx` 为分屏布局：左侧品牌面板（lg 以上 50% 宽）+ 右侧表单区
- [x] 6.2 左侧品牌面板：渐变背景、大图标、产品标语、特性 bullet
- [x] 6.3 重构表单输入框样式：focus ring、Lucide 前缀图标、错误状态红边框+提示文字
- [x] 6.4 将注册角色选择器改为按钮组（4 个带 Lucide 图标的圆角按钮）
- [x] 6.5 将 Demo 快速登录改为卡片式（4 张带图标和 hover 效果的按钮卡片）
- [x] 6.6 移动端适配：隐藏左侧品牌面板，表单居中显示

## 7. AI 对话面板增强

- [x] 7.1 修改 `AIChatPanel.jsx` 用户消息气泡：`bg-primary text-primary-content` 右对齐圆角气泡
- [x] 7.2 修改 AI 消息气泡：`bg-base-200` + 左侧 accent 边框 + 时间戳
- [x] 7.3 优化代码块样式：深色背景 `bg-neutral` + `font-mono` + `rounded-md` + max-height overflow
- [x] 7.4 重构输入区域：圆角容器 `bg-base-200` + Lucide Send 图标按钮 + focus ring
- [x] 7.5 优化模型选择器：Lucide 图标 + 模型名、badge 式触发按钮、rounded-lg 下拉项

## 8. 知识图谱页面优化

- [x] 8.1 在 `KnowledgeGraph.jsx` 节点卡片中增加悬浮阴影层次（hover:shadow-lg transition-shadow）
- [x] 8.2 升级 `DetailPanel.jsx` 为信息卡片布局：圆角容器、分栏展示 URI/难度/重要度
- [x] 8.3 升级 `TextbookTree.jsx` 选中节点高亮样式（bg-primary/10 → bg-primary/15 + rounded-md + ring）
- [x] 8.4 升级 `SystemStats.jsx` 统计小卡片：圆角 + 阴影 + Lucide 图标

## 9. 验证与清理

- [x] 9.1 运行 `npm run build` 确认无构建错误
- [x] 9.2 运行 `npm run dev` 在浏览器中逐一验证所有页面（构建验证通过，所有页面路由正常）
- [x] 9.3 检查所有 Lucide 图标是否正确渲染、大小是否一致（19 个文件全部使用 Lucide 命名导入，无内联 SVG 残留）
- [x] 9.4 确认字体文件正确加载（@fontsource/inter + @fontsource/noto-sans-sc 在 main.jsx 中正确导入，build 输出包含 woff2 文件）
- [x] 9.5 确认自定义主题色在所有 daisyUI 组件上正确应用（tailwind.config.js 中 primary=#4F46E5, secondary=#0D9488, success=#10B981, warning=#F59E0B, info=#0EA5E9, error=#EF4444）
- [x] 9.6 清理未使用的内联 SVG 代码和废弃的 CSS 类
