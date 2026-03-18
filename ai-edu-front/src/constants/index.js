// 路由路径常量
export const ROUTES = {
  // 公开页面
  HOME: '/',
  LOGIN: '/login',

  // 学生端
  STUDENT: '/student',
  STUDENT_HOMEWORK: '/student/homework',
  STUDENT_ERRORS: '/student/errors',
  STUDENT_REPORT: '/student/report',
  STUDENT_PRACTICE: '/student/practice',
  STUDENT_PAPERS: '/student/papers',

  // 老师端
  TEACHER: '/teacher',
  TEACHER_CLASSES: '/teacher/classes',
  TEACHER_HOMEWORK: '/teacher/homework',
  TEACHER_GRADING: '/teacher/grading',
  TEACHER_QUESTIONS: '/teacher/questions',
  TEACHER_ANALYSIS: '/teacher/analysis',

  // 家长端
  PARENT: '/parent',
  PARENT_CHILDREN: '/parent/children',
  PARENT_REPORT: '/parent/report',
  PARENT_MESSAGES: '/parent/messages',
  PARENT_NOTIFICATIONS: '/parent/notifications',
  PARENT_SETTINGS: '/parent/settings',

  // 管理员端
  ADMIN: '/admin',

  // 其他
  NOT_FOUND: '/404'
}

// 用户角色
export const ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  PARENT: 'PARENT',
  ADMIN: 'ADMIN'
}

// 角色显示名称
export const ROLE_LABELS = {
  [ROLES.STUDENT]: '学生',
  [ROLES.TEACHER]: '老师',
  [ROLES.PARENT]: '家长',
  [ROLES.ADMIN]: '管理员'
}

// 角色路由映射
export const ROLE_ROUTES = {
  [ROLES.STUDENT]: ROUTES.STUDENT,
  [ROLES.TEACHER]: ROUTES.TEACHER,
  [ROLES.PARENT]: ROUTES.PARENT,
  [ROLES.ADMIN]: ROUTES.ADMIN
}

// 角色主题颜色
export const ROLE_COLORS = {
  [ROLES.STUDENT]: 'success',
  [ROLES.TEACHER]: 'primary',
  [ROLES.PARENT]: 'warning',
  [ROLES.ADMIN]: 'secondary'
}

// API 响应码
export const API_CODES = {
  SUCCESS: '00000',
  UNAUTHORIZED: '401',
  FORBIDDEN: '403',
  NOT_FOUND: '404',
  SERVER_ERROR: '500'
}

// 本地存储键名
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme'
}