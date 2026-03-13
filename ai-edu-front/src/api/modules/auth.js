import request from '../request'

export const authApi = {
  // 登录
  login: (identifier, password) =>
    request.post('/auth/login', { username: identifier, password }),

  // 演示登录
  demoLogin: (role) =>
    request.post('/auth/demo-login', { role }),

  // 注册
  register: (data) =>
    request.post('/auth/register', data),

  // 发送验证码
  sendCode: (phone) =>
    request.post('/auth/send-code', { phone }),

  // 获取当前用户
  getCurrentUser: () =>
    request.get('/auth/current-user'),

  // 登出
  logout: () =>
    request.post('/auth/logout')
}

export default authApi