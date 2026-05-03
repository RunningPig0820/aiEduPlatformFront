import request from '../request'

/**
 * 知识图谱 API 模块
 * 封装教材导航、知识点详情、图谱关系、同步管理、系统统计等接口
 *
 * 导航树结构（5级）：
 * 教材版本 → 学科 → 年级(带textbookUri) → 章节(含小节) → 知识点
 *
 * 后端改动（2026-04-20）：
 * - 所有导航接口改为 POST，统一使用 UriRequest { uri }
 * - 维度接口 GET: /dimensions/textbooks, /dimensions/subjects, /dimensions/stages
 * - 年级接口 POST: /dimensions/grades { edition, subject }
 * - 章节接口 POST: /textbooks/chapters { uri } → ChapterTreeNode[]（含 sections）
 * - 知识点接口 POST: /sections/points { uri }
 * - 知识点详情 POST: /knowledge-points/detail { uri }
 * - 图谱接口 POST: /knowledge-points/graph { uri }
 * - 统计接口 POST: /system/stats { grade }, /system/grade { grade, groupBy }
 */
export const kgApi = {
  // ========== 维度接口（GET） ==========

  // 获取教材版本维度列表（导航第1级）
  getDimensionTextbooks: () =>
    request.get('/auth/kg/dimensions/textbooks'),

  // 获取学科维度列表（导航第2级）
  getDimensionSubjects: () =>
    request.get('/auth/kg/dimensions/subjects'),

  // 获取学段维度列表（筛选用）
  getDimensionStages: () =>
    request.get('/auth/kg/dimensions/stages'),

  // 获取年级列表（导航第3级，POST）
  // 请求: { edition: string, subject: string }
  // 响应: GradeTextbookDTO[] { grade, textbookUri }
  getDimensionGrades: (params = {}) =>
    request.post('/auth/kg/dimensions/grades', params),

  // ========== 教材导航（POST） ==========

  // 获取教材下章节列表（导航第4级）
  // 请求: { textbookUri: string }
  // 响应: ChapterTreeNode[] { uri, label, orderIndex }
  getChapters: (textbookUri) =>
    request.post('/auth/kg/textbooks/chapters', { textbookUri }),

  // 获取章节下小节列表（导航第5级）
  // 请求: { chapterUri: string }
  // 响应: SectionNode[] { uri, label, orderIndex, knowledgePointCount }
  getSections: (chapterUri) =>
    request.post('/auth/kg/chapters/sections', { chapterUri }),

  // 获取小节下知识点列表（导航第6级）
  // 请求: { sectionUri: string }
  // 响应: KgKnowledgePointDetailDTO[]
  getPoints: (sectionUri) =>
    request.post('/auth/kg/sections/points', { sectionUri }),

  // ========== 知识点详情（POST） ==========

  // 获取知识点详情
  // 请求: { kpUri: string }
  // 响应: KgKnowledgePointDetailDTO
  getPointDetail: (kpUri) =>
    request.post('/auth/kg/knowledge-points/detail', { kpUri }),

  // ========== 图谱关系（POST） ==========

  // 获取知识点关联图谱数据
  // 请求: { kpUri: string }
  // 响应: KgGraphDTO { nodes[], edges[], hasMore }
  getGraphData: (kpUri) =>
    request.post('/auth/kg/knowledge-points/graph', { kpUri }),

  // 展开图谱节点的结构关系（IN_UNIT, CONTAINS）
  // 请求: { nodeUri: string, limit?: number }
  // 响应: KgGraphDTO { nodes[], edges[], hasMore }
  expandStructure: (nodeUri, limit = 20) =>
    request.post('/auth/kg/graph/expand/structure', { nodeUri, limit }),

  // 展开图谱节点的知识关系（MATCHES_KG, RELATED_TO, BELONGS_TO 等）
  // 请求: { nodeUri: string, limit?: number }
  // 响应: KgGraphDTO { nodes[], edges[], hasMore }
  expandKnowledge: (nodeUri, limit = 20) =>
    request.post('/auth/kg/graph/expand/knowledge', { nodeUri, limit }),

  // 批量获取知识点关联关系
  batchGetConceptRelations: (uris) =>
    request.post('/auth/kg/concepts/batch-relations', { uris }),

  // ========== 同步管理 ==========

  // 全量同步（支持按年级拆分）
  syncFull: (params = {}) =>
    request.post('/auth/kg/sync/full', params),

  // 教材同步（仅同步教材基础信息）
  syncTextbooks: (params = {}) =>
    request.post('/auth/kg/sync/textbooks', params),

  // 获取同步状态
  getSyncStatus: () =>
    request.get('/auth/kg/sync/status'),

  // 获取同步记录列表（POST 请求，支持筛选）
  // 请求: { edition, subject, stage, grade, page, size }
  getSyncRecords: (params = {}) =>
    request.post('/auth/kg/sync/records', params),

  // ========== 系统统计（POST） ==========

  // 获取学科体系
  // 请求: { grade: string, groupBy: string }
  // 响应: KgGradeSystemDTO
  getGradeSystem: (params = {}) =>
    request.post('/auth/kg/system/grade', params),

  // 获取年级统计
  // 请求: { grade: string }
  // 响应: StatsDTO
  getGradeStats: (params = {}) =>
    request.post('/auth/kg/system/stats', params),

  // Neo4j 健康检查（GET）
  getNeo4jHealth: () =>
    request.get('/auth/kg/neo4j/health'),
}

export default kgApi