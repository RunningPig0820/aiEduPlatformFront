## Test Strategy

本次 UI 现代化改造以**视觉验证测试**为主。由于改造不涉及业务逻辑变更，测试策略为：
- **构建验证**：每次修改后运行 `npm run build` 确认无编译错误
- **开发服务器手动验证**：`npm run dev` 启动后在浏览器中逐页面检查视觉效果
- **Playwright 截图对比**（可选）：对关键页面（首页、登录页、仪表盘）进行截图基线测试

## Test Cases

### 1. 设计令牌 (design-tokens)

### TC-1.1: 自定义主题色正确应用
- **Priority**: High
- **Given**: 应用已启动
- **When**: 查看任意页面中的 `btn btn-primary` 按钮
- **Then**: 按钮显示自定义靛蓝色 `#4F46E5`，而非 daisyUI 默认紫色
- **Ref**: specs/design-tokens/spec.md#Custom Brand Color Palette

### TC-1.2: 字体正确加载
- **Priority**: High
- **Given**: 应用已启动
- **When**: 在浏览器 DevTools 中检查任意文本元素
- **Then**: `font-family` 显示为 `'Inter', 'Noto Sans SC', system-ui, sans-serif`
- **Ref**: specs/design-tokens/spec.md#Custom Typography System

### TC-1.3: 自定义阴影工具类可用
- **Priority**: Medium
- **Given**: 应用已启动
- **When**: 一个 div 使用 `shadow-card-elevated` 类
- **Then**: 元素渲染出微妙的层级阴影效果
- **Ref**: specs/design-tokens/spec.md#Extended Shadow and Gradient Utilities

### TC-1.4: 渐变背景正确渲染
- **Priority**: Medium
- **Given**: 应用已启动
- **When**: 登录页品牌面板或首页 hero 使用 `bg-gradient-hero`
- **Then**: 显示 135deg 从 primary 到 secondary 的对角渐变
- **Ref**: specs/design-tokens/spec.md#Extended Shadow and Gradient Utilities

### 2. 图标系统 (icon-system)

### TC-2.1: 侧边栏菜单图标正确显示
- **Priority**: High
- **Given**: 用户已登录并进入仪表盘页面
- **When**: 查看侧边栏菜单项
- **Then**: 每个菜单项前显示 Lucide 图标，激活项图标为角色色，未激活项为 `text-base-content/60`
- **Ref**: specs/icon-system/spec.md#Sidebar Menu Icons

### TC-2.2: StatCard 使用 Lucide 图标
- **Priority**: High
- **Given**: 仪表盘页面已加载
- **When**: 查看任意 StatCard
- **Then**: 图标为 Lucide React 组件渲染的 20x20 图标
- **Ref**: specs/icon-system/spec.md#Navbar and StatCard Icons

### TC-2.3: 构建产物中仅包含用到的图标
- **Priority**: Low
- **Given**: 已运行 `npm run build`
- **When**: 检查 dist 目录下生成的 JS bundle
- **Then**: 仅包含实际导入的 Lucide 图标代码，未使用的图标被 tree-shake 掉
- **Ref**: specs/icon-system/spec.md#Lucide React as Primary Icon Source

### 3. 仪表盘卡片 (dashboard-cards)

### TC-3.1: StatCard 渲染渐变顶条和圆形图标
- **Priority**: High
- **Given**: 仪表盘页面已加载
- **When**: 查看 StatCard 组件
- **Then**: 卡片顶部显示角色色渐变条，左侧有圆形图标容器，右侧有 title 和 value
- **Ref**: specs/dashboard-cards/spec.md#Modern StatCard Component

### TC-3.2: StatCard hover 时阴影增强
- **Priority**: Medium
- **Given**: 仪表盘页面已加载
- **When**: 鼠标悬停在 StatCard 上
- **Then**: 卡片阴影从 elevated 平滑过渡到 hover 级别
- **Ref**: specs/dashboard-cards/spec.md#Modern StatCard Component

