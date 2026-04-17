import request from '../request'

/**
 * 知识图谱 API 模块
 * 封装教材导航、知识点详情、图谱关系等接口
 */
export const kgApi = {
  // ========== 教材导航 ==========

  // 获取教材列表
  getTextbooks: () =>
    request.get('/kg/textbooks'),

  // 获取教材下章节列表
  getChapters: (textbookUri) =>
    request.get(`/kg/textbooks/${encodeURIComponent(textbookUri)}/chapters`),

  // 获取章节下小节列表
  getSections: (chapterUri) =>
    request.get(`/kg/chapters/${encodeURIComponent(chapterUri)}/sections`),

  // 获取小节下知识点列表
  getPoints: (sectionUri) =>
    request.get(`/kg/sections/${encodeURIComponent(sectionUri)}/points`),

  // ========== 知识点详情 ==========

  // 获取知识点详情
  getPointDetail: (uri) =>
    request.get(`/kg/knowledge-points/${encodeURIComponent(uri)}`),

  // ========== 图谱关系 ==========

  // 获取知识点关联图谱数据
  getGraphData: (uri) =>
    request.get(`/kg/knowledge-points/${encodeURIComponent(uri)}/graph`),
}

export default kgApi
