/**
 * 本地存储工具函数
 */

/**
 * 获取存储项
 * @param {string} key - 键名
 * @param {*} defaultValue - 默认值
 * @returns {*} 存储的值或默认值
 */
export function getStorage(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key)
    if (value === null) return defaultValue
    return JSON.parse(value)
  } catch {
    return defaultValue
  }
}

/**
 * 设置存储项
 * @param {string} key - 键名
 * @param {*} value - 值
 */
export function setStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Storage set error:', error)
  }
}

/**
 * 删除存储项
 * @param {string} key - 键名
 */
export function removeStorage(key) {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Storage remove error:', error)
  }
}

/**
 * 清空存储
 */
export function clearStorage() {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Storage clear error:', error)
  }
}

/**
 * 获取 Session 存储项
 * @param {string} key - 键名
 * @param {*} defaultValue - 默认值
 * @returns {*} 存储的值或默认值
 */
export function getSessionStorage(key, defaultValue = null) {
  try {
    const value = sessionStorage.getItem(key)
    if (value === null) return defaultValue
    return JSON.parse(value)
  } catch {
    return defaultValue
  }
}

/**
 * 设置 Session 存储项
 * @param {string} key - 键名
 * @param {*} value - 值
 */
export function setSessionStorage(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('SessionStorage set error:', error)
  }
}