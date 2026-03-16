/**
 * 验证相关工具函数
 */

/**
 * 验证手机号
 * @param {string} phone - 手机号
 * @returns {boolean} 是否有效
 */
export function isValidPhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 验证邮箱
 * @param {string} email - 邮箱
 * @returns {boolean} 是否有效
 */
export function isValidEmail(email) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
}

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {{ valid: boolean, level: string, message: string }} 验证结果
 */
export function validatePassword(password) {
  if (!password || password.length < 6) {
    return { valid: false, level: 'weak', message: '密码至少6位' }
  }

  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  const strength = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length

  if (password.length >= 8 && strength >= 3) {
    return { valid: true, level: 'strong', message: '密码强度高' }
  }
  if (password.length >= 6 && strength >= 2) {
    return { valid: true, level: 'medium', message: '密码强度中等' }
  }
  return { valid: true, level: 'weak', message: '密码强度低，建议包含字母和数字' }
}

/**
 * 验证用户名
 * @param {string} username - 用户名
 * @returns {{ valid: boolean, message: string }} 验证结果
 */
export function validateUsername(username) {
  if (!username) {
    return { valid: false, message: '用户名不能为空' }
  }
  if (username.length < 3 || username.length > 50) {
    return { valid: false, message: '用户名长度应为3-50个字符' }
  }
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(username)) {
    return { valid: false, message: '用户名需以字母开头，仅含字母、数字、下划线' }
  }
  return { valid: true, message: '' }
}

/**
 * 验证验证码
 * @param {string} code - 验证码
 * @returns {boolean} 是否有效
 */
export function isValidVerifyCode(code) {
  return /^\d{6}$/.test(code)
}