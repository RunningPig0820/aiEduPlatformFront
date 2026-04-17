# 知识图谱 API 契约

> 本文档定义前端知识图谱页面所需的 API 接口响应格式，供前后端对齐。

## 1. 图谱关系数据接口

### `GET /api/kg/knowledge-points/{uri}/graph`

获取指定知识点的关联图谱数据。

**响应格式：**

```json
{
  "code": "00000",
  "data": {
    "nodes": [
      {
        "id": "kg:point:xxx",
        "type": "textbook_kp",
        "label": "教材知识点名称",
        "data": {
          "uri": "kg:point:xxx",
          "name": "教材知识点名称",
          "subject": "数学",
          "grade": "七年级",
          "unit": "第一单元",
          "lesson": "第一课时"
        }
      },
      {
        "id": "kg:point:yyy",
        "type": "kp",
        "label": "知识点名称",
        "data": {
          "uri": "kg:point:yyy",
          "name": "知识点名称",
          "subject": "数学",
          "difficulty": 2,
          "cognitiveLevel": "理解"
        }
      }
    ],
    "edges": [
      {
        "id": "edge-1",
        "source": "kg:point:xxx",
        "target": "kg:point:yyy",
        "label": "关联"
      }
    ]
  }
}
```

**字段说明：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `nodes[].id` | string | 节点唯一标识，使用 URI |
| `nodes[].type` | string | 节点类型：`textbook_kp`（教材知识点）或 `kp`（知识点） |
| `nodes[].label` | string | 节点显示名称 |
| `nodes[].data` | object | 节点详细数据，用于详情面板展示 |
| `edges[].id` | string | 边唯一标识 |
| `edges[].source` | string | 源节点 URI |
| `edges[].target` | string | 目标节点 URI |
| `edges[].label` | string | 关系类型：关联/前置/包含等 |

**约束：**
- 节点数上限：50 个（后端截断）
- 若知识点无关联数据，返回 `nodes: []` 和 `edges: []`

---

## 2. 教材导航接口

### `GET /api/kg/textbooks`

获取教材列表。

```json
{
  "code": "00000",
  "data": [
    {
      "uri": "kg:textbook:1",
      "name": "人教版",
      "subject": "数学"
    }
  ]
}
```

### `GET /api/kg/textbooks/{uri}/chapters`

获取教材下章节列表。

### `GET /api/kg/chapters/{uri}/sections`

获取章节下小节列表。

### `GET /api/kg/sections/{uri}/points`

获取小节下知识点列表。

### `GET /api/kg/knowledge-points/{uri}`

获取知识点详情。

---

## 3. 通用响应格式

所有接口统一响应格式：

```json
{
  "code": "00000",    // "00000" 成功，其他失败
  "data": {},         // 业务数据
  "message": ""       // 错误信息（可选）
}
```
