## Test Strategy

本项目使用以下测试策略：

- **单元测试**: 使用 Vitest + Testing Library 测试 React 组件和工具函数
- **集成测试**: 测试 API 调用和组件间状态联动
- **E2E测试**: 使用 Playwright 测试关键用户流程（可选）

**测试工具**:
- Vitest (测试框架)
- @testing-library/react (组件测试)
- MSW (Mock Service Worker, 用于 API mock)

## Test Cases

### 1. 树形导航 Tests

#### TC-1.1: 页面加载时显示教材根节点
- **Priority**: High
- **Given**: 用户打开知识图谱页面
- **When**: 页面初始化完成
- **Then**: 左侧显示教材根节点列表，调用 GET /api/kg/textbooks
- **Ref**: specs/kg-textbook-nav/spec.md#用户应能通过树形导航浏览教材知识点层级

#### TC-1.2: 展开树节点时懒加载子节点
- **Priority**: High
- **Given**: 树形导航已渲染
- **When**: 用户点击展开某个树节点
- **Then**: 调用对应的子节点 API（章节/小节/知识点），显示加载状态，返回后展开子节点
- **Ref**: specs/kg-textbook-nav/spec.md#用户应能通过树形导航浏览教材知识点层级

#### TC-1.3: 知识点节点使用特殊标识
- **Priority**: Low
- **Given**: 树节点已渲染
- **When**: 节点类型为知识点
- **Then**: 节点前显示 ● 标识，区别于父级节点
- **Ref**: specs/kg-textbook-nav/spec.md#树节点应区分节点类型并展示不同图标

#### TC-1.4: 点击知识点节点触发关联事件
- **Priority**: High
- **Given**: 树中已显示知识点节点
- **When**: 用户点击知识点节点
- **Then**: 中间区域加载关系图谱，右侧面板显示节点详情
- **Ref**: specs/kg-textbook-nav/spec.md#点击知识点节点应触发关联事件

#### TC-1.5: 已展开节点缓存子节点数据
- **Priority**: Medium
- **Given**: 用户已展开过某个节点
- **When**: 用户收起后再次展开同一节点
- **Then**: 不重新请求 API，直接使用缓存数据
- **Ref**: specs/kg-textbook-nav/spec.md#用户应能通过树形导航浏览教材知识点层级

#### TC-1.6: 树节点加载失败显示重试
- **Priority**: High
- **Given**: 树节点展开时 API 请求失败
- **When**: 收到错误响应
- **Then**: 显示错误提示和「重试」按钮，点击后重新请求
- **Ref**: specs/kg-textbook-nav/spec.md#用户应能通过树形导航浏览教材知识点层级

#### TC-1.7: 切换教材根节点时清空缓存
- **Priority**: Medium
- **Given**: 用户已展开过教材 A 的子节点
- **When**: 用户切换到教材 B 根节点
- **Then**: 教材 A 的缓存数据被清空
- **Ref**: specs/kg-textbook-nav/spec.md#用户应能通过树形导航浏览教材知识点层级

### 2. 关系图谱 Tests

#### TC-2.1: 选中知识点后加载图谱
- **Priority**: High
- **Given**: 用户在树中选中知识点节点
- **When**: 图谱组件接收到选中事件
- **Then**: 显示加载动画，调用 GET /api/kg/knowledge-points/{uri}/graph
- **Ref**: specs/kg-graph-view/spec.md#用户应能通过关系图谱查看教材知识点与知识点的关联

#### TC-2.2: 图谱展示节点和关联连线
- **Priority**: High
- **Given**: 图谱数据已加载完成
- **When**: React Flow 渲染图谱
- **Then**: 图中展示「教材知识点」和「知识点」节点，以及有向连线
- **Ref**: specs/kg-graph-view/spec.md#用户应能通过关系图谱查看教材知识点与知识点的关联

#### TC-2.3: 图谱支持缩放和拖拽
- **Priority**: Low
- **Given**: 图谱已渲染
- **When**: 用户进行滚轮操作或拖拽操作
- **THEN**: 图谱支持鼠标滚轮缩放、拖拽平移、节点拖拽
- **Ref**: specs/kg-graph-view/spec.md#用户应能通过关系图谱查看教材知识点与知识点的关联

#### TC-2.4: 点击图谱节点选中并显示详情
- **Priority**: High
- **Given**: 图谱已渲染
- **When**: 用户点击图谱中的节点
- **Then**: 节点高亮显示，右侧详情面板展示该节点详情
- **Ref**: specs/kg-graph-view/spec.md#图谱节点应支持点击选中

#### TC-2.5: 图谱加载状态显示
- **Priority**: Medium
- **Given**: 用户选中知识点节点
- **When**: 图谱数据正在请求中
- **Then**: 中间区域显示加载动画
- **Ref**: specs/kg-graph-view/spec.md#图谱区域应显示加载状态

#### TC-2.6: 图谱空数据提示
- **Priority**: Medium
- **Given**: 知识点没有关联的图谱数据
- **When**: 图谱 API 返回空 nodes 和 edges
- **Then**: 显示「当前知识点暂无关联图谱数据」引导文案
- **Ref**: specs/kg-api/spec.md#系统应提供知识点关联图谱接口

