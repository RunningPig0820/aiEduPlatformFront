## 0. 前置准备

- [x] 0.1 与后端确认图谱 API 响应格式及节点/边字段规范（nodes/edges JSON 结构）
- [x] 0.2 使用 Swagger / Apifox mock 数据，前端先行开发和调试

## 1. 项目初始化

- [x] 1.1 初始化 React SPA 项目（Vite 5 + React 18 + react-router-dom）
- [x] 1.2 配置 Tailwind CSS + daisyUI
- [x] 1.3 安装 React Flow 依赖（@xyflow/react）
- [x] 1.4 配置 Vite 开发服务器和 API 代理（/api → localhost:8080）

## 2. 基础架构

- [x] 2.1 创建项目目录结构（src/pages/、src/components/kg/、src/api/modules/）
- [x] 2.2 创建 API 基础封装（request 工具函数，支持 credentials: include）
- [x] 2.3 创建知识图谱 API 模块 `src/api/modules/kg.js`
- [x] 2.4 配置路由 `/admin/knowledge-graph`

## 3. 树形导航组件

- [x] 3.1 实现 `TextbookTree.jsx` 基础结构（递归组件）
- [x] 3.2 实现根节点加载（调用 GET /api/kg/textbooks）
- [x] 3.3 实现节点展开/收起交互和懒加载子节点
- [x] 3.4 实现不同节点类型图标区分（教材/学科/年级/单元/课时/知识点）
- [x] 3.5 实现知识点节点点击事件（触发图谱加载和详情展示）
- [x] 3.6 实现已展开节点的数据缓存 + 缓存失效策略（切换教材根节点时清空）
- [x] 3.7 添加树加载失败重试机制（错误提示 + 重试按钮）
- [x] 3.8 （可选）集成 react-window 虚拟滚动优化大量节点渲染（懒加载已优化，按需引入）

## 4. 关系图谱组件

- [x] 4.1 实现 `KnowledgeGraph.jsx` 基础结构（React Flow 容器）
- [x] 4.2 实现图谱数据加载（调用 GET /api/kg/knowledge-points/{uri}/graph）
- [x] 4.3 实现 React Flow 节点渲染（教材知识点 / 知识点两种自定义节点样式）
- [x] 4.4 实现节点点击选中事件（触发详情面板更新）
- [x] 4.5 实现加载状态和空数据提示（"暂无关联数据"引导文案）
- [x] 4.6 实现图谱缩放和拖拽交互
- [x] 4.7 使用 useNodesState / useEdgesState 优化图谱状态管理，减少重渲染
- [x] 4.8 实现图谱节点初始布局（后端返回坐标或使用 d3-force 计算）
- [x] 4.9 实现图谱节点 Tooltip（鼠标悬停显示完整名称和类型）
- [x] 4.10 实现节点过多降级方案（简化视图开关，仅显示 Top 10 关联节点）

## 5. 详情面板组件

- [x] 5.1 实现 `DetailPanel.jsx` 基础结构
- [x] 5.2 实现教材知识点详情展示（名称、学科、年级、单元、课时、URI）
- [x] 5.3 实现知识点详情展示（名称、学科、难度、认知层级、URI）
- [x] 5.4 实现未选中状态占位提示
- [x] 5.5 实现节点类型区分展示不同字段
- [x] 5.6 实现复制 URI 功能（一键复制到剪贴板）

## 6. 页面集成

- [x] 6.1 实现 `KnowledgeGraphPage.jsx` 三栏布局容器
- [x] 6.2 集成左侧树、中间图谱、右侧详情三个组件
- [x] 6.3 实现组件间状态联动（树选择 → 图谱加载 → 详情展示）
- [x] 6.4 添加整体页面样式和响应式布局
- [x] 6.5 添加全局错误边界捕获图谱渲染异常
- [x] 6.6 配置路由 `/admin/knowledge-graph` 和权限拦截
