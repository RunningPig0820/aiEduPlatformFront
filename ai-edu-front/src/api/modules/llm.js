/**
 * LLM API 模块
 * 封装后端 LLM Gateway 接口
 */

const BASE_URL = '/api/llm'

/**
 * 获取允许调用的模型列表
 * @returns {Promise<{allowedModels: Array, defaultModel: string}>}
 */
export async function getAllowedModels() {
  const response = await fetch(`${BASE_URL}/allowed-models`, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error(`获取模型列表失败: ${response.status}`)
  }

  const result = await response.json()
  if (result.code !== '00000') {
    throw new Error(result.message || '获取模型列表失败')
  }

  return result.data
}

/**
 * 同步对话 API
 * @param {Object} params - 请求参数
 * @param {string} params.message - 用户消息
 * @param {string} [params.scene] - 场景代码
 * @param {string} [params.provider] - Provider 名称
 * @param {string} [params.model] - 模型名称
 * @param {string} [params.sessionId] - 会话ID
 * @param {string} [params.pageCode] - 页面代码
 * @param {Object} [params.context] - 额外上下文
 * @returns {Promise<Object>} 响应数据
 */
export async function chat(params) {
  const response = await fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(params)
  })

  if (!response.ok) {
    throw new Error(`对话请求失败: ${response.status}`)
  }

  const result = await response.json()
  if (result.code !== '00000') {
    throw new Error(result.message || '对话请求失败')
  }

  return result.data
}

/**
 * 流式对话 API (SSE)
 * @param {Object} params - 请求参数
 * @param {string} params.message - 用户消息
 * @param {string} [params.scene] - 场景代码
 * @param {string} [params.provider] - Provider 名称
 * @param {string} [params.model] - 模型名称
 * @param {string} [params.sessionId] - 会话ID
 * @param {string} [params.pageCode] - 页面代码
 * @param {Object} [params.context] - 额外上下文
 * @param {Function} onToken - token 回调函数 (content: string) => void
 * @param {Function} onDone - 完成回调函数 (data: Object) => void
 * @param {Function} onError - 错误回调函数 (error: Error) => void
 * @returns {Function} 取消函数
 */
export function streamChat(params, onToken, onDone, onError) {
  let cancelled = false
  const readerRef = { current: null }

  const execute = async () => {
    try {
      const response = await fetch(`${BASE_URL}/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(params)
      })

      if (!response.ok) {
        throw new Error(`流式对话请求失败: ${response.status}`)
      }

      const reader = response.body.getReader()
      readerRef.current = reader
      const decoder = new TextDecoder()
      let buffer = ''
      let currentEvent = ''

      while (!cancelled) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmedLine = line.trim()

          if (!trimmedLine) {
            continue
          }

          if (trimmedLine.startsWith('event:')) {
            currentEvent = trimmedLine.slice(6).trim()
          } else if (trimmedLine.startsWith('data:')) {
            const jsonStr = trimmedLine.slice(5).trim()

            try {
              const data = JSON.parse(jsonStr)

              if (currentEvent === 'token') {
                onToken?.(data.content)
              } else if (currentEvent === 'done') {
                onDone?.(data)
              } else if (currentEvent === 'error') {
                onError?.(new Error(data.message || 'LLM 调用失败'))
              }
            } catch (parseError) {
              console.warn('SSE 数据解析失败:', jsonStr)
            }
          }
        }
      }

      // 如果被取消，关闭 reader
      if (cancelled) {
        reader.cancel()
      }
    } catch (error) {
      if (!cancelled) {
        onError?.(error)
      }
    }
  }

  execute()

  // 返回取消函数
  return () => {
    cancelled = true
    if (readerRef.current) {
      readerRef.current.cancel()
    }
  }
}

/**
 * 生成唯一的会话ID
 * @returns {string} 会话ID
 */
export function generateSessionId() {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

const llmApi = {
  getAllowedModels,
  chat,
  streamChat,
  generateSessionId
}

export default llmApi