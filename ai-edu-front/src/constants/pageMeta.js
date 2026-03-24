/**
 * 页面元信息定义
 * 为 AI 助手提供页面上下文
 */

// 页面元信息结构
// {
//   code: string,        // 页面唯一标识
//   name: string,        // 页面名称
//   description: string, // 页面描述
//   features: string[],  // 页面功能列表
//   aiPrompts: string[], // AI 可提供的帮助
//   status: 'active' | 'pending' // 页面状态
// }

export const PAGE_META = {
  // ============ 学生端 ============
  STUDENT_HOME: {
    code: 'STUDENT_HOME',
    name: '学生首页',
    description: '学生登录后的首页，展示学习概览、待办作业、错题提醒',
    features: [
      '查看学习统计数据',
      '查看待完成作业列表',
      '查看智能错题本'
    ],
    aiPrompts: [
      '解释学习报告中的数据含义',
      '推荐错题巩固策略',
      '作业截止日期提醒'
    ],
    status: 'active'
  },
  STUDENT_HOMEWORK: {
    code: 'STUDENT_HOMEWORK',
    name: '我的作业',
    description: '查看和完成老师布置的作业',
    features: [
      '查看作业列表',
      '在线完成作业',
      '查看作业成绩'
    ],
    aiPrompts: [
      '作业题目解答提示',
      '作业难点分析'
    ],
    status: 'pending'
  },
  STUDENT_ERRORS: {
    code: 'STUDENT_ERRORS',
    name: '错题本',
    description: '智能错题本，记录和管理错题',
    features: [
      '错题自动收录',
      '按知识点分类',
      '错题巩固练习'
    ],
    aiPrompts: [
      '分析错题原因',
      '推荐相似题目练习',
      '知识点讲解'
    ],
    status: 'pending'
  },
  STUDENT_REPORT: {
    code: 'STUDENT_REPORT',
    name: '学习报告',
    description: '个人学习数据分析和报告',
    features: [
      '学习进度追踪',
      '知识点掌握分析',
      '学习趋势图表'
    ],
    aiPrompts: [
      '解读学习报告数据',
      '学习建议生成'
    ],
    status: 'pending'
  },
  STUDENT_PRACTICE: {
    code: 'STUDENT_PRACTICE',
    name: '智能练习',
    description: 'AI 推荐的个性化练习',
    features: [
      '智能题目推荐',
      '薄弱知识点强化',
      '练习记录追踪'
    ],
    aiPrompts: [
      '练习题目解析',
      '知识点补充讲解'
    ],
    status: 'pending'
  },
  STUDENT_PAPERS: {
    code: 'STUDENT_PAPERS',
    name: '试卷中心',
    description: '历年真题和模拟试卷',
    features: [
      '历年真题下载',
      '模拟试卷练习',
      '试卷答案解析'
    ],
    aiPrompts: [
      '试卷难度分析',
      '解题思路指导'
    ],
    status: 'pending'
  },
  STUDENT_AI_QA: {
    code: 'STUDENT_AI_QA',
    name: 'AI答疑',
    description: '智能问答助手，解答学习问题',
    features: [
      '题目拍照提问',
      '语音问答',
      '步骤详解'
    ],
    aiPrompts: [
      '详细解答问题',
      '相关知识拓展'
    ],
    status: 'pending'
  },
  STUDENT_LIVE: {
    code: 'STUDENT_LIVE',
    name: '直播课',
    description: '在线直播课程学习',
    features: [
      '直播课程观看',
      '实时互动提问',
      '课程回放'
    ],
    aiPrompts: [
      '课程内容总结',
      '重点知识标注'
    ],
    status: 'pending'
  },
  STUDENT_VIDEO: {
    code: 'STUDENT_VIDEO',
    name: '录播课',
    description: '录播课程视频学习',
    features: [
      '录播视频观看',
      '学习进度记录',
      '倍速播放'
    ],
    aiPrompts: [
      '课程内容答疑',
      '知识点检索'
    ],
    status: 'pending'
  },

  // ============ 老师端 ============
  TEACHER_HOME: {
    code: 'TEACHER_HOME',
    name: '老师首页',
    description: '老师登录后的首页，展示班级概览、待批改作业、学情数据',
    features: [
      '查看班级统计数据',
      '查看待批改作业',
      '班级学情概览'
    ],
    aiPrompts: [
      '班级学情分析',
      '教学建议生成'
    ],
    status: 'active'
  },
  TEACHER_CLASSES: {
    code: 'TEACHER_CLASSES',
    name: '班级管理',
    description: '管理所教班级和学生',
    features: [
      '班级信息管理',
      '学生名单管理',
      '班级成绩统计'
    ],
    aiPrompts: [
      '学生成绩分析',
      '班级管理建议'
    ],
    status: 'pending'
  },
  TEACHER_HOMEWORK: {
    code: 'TEACHER_HOMEWORK',
    name: '作业管理',
    description: '布置和管理学生作业',
    features: [
      '发布作业',
      '作业截止设置',
      '作业完成情况统计'
    ],
    aiPrompts: [
      '作业难度建议',
      '作业完成率分析'
    ],
    status: 'pending'
  },
  TEACHER_AI_PREPARE: {
    code: 'TEACHER_AI_PREPARE',
    name: 'AI备课',
    description: 'AI 辅助备课工具',
    features: [
      '智能教案生成',
      '课件推荐',
      '教学资源整理'
    ],
    aiPrompts: [
      '教案内容建议',
      '教学设计优化'
    ],
    status: 'pending'
  },
  TEACHER_AI_PAPER: {
    code: 'TEACHER_AI_PAPER',
    name: 'AI组卷',
    description: 'AI 辅助生成试卷',
    features: [
      '智能题目筛选',
      '试卷难度设置',
      '试卷导出'
    ],
    aiPrompts: [
      '题目难度评估',
      '知识点覆盖分析'
    ],
    status: 'pending'
  },
  TEACHER_AI_GRADE: {
    code: 'TEACHER_AI_GRADE',
    name: 'AI批改',
    description: 'AI 辅助批改作业',
    features: [
      '自动批改选择题',
      '主观题智能评分',
      '批改结果统计'
    ],
    aiPrompts: [
      '批改规则说明',
      '常见错误分析'
    ],
    status: 'pending'
  },
  TEACHER_ANALYSIS: {
    code: 'TEACHER_ANALYSIS',
    name: '学情分析',
    description: '学生学习情况分析报告',
    features: [
      '学生成绩趋势',
      '知识点掌握分析',
      '预警学生提醒'
    ],
    aiPrompts: [
      '学情数据解读',
      '干预建议生成'
    ],
    status: 'pending'
  },
  TEACHER_LIVE: {
    code: 'TEACHER_LIVE',
    name: '直播课',
    description: '在线直播授课',
    features: [
      '发起直播课程',
      '屏幕共享',
      '学生互动管理'
    ],
    aiPrompts: [
      '直播技巧建议',
      '互动活动推荐'
    ],
    status: 'pending'
  },
  TEACHER_VIDEO: {
    code: 'TEACHER_VIDEO',
    name: '录播课',
    description: '录播课程管理',
    features: [
      '上传录播视频',
      '课程信息编辑',
      '观看数据统计'
    ],
    aiPrompts: [
      '课程内容优化建议'
    ],
    status: 'pending'
  },

  // ============ 家长端 ============
  PARENT_HOME: {
    code: 'PARENT_HOME',
    name: '家长首页',
    description: '家长登录后的首页，展示孩子学习概览、接送提醒',
    features: [
      '查看孩子学习数据',
      '接送提醒',
      '老师通知'
    ],
    aiPrompts: [
      '孩子学习情况解读',
      '家庭教育建议'
    ],
    status: 'active'
  },
  PARENT_CHILDREN: {
    code: 'PARENT_CHILDREN',
    name: '孩子管理',
    description: '管理关联的孩子信息',
    features: [
      '添加孩子',
      '切换查看不同孩子',
      '孩子基本信息'
    ],
    aiPrompts: [
      '孩子学习对比分析'
    ],
    status: 'pending'
  },
  PARENT_PROFILE: {
    code: 'PARENT_PROFILE',
    name: '学生画像',
    description: '孩子详细的学习画像',
    features: [
      '学习性格分析',
      '优势科目',
      '待提升方向'
    ],
    aiPrompts: [
      '画像解读',
      '教育策略建议'
    ],
    status: 'pending'
  },
  PARENT_PICKUP: {
    code: 'PARENT_PICKUP',
    name: '学生接送',
    description: '学生接送管理和提醒',
    features: [
      '接送日程',
      '接送签到',
      '接送记录'
    ],
    aiPrompts: [
      '接送安排建议'
    ],
    status: 'pending'
  },
  PARENT_REPORT: {
    code: 'PARENT_REPORT',
    name: '学习报告',
    description: '孩子的学习报告',
    features: [
      '学习成绩报告',
      '学习行为报告',
      '老师评语'
    ],
    aiPrompts: [
      '报告数据解读',
      '辅导建议'
    ],
    status: 'pending'
  },
  PARENT_MESSAGES: {
    code: 'PARENT_MESSAGES',
    name: '家校沟通',
    description: '与老师的沟通渠道',
    features: [
      '发送消息给老师',
      '查看老师回复',
      '消息历史'
    ],
    aiPrompts: [
      '沟通话术建议'
    ],
    status: 'pending'
  },

  // ============ 管理员端 ============
  ADMIN_HOME: {
    code: 'ADMIN_HOME',
    name: '管理员首页',
    description: '平台管理员首页，展示平台运营数据概览',
    features: [
      '平台用户统计',
      '今日活跃数据',
      '系统公告'
    ],
    aiPrompts: [
      '运营数据分析',
      '平台优化建议'
    ],
    status: 'active'
  },
  ADMIN_ORGANIZATIONS: {
    code: 'ADMIN_ORGANIZATIONS',
    name: '组织管理',
    description: '管理平台上的学校和组织',
    features: [
      '创建组织',
      '组织信息编辑',
      '组织状态管理'
    ],
    aiPrompts: [
      '组织架构建议'
    ],
    status: 'active'
  },
  ADMIN_USERS: {
    code: 'ADMIN_USERS',
    name: '用户管理',
    description: '管理平台用户',
    features: [
      '用户列表',
      '用户信息编辑',
      '用户状态管理'
    ],
    aiPrompts: [
      '用户行为分析'
    ],
    status: 'active'
  },
  ADMIN_PERMISSIONS: {
    code: 'ADMIN_PERMISSIONS',
    name: '权限管理',
    description: '管理角色和权限配置',
    features: [
      '角色管理',
      '权限分配',
      '权限日志'
    ],
    aiPrompts: [
      '权限配置建议'
    ],
    status: 'active'
  },
  ADMIN_ORDERS: {
    code: 'ADMIN_ORDERS',
    name: '订单管理',
    description: '平台订单和支付管理',
    features: [
      '订单列表',
      '退款处理',
      '财务报表'
    ],
    aiPrompts: [
      '订单数据分析'
    ],
    status: 'pending'
  },
  ADMIN_DASHBOARD: {
    code: 'ADMIN_DASHBOARD',
    name: '数据看板',
    description: '平台运营数据看板',
    features: [
      '用户增长趋势',
      '收入统计',
      '活跃度分析'
    ],
    aiPrompts: [
      '数据趋势解读'
    ],
    status: 'pending'
  }
}

/**
 * 根据页面代码获取元信息
 * @param {string} code 页面代码
 * @returns {object|null} 页面元信息
 */
export function getPageMeta(code) {
  return PAGE_META[code] || null
}

/**
 * 获取所有活跃状态的页面
 * @returns {object[]} 活跃页面列表
 */
export function getActivePages() {
  return Object.values(PAGE_META).filter(page => page.status === 'active')
}

/**
 * 获取所有待开发状态的页面
 * @returns {object[]} 待开发页面列表
 */
export function getPendingPages() {
  return Object.values(PAGE_META).filter(page => page.status === 'pending')
}

export default PAGE_META