## Why

当前 AI 教育平台前端已具备完整的功能框架（仪表盘、知识图谱、AI 对话面板），但整体 UI 仍停留在 daisyUI 默认主题的水平。作为面试展示项目，视觉呈现的精致度直接影响面试官对开发者"软实力"的判断。一个具有现代审美、细节考究的前端界面，能显著提升项目的专业可信度。

## What Changes

- **自定义设计令牌体系**：替换 daisyUI 默认主题为品牌定制色系，引入专业级色彩比例（主色/辅助色/语义色统一映射）
- **全局字体与排版升级**：引入 Inter 字体（英文）+ Noto Sans SC（中文），优化标题、正文、标签的字号比例和行高
- **图标系统替换**：内联 SVG 升级为 Lucide React 图标库，保持风格一致性
- **首页 Landing 页面重设计**：从简单的渐变 + emoji 卡片升级为现代感 hero section + SVG 插画 + 动态效果
- **仪表盘卡片体系升级**：StatCard 从普通矩形升级为带渐变、微动效、数据可视化元素的现代化指标卡
- **知识图谱页面优化**：节点卡片增加悬浮阴影层次、详情面板升级为信息卡片布局
- **登录页重设计**：从简单的渐变背景升级为分屏布局（左品牌区 + 右表单区），增加品牌视觉元素
- **AI 对话面板增强**：增加对话气泡层次、代码块样式、消息时间戳、更精致的输入区域
- **全局细节打磨**：页面过渡动画、加载骨架屏、空状态插画、按钮 hover 微动效、全局圆角与间距一致性

## Capabilities

### New Capabilities

- `design-tokens`: 自定义设计令牌体系（色彩、字体、圆角、阴影、间距），含 daisyUI 主题配置
- `landing-page-redesign`: 首页重设计（hero section、特性展示、动态效果、品牌故事）
- `dashboard-cards`: 现代化仪表盘指标卡和列表卡片组件体系
- `icon-system`: Lucide React 图标库集成与全局替换
- `auth-pages-redesign`: 登录/注册/重置密码页面重设计（分屏布局、品牌元素、精致表单）
- `ai-panel-enhancement`: AI 对话面板增强（气泡层次、代码块、时间戳、精致输入区）
- `global-polish`: 全局细节打磨（过渡动画、骨架屏、空状态、微动效、排版规范）

### Modified Capabilities

- 无

## Impact

- 修改所有页面文件（Home.jsx、auth/Login.jsx、student/Home.jsx、teacher/Home.jsx、parent/Home.jsx、admin/Home.jsx）
- 修改所有布局组件（MainLayout.jsx、AuthLayout.jsx、DashboardLayout.jsx、AdminLayout.jsx）
- 修改所有公共组件（StatCard.jsx、Navbar.jsx、Sidebar.jsx、AIChatPanel.jsx）
- 修改知识图谱页面组件（TextbookTree.jsx、KnowledgeGraph.jsx、DetailPanel.jsx）
- 修改全局样式（styles/main.css）
- 修改 tailwind.config.js（自定义主题配置）
- 新增依赖：lucide-react（图标库）、@fontsource/inter、@fontsource/noto-sans-sc
