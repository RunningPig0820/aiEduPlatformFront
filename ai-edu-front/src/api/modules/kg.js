import request from '../request'

/**
 * 知识图谱 API 模块
 * 封装教材导航、知识点详情、图谱关系、同步管理、系统统计等接口
 */
export const kgApi = {
  // ========== 教材导航 ==========

  // 获取学科列表（导航根节点）
  getSubjects: () =>
    request.get('/auth/kg/subjects'),

  // 获取学科下年级列表
  getGradesBySubject: (subject) =>
    request.get(`/auth/kg/subjects/${encodeURIComponent(subject)}/grades`),

  // 获取年级下教材列表
  getTextbooksByGrade: (grade) =>
    request.get(`/auth/kg/grades/${encodeURIComponent(grade)}/textbooks`),

  // 获取全部教材列表（用于同步下拉等场景）
  getTextbooks: () =>
    request.get('/auth/kg/textbooks'),

  // 获取教材下章节列表
  getChapters: (textbookUri) =>
    request.get(`/auth/kg/textbooks/${encodeURIComponent(textbookUri)}/chapters`),

  // 获取章节下小节列表
  getSections: (chapterUri) =>
    request.get(`/auth/kg/chapters/${encodeURIComponent(chapterUri)}/sections`),

  // 获取小节下知识点列表
  getPoints: (sectionUri) =>
    request.get(`/auth/kg/sections/${encodeURIComponent(sectionUri)}/points`),

  // ========== 知识点详情 ==========

  // 获取知识点详情
  getPointDetail: (uri) =>
    request.get(`/auth/kg/knowledge-points/${encodeURIComponent(uri)}`),

  // ========== 图谱关系 ==========

  // 获取知识点关联图谱数据
  getGraphData: (uri) =>
    request.get(`/auth/kg/knowledge-points/${encodeURIComponent(uri)}/graph`),

  // 批量获取知识点关联关系
  batchGetConceptRelations: (uris) =>
    request.post('/auth/kg/concepts/batch-relations', { uris }),

  // ========== 同步管理 ==========

  // 全量同步
  syncFull: (params = {}) =>
    request.post('/auth/kg/sync/full', params),

  // 获取同步状态
  getSyncStatus: () =>
    request.get('/auth/kg/sync/status'),

  // 获取同步记录列表
  getSyncRecords: () =>
    request.get('/auth/kg/sync/records'),

  // ========== 系统统计 ==========

  // 获取学科体系
  getGradeSystem: (grade) =>
    request.get(`/auth/kg/system/grade/${encodeURIComponent(grade)}`),

  // 获取年级统计
  getGradeStats: (grade) =>
    request.get(`/auth/kg/system/stats/${encodeURIComponent(grade)}`),

  // Neo4j 健康检查
  getNeo4jHealth: () =>
    request.get('/auth/kg/neo4j/health'),
}

export default kgApi
