## ADDED Requirements

### Requirement: 系统应提供教材列表获取接口

前端应能调用 `GET /api/kg/textbooks` 获取教材列表，用于初始化树形导航的根节点。

#### Scenario: 获取教材列表成功
- **WHEN** 页面加载时调用教材列表 API
- **THEN** 返回教材列表，每个教材包含 URI、名称、学科等基本信息

### Requirement: 系统应提供章节导航接口

前端应能调用 `GET /api/kg/textbooks/{uri}/chapters` 获取指定教材下的章节列表。

#### Scenario: 展开教材节点时加载章节
- **WHEN** 用户点击展开某个教材节点
- **THEN** 调用章节 API，传入该教材的 URI，返回章节列表

### Requirement: 系统应提供小节导航接口

前端应能调用 `GET /api/kg/chapters/{uri}/sections` 获取指定章节下的小节列表。

#### Scenario: 展开章节节点时加载小节
- **WHEN** 用户点击展开某个章节节点
- **THEN** 调用小节 API，传入该章节的 URI，返回小节列表

### Requirement: 系统应提供知识点列表接口

前端应能调用 `GET /api/kg/sections/{uri}/points` 获取指定小节下的知识点列表。

#### Scenario: 展开小节节点时加载知识点
- **WHEN** 用户点击展开某个小节节点
- **THEN** 调用知识点列表 API，传入该小节的 URI，返回知识点列表

### Requirement: 系统应提供知识点详情接口

前端应能调用 `GET /api/kg/knowledge-points/{uri}` 获取知识点详情信息。

#### Scenario: 获取知识点详情成功
- **WHEN** 用户点击知识点节点查看详情
- **THEN** 调用知识点详情 API，返回名称、学科、难度、认知层级、URI 等信息

### Requirement: 系统应提供知识点关联图谱接口

前端应能调用 `GET /api/kg/knowledge-points/{uri}/graph` 获取知识点的关联图谱数据。

#### Scenario: 获取图谱数据成功
- **WHEN** 用户选中知识点节点后加载图谱
- **THEN** 调用图谱 API，返回 nodes（节点列表）和 edges（边列表）数据，用于 React Flow 渲染
- **AND** 响应格式为：
```json
{
  "nodes": [
    { "id": "uri", "type": "textbook_kp|kp", "label": "知识点名称", "data": { ... } }
  ],
  "edges": [
    { "source": "uri1", "target": "uri2", "label": "包含/前置/相关" }
  ]
}
```

#### Scenario: 图谱数据为空
- **WHEN** 知识点没有关联的图谱数据
- **THEN** 返回空 nodes 和 edges 数组，前端显示「暂无关联数据」提示

#### Scenario: 图谱数据节点数超限
- **WHEN** 关联节点数超过 50 个
- **THEN** 后端仅返回 Top 50 节点，前端提供简化视图开关进一步限制到 Top 10