### TC-3.3: 列表项有左侧角色色边框
- **Priority**: Medium
- **Given**: 学生仪表盘已加载
- **When**: 查看待办作业列表项
- **Then**: 每个列表项有左侧 success（绿色）边框，hover 时背景色加深
- **Ref**: specs/dashboard-cards/spec.md#Content Card Enhancement

### 4. 首页重设计 (landing-page-redesign)

### TC-4.1: Hero section 正确展示
- **Priority**: High
- **Given**: 访问首页 `/`
- **When**: 页面加载完成
- **Then**: hero 区域最小高度 70vh，品牌渐变背景，居中大标题+副标题+双 CTA 按钮
- **Ref**: specs/landing-page-redesign/spec.md#Modern Hero Section

### TC-4.2: Hero 标题有 fadeIn 动画
- **Priority**: Medium
- **Given**: 访问首页 `/`
- **When**: 页面首次渲染
- **Then**: 标题从 opacity-0 translateY 20px 淡入到 opacity-100
- **Ref**: specs/landing-page-redesign/spec.md#Modern Hero Section

### TC-4.3: 特性卡片有圆形图标容器
- **Priority**: High
- **Given**: 访问首页 `/`
- **When**: 向下滚动到特性区域
- **Then**: 3 列网格中每张卡片有 56x56px 圆形图标容器，图标为 Lucide 组件
- **Ref**: specs/landing-page-redesign/spec.md#Feature Cards with Icon Circles

### TC-4.4: 特性卡片 hover 时阴影增强
- **Priority**: Medium
- **Given**: 首页已加载
- **When**: 鼠标悬停在特性卡片上
- **Then**: 卡片阴影平滑增强，过渡动画流畅
- **Ref**: specs/landing-page-redesign/spec.md#Feature Cards with Icon Circles

### TC-4.5: Footer 展示品牌链接
- **Priority**: Low
- **Given**: 访问首页 `/`
- **When**: 滚动到页面底部
- **Then**: footer 显示品牌渐变背景、白色文字、快速链接和版权信息
- **Ref**: specs/landing-page-redesign/spec.md#Landing Page Footer with Links

### 5. 登录页重设计 (auth-pages-redesign)

### TC-5.1: 桌面端分屏布局
- **Priority**: High
- **Given**: 访问登录页 `/login`，屏幕宽度 ≥ 1024px
- **When**: 页面加载完成
- **Then**: 左侧 50% 显示品牌渐变面板（大图标+标语+特性），右侧 50% 显示居中表单
- **Ref**: specs/auth-pages-redesign/spec.md#Split-Screen Auth Layout

### TC-5.2: 移动端隐藏品牌面板
- **Priority**: High
- **Given**: 访问登录页 `/login`，屏幕宽度 < 1024px
- **When**: 页面加载完成
- **Then**: 仅显示表单区域，居中于渐变背景上
- **Ref**: specs/auth-pages-redesign/spec.md#Split-Screen Auth Layout

### TC-5.3: 输入框 focus 显示 primary ring
- **Priority**: Medium
- **Given**: 登录页已加载
- **When**: 点击任意文本输入框
- **Then**: 输入框边框变为 primary 色，并显示 `ring-2 ring-primary/20` 光晕
- **Ref**: specs/auth-pages-redesign/spec.md#Refined Form Inputs

### TC-5.4: 角色选择器为按钮组
- **Priority**: Medium
- **Given**: 注册表单已展示
- **When**: 查看角色选择区域
- **Then**: 显示 4 个带 Lucide 图标的圆角按钮，选中项有 primary 色边框和背景
- **Ref**: specs/auth-pages-redesign/spec.md#Role Selector as Button Group

### TC-5.5: Demo 登录卡片 hover 效果
- **Priority**: Low
- **Given**: 登录页已加载
- **When**: 鼠标悬停在 Demo 快速登录卡片上
- **Then**: 卡片阴影增强，边框过渡到 primary 色
- **Ref**: specs/auth-pages-redesign/spec.md#Demo Login Cards

