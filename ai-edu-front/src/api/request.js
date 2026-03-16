import axios from 'axios'

// Create axios instance
const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  withCredentials: true, // 重要：携带 Cookie（后端使用 Session）
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
request.interceptors.request.use(
  (config) => {
    // 后端使用 Session 认证，无需 Token
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
request.interceptors.response.use(
  (response) => {
    const { data } = response
    // API returns { code, data, message }
    if (data.code === '00000') {
      return data.data
    }
    // Business error
    return Promise.reject(new Error(data.message || '请求失败'))
  },
  (error) => {
    // HTTP error
    const message = error.response?.data?.message || error.message || '网络错误'
    return Promise.reject(new Error(message))
  }
)

export default request