#### TC-2.7: 图谱节点 Tooltip 显示
- **Priority**: Medium
- **Given**: 图谱已渲染
- **When**: 用户鼠标悬停在图谱节点上
- **Then**: 显示 Tooltip，包含节点完整名称和类型
- **Ref**: specs/kg-graph-view/spec.md#图谱节点应提供 Tooltip 悬停提示

#### TC-2.8: 图谱加载失败显示重试
- **Priority**: High
- **Given**: 用户选中知识点节点
- **When**: 图谱 API 请求失败
- **Then**: 中间区域显示错误提示和「重试」按钮
- **Ref**: specs/kg-graph-view/spec.md#用户应能通过关系图谱查看教材知识点与知识点的关联

### 3. 详情面板 Tests

#### TC-3.1: 显示教材知识点详情
- **Priority**: High
- **Given**: 用户选中教材知识点节点
- **When**: 详情面板接收到教材知识点数据
- **Then**: 展示名称、学科、年级、单元、课时、URI 等信息
- **Ref**: specs/kg-detail-panel/spec.md#用户应能在右侧面板查看选中节点的详情信息

#### TC-3.2: 显示知识点详情
- **Priority**: High
- **Given**: 用户选中知识点节点
- **When**: 详情面板接收到知识点数据
- **Then**: 展示名称、学科、难度、认知层级、URI 等信息
- **Ref**: specs/kg-detail-panel/spec.md#用户应能在右侧面板查看选中节点的详情信息

#### TC-3.3: 未选中状态占位提示
- **Priority**: Medium
- **Given**: 用户尚未选择任何节点
- **When**: 详情面板初始化
- **Then**: 显示「请选择一个节点查看详情」占位提示
- **Ref**: specs/kg-detail-panel/spec.md#用户应能在右侧面板查看选中节点的详情信息

#### TC-3.4: 详情面板区分节点类型
- **Priority**: High
- **Given**: 详情面板已渲染
- **When**: 选中不同类型的节点
- **Then**: 面板标题和展示字段根据节点类型动态变化
- **Ref**: specs/kg-detail-panel/spec.md#详情面板应区分节点类型

#### TC-3.5: 复制 URI 功能
- **Priority**: Medium
- **Given**: 用户已选中节点，详情面板显示 URI
- **When**: 用户点击复制 URI 按钮
- **Then**: URI 复制到剪贴板，显示「已复制」提示
- **Ref**: specs/kg-detail-panel/spec.md#详情面板应支持复制 URI 操作

### 5. E2E 关键路径 Tests

#### TC-5.1: 完整用户流程（展开树 → 点击知识点 → 图谱加载 → 详情显示）
- **Priority**: High
- **Given**: 用户打开知识图谱管理页面
- **When**: 依次操作：展开教材 → 展开学科 → 展开年级 → 展开单元 → 展开课时 → 点击知识点
- **Then**: 图谱区域渲染关系图，详情面板显示该知识点详情
- **Ref**: 全流程集成测试

### 4. KG API Tests

#### TC-4.1: 获取教材列表
- **Priority**: High
- **Given**: 后端服务可用
- **When**: 调用 GET /api/kg/textbooks
- **Then**: 返回教材列表，每个教材包含 URI、名称、学科
- **Ref**: specs/kg-api/spec.md#系统应提供教材列表获取接口

#### TC-4.2: 获取章节列表
- **Priority**: High
- **Given**: 教材节点已选中
- **When**: 调用 GET /api/kg/textbooks/{uri}/chapters
- **Then**: 返回章节列表
- **Ref**: specs/kg-api/spec.md#系统应提供章节导航接口

#### TC-4.3: 获取知识点详情
- **Priority**: High
- **Given**: 知识点节点已选中
- **When**: 调用 GET /api/kg/knowledge-points/{uri}
- **Then**: 返回知识点详情（名称、学科、难度、认知层级、URI）
- **Ref**: specs/kg-api/spec.md#系统应提供知识点详情接口

#### TC-4.4: 获取图谱数据
- **Priority**: High
- **Given**: 知识点节点已选中
- **When**: 调用 GET /api/kg/knowledge-points/{uri}/graph
- **Then**: 返回 nodes 和 edges 数据
- **Ref**: specs/kg-api/spec.md#系统应提供知识点关联图谱接口

#### TC-4.5: API 请求携带认证信息
- **Priority**: High
- **Given**: 用户已登录
- **When**: 调用任何 KG API
- **Then**: 请求配置包含 credentials: 'include'
- **Ref**: specs/kg-api/spec.md (所有接口要求)

## Test Environment

**前置条件**:
- Node.js 18+ 环境
- 安装依赖: `npm install`
- 安装测试依赖: vitest, @testing-library/react, msw

**Mock设置**:
- 使用 MSW 模拟后端 API 响应
- 模拟教材树层级数据
- 模拟图谱关系数据（nodes/edges）

**测试数据**:
- 模拟用户登录状态
- 模拟教材 → 章节 → 小节 → 知识点层级数据
- 模拟图谱关联数据

## Coverage Goals

| 指标 | 目标 |
|------|------|
| 代码覆盖率 | ≥ 80% |
| 需求覆盖率 | 100% (每个requirement至少1个测试用例) |
| 分支覆盖率 | ≥ 70% |

**关键路径必须覆盖**:
- 树形导航懒加载流程
- 树选择 → 图谱加载 → 详情展示的联动流程
- 图谱节点点击交互
- API 请求和错误处理
