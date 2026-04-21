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

## 7. 知识图谱同步管理

- [x] 7.1 创建同步 API 封装（`syncFull`、`getSyncStatus`、`getSyncRecords`）
- [x] 7.2 实现同步状态页面入口（页面头部「同步」按钮）
- [x] 7.3 实现同步状态展示面板（当前同步状态、最近同步时间、数量统计）
- [x] 7.4 实现手动触发全量同步（教材/学科/年级下拉筛选）
- [x] 7.5 实现同步记录列表（表格展示历史同步任务及状态）
- [ ] 7.6 实现同步进行中状态提示（loading 动画 + 刷新按钮）
- [ ] 7.7 实现同步失败错误详情展示

## 8. 系统概览与统计

- [x] 8.1 创建系统统计 API 封装（`getGradeStats`、`getGradeSystem`、`getNeo4jHealth`）
- [ ] 8.2 实现学科体系查看页面（按年级展示知识点分组结构）
- [x] 8.3 实现统计面板（教材数、章节数、小节数、知识点总数、难度分布）
- [x] 8.4 实现 Neo4j 健康状态检查（连接状态、响应时间）
- [x] 8.5 集成统计面板到知识图谱页面（顶部概览栏）

## 9. 后端接口对齐（联调修复）

- [ ] 9.1 修复：前端 `getGraphData` 接口后端未实现（`/knowledge-points/{uri}/graph`），需与后端确认图谱数据获取方式
- [x] 9.2 修复：树节点字段从 `name` 改为 `label`（后端 `KgTextbookDTO`、`ChapterTreeNode`、`SectionNode` 均使用 `label`）
- [x] 9.3 修复：知识点详情字段对齐 `KgKnowledgePointDetailDTO`（`difficulty`/`importance` 为字符串枚举，非数字）
- [x] 9.4 新增：`batchGetConceptRelations` 批量关联接口前端封装和图谱使用集成

## 10. 导航树层级优化

- [x] 10.1 导航层级从「教材 → 章节 → 小节」调整为「学科 → 年级 → 教材 → 章节 → 小节 → 知识点」
- [x] 10.2 创建新 API：`getSubjects`（学科列表）、`getGradesBySubject`、`getTextbooksByGrade`
- [x] 10.3 树节点增加类型标签展示（学科/年级/教材/章节/小节/知识点）
- [x] 10.4 节点图标按类型区分（学科、年级、教材各有专属图标）
- [x] 10.5 同步对话框改为下拉选择（教材下拉放第一位置、学科下拉、年级下拉）
- [ ] 10.6 联调后端新增接口：`GET /subjects`、`GET /subjects/{subject}/grades`、`GET /grades/{grade}/textbooks`

## 11. 后端接口需求整理

- [x] 11.1 整理后端缺失接口文档 `docs/kg-backend-requirements.md`（含接口路径、请求/响应格式、优先级）
- [x] 11.2 提交后端需求文档与后端团队沟通

## 12. 后端接口改动适配（2026-04-20）

> 语雀文档：https://www.yuque.com/zhangmin-jrrer/iu9s4m/uv3ryznzxzt8fuys
> Swagger 端口：http://localhost:9627/v3/api-docs

### 12.1 维度接口适配（新增 `/dimensions/*` 接口）

- [x] 12.1.1 更新 `kg.js` API 模块，新增维度接口：
  - `getDimensionGrades()` → `GET /api/auth/kg/dimensions/grades`
  - `getDimensionStages()` → `GET /api/auth/kg/dimensions/stages`
  - `getDimensionSubjects()` → `GET /api/auth/kg/dimensions/subjects`
  - `getDimensionTextbooks()` → `GET /api/auth/kg/dimensions/textbooks`
- [x] 12.1.2 更新 `SyncManager.jsx` 同步对话框下拉选项数据源，从维度接口获取（`KgDimensionDTO` 返回 code/label/orderIndex）
- [x] 12.1.3 同步对话框支持维度筛选联动（选择学科 → 过滤年级列表）

### 12.2 同步历史记录接口改动（GET → POST）

- [x] 12.2.1 更新 `kg.js` API 模块，`getSyncRecords` 改为 POST 请求：
  - 请求体：`SyncRecordQueryRequest` { edition, subject, stage, grade, page, size }
  - 响应：`SyncRecordDTO[]`（新增 edition/subject/stage/grade 字段）
- [x] 12.2.2 更新 `SyncManager.jsx` 同步记录列表，展示维度信息（edition/subject/stage/grade）
- [x] 12.2.3 实现同步记录筛选功能（按教材版本/学科/年级筛选）

### 12.3 教材同步接口（新增 `syncTextbooks`）

- [x] 12.3.1 更新 `kg.js` API 模块，新增教材同步接口：
  - `syncTextbooks(params)` → `POST /api/auth/kg/sync/textbooks`
  - 请求体：`SyncRequest` { edition, subject }
- [x] 12.3.2 同步对话框新增「教材同步」选项（仅同步教材基础信息，不同步知识点）

### 12.4 同步结果展示优化（新增年级统计）

- [x] 12.4.1 更新 `SyncManager.jsx` 同步结果展示，显示年级统计：
  - `completedGrades`：成功同步的年级数
  - `failedGrades`：失败的年级数
  - `totalGrades`：总年级数
- [x] 12.4.2 同步状态栏显示分年级进度条（每个年级独立状态）

### 12.5 教材列表接口参数更新

- [x] 12.5.1 更新 `getTextbooks` API，支持查询参数：`subject` 和 `stage`
- [x] 12.5.2 教材树筛选功能（按学科/学段筛选教材列表）

### 12.6 E2E 测试更新

- [x] 12.6.1 更新 `tests/kg-page.spec.mjs`，覆盖新维度接口和筛选功能
- [x] 12.6.2 测试同步记录筛选和维度信息展示

### 12.7 导航树结构重构（6级）

- [x] 12.7.1 导航结构改为：教材版本 → 学科 → 年级 → 章节 → 小节 → 知识点
- [x] 12.7.2 更新 `kg.js` API：根节点用 `/dimensions/textbooks`（教材版本）
- [x] 12.7.3 学科展开用 `/dimensions/subjects`（GET）
- [x] 12.7.4 年级展开用 `/dimensions/grades` POST，参数 `{ edition, subject }`，返回 `GradeTextbookDTO`
- [x] 12.7.5 重写 `TextbookTree.jsx` 适配6级导航结构
- [x] 12.7.6 更新 `SyncManager.jsx` 年级联动筛选逻辑（需先选教材版本和学科）

### 12.8 导航接口改为 POST（2026-04-21）

- [x] 12.8.1 `/textbooks/chapters` POST `{ uri }` 替代 `/textbooks/{uri}/chapters` GET
- [x] 12.8.2 `/sections/points` POST `{ uri }` 替代 `/sections/{uri}/points` GET
- [x] 12.8.3 `/knowledge-points/detail` POST `{ uri }` 替代 `/knowledge-points/{uri}` GET
- [x] 12.8.4 `/knowledge-points/graph` POST `{ uri }` 替代 `/knowledge-points/{uri}/graph` GET
- [x] 12.8.5 `/system/stats` POST `{ grade }` 替代 `/system/stats/{grade}` GET
- [x] 12.8.6 `/system/grade` POST `{ grade, groupBy }` 替代 `/system/grade/{grade}` GET
- [x] 12.8.7 `ChapterTreeNode` 包含 `sections[]`，章节展开直接显示知识点（合并小节层级）
- [x] 12.8.8 更新 `TextbookTree.jsx` 适配 POST 接口和合并的章节小节结构
