import { useState, useRef, useEffect } from 'react'
import { getPageMeta } from '../../constants/pageMeta'

/**
 * AI 助手面板组件
 * 可收起的右侧面板，支持对话功能
 */
export function AIChatPanel({ pageCode, className = '' }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // 获取页面元信息
  const pageMeta = getPageMeta(pageCode)

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 发送消息
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Mock AI 响应 - 后续替换为真实 API 调用
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: 'assistant',
        content: getMockResponse(inputValue.trim(), pageMeta),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1000)
  }

  // 处理键盘事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div
      className={`
        flex flex-col h-full bg-base-200 border-l border-base-300
        transition-all duration-300 ease-in-out
        ${className}
      `}
      style={{ width: isExpanded ? '320px' : '48px' }}
    >
      {/* 展开状态的内容 */}
      {isExpanded ? (
        <>
          {/* 头部 */}
          <div className="flex items-center justify-between p-3 border-b border-base-300">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI 助手</h3>
                {pageMeta && (
                  <p className="text-xs text-base-content/60">{pageMeta.name}</p>
                )}
              </div>
            </div>
            <button
              className="btn btn-ghost btn-sm btn-circle"
              onClick={() => setIsExpanded(false)}
              title="收起"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* 页面功能提示 */}
          {pageMeta && pageMeta.features && pageMeta.features.length > 0 && (
            <div className="p-2 bg-base-300/50 text-xs text-base-content/70">
              <p className="font-medium mb-1">当前页面功能：</p>
              <ul className="list-disc list-inside space-y-0.5">
                {pageMeta.features.slice(0, 3).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 消息列表 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-base-content/50 text-sm py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>开始与 AI 助手对话</p>
                {pageMeta?.aiPrompts?.length > 0 && (
                  <div className="mt-2 text-xs">
                    <p className="font-medium">试试问我：</p>
                    <p className="mt-1 text-primary">{pageMeta.aiPrompts[0]}</p>
                  </div>
                )}
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat ${message.role === 'user' ? 'chat-end' : 'chat-start'}`}
              >
                <div
                  className={`chat-bubble ${
                    message.role === 'user'
                      ? 'chat-bubble-primary'
                      : 'chat-bubble-base-100'
                  }`}
                >
                  {message.content}
                </div>
                <div className="chat-footer opacity-50 text-xs">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="chat chat-start">
                <div className="chat-bubble bg-base-100">
                  <span className="loading loading-dots loading-sm"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="p-3 border-t border-base-300">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="输入消息..."
                className="input input-sm input-bordered flex-1"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                className="btn btn-sm btn-primary"
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </>
      ) : (
        /* 收起状态 */
        <>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div
              className="text-sm font-medium text-base-content/70"
              style={{ writingMode: 'vertical-rl' }}
            >
              AI对话
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm mb-2"
            onClick={() => setIsExpanded(true)}
            title="展开 AI 助手"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}

/**
 * 格式化时间
 */
function formatTime(date) {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * 获取 Mock 响应
 * 后续替换为真实的 AI API 调用
 */
function getMockResponse(userInput, pageMeta) {
  const lowerInput = userInput.toLowerCase()

  // 基于页面上下文的智能响应
  if (pageMeta) {
    if (lowerInput.includes('功能') || lowerInput.includes('做什么')) {
      return `当前页面是「${pageMeta.name}」，主要功能包括：${pageMeta.features?.join('、') || '暂无'}。有什么我可以帮您的吗？`
    }

    if (lowerInput.includes('帮助') || lowerInput.includes('怎么用')) {
      return `我可以帮您：${pageMeta.aiPrompts?.join('、') || '解答问题'}。请告诉我您想了解什么？`
    }
  }

  // 默认响应
  const responses = [
    '这是一个很好的问题！我正在学习中，后续会为您提供更准确的回答。',
    '感谢您的提问！目前我是演示模式，正式版本会提供更智能的回答。',
    '我理解您的问题。功能正在开发中，敬请期待！'
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

export default AIChatPanel