### 6. AI 面板增强 (ai-panel-enhancement)

### TC-6.1: 用户消息为 primary 色气泡
- **Priority**: High
- **Given**: AI 面板已打开
- **When**: 发送一条消息
- **Then**: 消息显示在 primary 色圆角气泡中，右对齐
- **Ref**: specs/ai-panel-enhancement/spec.md#Enhanced Chat Bubble Design

### TC-6.2: AI 消息有 accent 左边框
- **Priority**: High
- **Given**: AI 面板已打开
- **When**: AI 回复一条消息
- **Then**: 消息显示在 base-200 气泡中，带左侧 accent 边框和时间戳
- **Ref**: specs/ai-panel-enhancement/spec.md#Enhanced Chat Bubble Design

### TC-6.3: 代码块使用深色背景
- **Priority**: Medium
- **Given**: AI 面板已打开
- **When**: AI 回复中包含代码块
- **Then**: 代码块使用 `bg-neutral` 深色背景、等宽字体、圆角
- **Ref**: specs/ai-panel-enhancement/spec.md#Code Block Styling

### TC-6.4: 输入区域有精致容器
- **Priority**: Medium
- **Given**: AI 面板已打开
- **When**: 查看消息输入区域
- **Then**: 输入框有 rounded base-200 容器，右侧有 primary 色 Send 图标按钮
- **Ref**: specs/ai-panel-enhancement/spec.md#Refined Input Area

### 7. 全局打磨 (global-polish)

### TC-7.1: 页面加载有 fadeIn 动画
- **Priority**: Medium
- **Given**: 从首页导航到仪表盘
- **When**: 新页面加载
- **Then**: 内容从 opacity-0 translateY 2px 淡入到完全可见，300ms ease-out
- **Ref**: specs/global-polish/spec.md#Page Transition Animations

### TC-7.2: 空状态展示图标和文字
- **Priority**: Medium
- **Given**: 用户没有待办作业
- **When**: 查看学生仪表盘的作业列表区域
- **Then**: 显示居中的 Lucide 图标（64px, text-base-content/20）+ "暂无作业" 文字
- **Ref**: specs/global-polish/spec.md#Empty State Illustrations

### TC-7.3: 按钮 hover 有 scale 微动效
- **Priority**: Low
- **Given**: 任意页面已加载
- **When**: 鼠标悬停在 primary 或 secondary 按钮上
- **Then**: 按钮轻微放大 scale(1.02)，150ms 过渡
- **Ref**: specs/global-polish/spec.md#Button Hover Micro-animations

### TC-7.4: 页面间距一致性
- **Priority**: Medium
- **Given**: 任意仪表盘页面已加载
- **When**: 检查主内容区域
- **Then**: 页面使用 `p-6` 内边距，卡片间距 `gap-4`，区块间距 `space-y-6`
- **Ref**: specs/global-polish/spec.md#Consistent Spacing System

## Test Environment

- **浏览器**: Chrome 120+（推荐）、Firefox 121+、Safari 17+
- **屏幕尺寸**: Desktop 1920x1080、Tablet 768x1024、Mobile 375x812
- **Node.js**: 18+
- **测试数据**: 使用 Demo 登录功能分别以学生/教师/家长/管理员角色登录
- **Mock**: 使用项目现有的 demo-login 接口，无需额外 mock

## Coverage Goals

- **构建验证**: 所有修改必须通过 `npm run build` 无错误
- **页面覆盖**: 100% 的页面文件（7 个页面 + 4 个布局 + 8 个公共组件 + 4 个 KG 组件）
- **规格覆盖**: 7 个 spec 文件中的所有 ADDED Requirements 均有对应的测试用例
- **视觉覆盖**: 所有自定义设计令牌（颜色、字体、阴影、渐变、圆角、间距）在至少一个页面中可验证
