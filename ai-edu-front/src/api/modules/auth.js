import request from '../request'

// 登录类型枚举
export const LoginType = {
  USERNAME_PASSWORD: 'USERNAME_PASSWORD', // 用户名+密码
  PHONE_PASSWORD: 'PHONE_PASSWORD',       // 手机号+密码
  PHONE_CODE: 'PHONE_CODE'                 // 手机号+验证码
}

// 验证码场景枚举
export const CodeScene = {
  REGISTER: 'REGISTER',           // 注册
  LOGIN: 'LOGIN',                 // 登录
  RESET_PASSWORD: 'RESET_PASSWORD' // 重置密码
}

export const authApi = {
  // 登录 - 用户名+密码
  login: (username, password) =>
    request.post('/auth/login', {
      loginType: LoginType.USERNAME_PASSWORD,
      username,
      password
    }),

  // 手机号+密码登录
  loginByPhonePassword: (phone, password) =>
    request.post('/auth/login', {
      loginType: LoginType.PHONE_PASSWORD,
      phone,
      password
    }),

  // 手机号+验证码登录
  loginByPhoneCode: (phone, code) =>
    request.post('/auth/login', {
      loginType: LoginType.PHONE_CODE,
      phone,
      code
    }),

  // 演示登录
  demoLogin: (role) =>
    request.post('/auth/demo-login', { role }),

  // 注册
  register: (data) =>
    request.post('/auth/register', data),

  // 发送验证码
  sendCode: (phone, scene) =>
    request.post('/auth/send-code', { phone, scene }),

  // 获取当前用户
  getCurrentUser: () =>
    request.get('/auth/current-user'),

  // 获取用户信息
  getUserById: (id) =>
    request.get(`/auth/user/${id}`),

  // 修改密码（需登录）
  changePassword: (oldPassword, newPassword) =>
    request.put('/auth/password', { oldPassword, newPassword }),

  // 重置密码
  resetPassword: (phone, code, newPassword) =>
    request.post('/auth/reset-password', { phone, code, newPassword }),

  // 登出
  logout: () =>
    request.post('/auth/logout')
}

export default authApi