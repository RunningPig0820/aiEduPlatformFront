#### 节点类型说明

| 类型 | 标签 | 含义 | 数量 | 核心属性 |
|------|------|------|------|----------|
| 教材 | Textbook | 人教版教材册次 | 23 | `label`(名称), `grade`(年级), `phase`(学段: primary/middle/high) |
| 章节 | Chapter | 教材中的章节 | 148 | `label`, `topic`(专题), `textbook_id` |
| 小节 | Section | 教材中的小节 | 580 | `label`, `chapter_id` |
| 教材知识点 | TextbookKP | 教材关联的知识点 | 1,740 | `label`, `section_id`, `textbook_id`, `difficulty`, `importance`, `cognitive_level` |
| EduKG概念 | Concept | 图谱知识点实体 | 1,295 | `label`, `uri`, `subject`(学科) |
| 概念类 | Class | 知识点分类 | 39 | `label`(如:数学定义、数学定理等) |
| 定义/定理 | Statement | 概念的具体描述 | 2,932 | `label`, `content`(完整内容) |

#### 关系说明

| 关系 | 方向 | 含义 | 数量 | 说明 |
|------|------|------|------|------|
| CONTAINS | Textbook → Chapter | 教材包含章节 | 728 | 结构关系 |
| CONTAINS | Chapter → Section | 章节包含小节 | | 结构关系 |
| IN_UNIT | TextbookKP → Section | 知识点归属小节 | 1,740 | 每个知识点归属一个Section |
| MATCHES_KG | TextbookKP → Concept | 教材知识点匹配EduKG概念 | 1,690 | 通过向量检索+LLM匹配，置信度≥0.5 |
| HAS_TYPE | Concept/Statement → Class | 概念/定义属于某个类型 | 5,591 | 分类关系 |
| RELATED_TO | Statement → Concept | 定义/定理关联到概念 | 10,183 | 内容关联 |
| BELONGS_TO | Class → Class | 类的归属 | 619 | 分类层级 |
| PART_OF | Concept → Concept | 概念的部分关系 | 298 | 组合关系 |
| SUB_CLASS_OF | Class → Class | 类的子类关系 | 38 | 继承关系 |