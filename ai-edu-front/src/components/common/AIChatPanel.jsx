import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { getPageMeta } from '../../constants/pageMeta'
import { llmApi } from '../../api'
import 'katex/dist/katex.min.css'

/**
 * AI 助手面板组件
 * 可收起的右侧面板，支持流式对话功能
 */
export function AIChatPanel({ pageCode, className = '' }) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [sessionId, setSessionId] = useState(() => llmApi.generateSessionId())
  const [models, setModels] = useState([])
  const [selectedModel, setSelectedModel] = useState(null)
  const [showModelSelector, setShowModelSelector] = useState(false)
  const messagesEndRef = useRef(null)
  const cancelRef = useRef(null)
  const streamingContentRef = useRef('') // 用于追踪流式内容的最新值

  // 获取页面元信息
  const pageMeta = getPageMeta(pageCode)

  // 加载模型列表
  useEffect(() => {
    llmApi.getAllowedModels()
      .then(data => {
        setModels(data.allowedModels || [])
        if (data.defaultModel) {
          const defaultModel = data.allowedModels?.find(
            m => m.fullName === data.defaultModel
          )
          if (defaultModel) {
            setSelectedModel(defaultModel)
          }
        }
      })
      .catch(err => {
        console.error('加载模型列表失败:', err)
      })
  }, [])

  // 滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingContent])

  // 取消当前请求
  const cancelRequest = useCallback(() => {
    if (cancelRef.current) {
      cancelRef.current()
      cancelRef.current = null
    }
  }, [])

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
    setStreamingContent('')

    // 构建请求参数
    const params = {
      message: userMessage.content,
      sessionId,
      pageCode
    }

    // 如果选择了特定模型
    if (selectedModel) {
      params.provider = selectedModel.provider
      params.model = selectedModel.model
    }

    // 流式对话
    streamingContentRef.current = ''
    cancelRef.current = llmApi.streamChat(
      params,
      // onToken
      (content) => {
        streamingContentRef.current += content
        setStreamingContent(prev => prev + content)
      },
      // onDone
      (data) => {
        const finalContent = streamingContentRef.current
        const modelUsed = data.model_used || data.modelUsed
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: finalContent,
          timestamp: new Date(),
          modelUsed,
          usage: data.usage
        }
        setMessages(prev => [...prev, aiMessage])
        setStreamingContent('')
        setIsLoading(false)
        cancelRef.current = null
      },
      // onError - 将错误以消息气泡形式展示
      (err) => {
        const errorMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: `❌ ${err.message}`,
          timestamp: new Date(),
          isError: true
        }
        setMessages(prev => [...prev, errorMessage])
        setIsLoading(false)
        setStreamingContent('')
        cancelRef.current = null
      }
    )
  }

  // 新对话
  const handleNewChat = () => {
    cancelRequest()
    setMessages([])
    setStreamingContent('')
    streamingContentRef.current = ''
    setSessionId(llmApi.generateSessionId())
  }

  // 处理键盘事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // 选择模型
  const handleSelectModel = (model) => {
    setSelectedModel(model)
    setShowModelSelector(false)
  }

  // 清理
  useEffect(() => {
    return () => {
      cancelRequest()
    }
  }, [cancelRequest])

  return (
    <div
      className={`
        flex flex-col h-full bg-base-200 border-l border-base-300
        transition-all duration-300 ease-in-out
        ${className}
      `}
      style={{ width: isExpanded ? '380px' : '48px' }}
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
            <div className="flex items-center gap-1">
              {/* 新对话按钮 */}
              <button
                className="btn btn-ghost btn-sm btn-circle"
                onClick={handleNewChat}
                title="新对话"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              {/* 收起按钮 */}
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
          </div>

          {/* 模型选择器 */}
          <div className="relative border-b border-base-300">
            <button
              className="w-full flex items-center justify-between p-2 text-sm hover:bg-base-300/50"
              onClick={() => setShowModelSelector(!showModelSelector)}
            >
              <span className="text-base-content/70">
                模型: {selectedModel?.displayName || '默认'}
                {selectedModel?.free && <span className="text-success ml-1">(免费)</span>}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showModelSelector && (
              <div className="absolute left-0 right-0 top-full z-10 bg-base-100 border border-base-300 rounded-b shadow-lg max-h-60 overflow-y-auto">
                {models.map((model) => (
                  <button
                    key={model.fullName}
                    className={`w-full flex items-center justify-between p-2 text-sm hover:bg-base-200 ${
                      selectedModel?.fullName === model.fullName ? 'bg-base-200' : ''
                    }`}
                    onClick={() => handleSelectModel(model)}
                  >
                    <div>
                      <span>{model.displayName}</span>
                      {model.free && <span className="text-success ml-1">(免费)</span>}
                    </div>
                    {selectedModel?.fullName === model.fullName && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
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
          <div className="flex-1 min-h-0 h-0 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 && !streamingContent && (
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
                      : message.isError
                        ? 'chat-bubble-error'
                        : 'bg-base-300'
                  }`}
                >
                  {message.role === 'user' ? (
                    message.content
                  ) : (
                    <div className="prose prose-sm max-w-none prose-p:text-base-content prose-headings:text-base-content prose-strong:text-base-content prose-code:text-base-content">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
                <div className="chat-footer opacity-50 text-xs">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            ))}

            {/* 流式内容显示 */}
            {streamingContent && (
              <div className="chat chat-start">
                <div className="chat-bubble bg-base-300">
                  <div className="prose prose-sm max-w-none prose-p:text-base-content prose-headings:text-base-content prose-strong:text-base-content prose-code:text-base-content">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm, remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {streamingContent}
                    </ReactMarkdown>
                  </div>
                  <span className="inline-block w-1 h-4 bg-primary animate-pulse ml-0.5"></span>
                </div>
              </div>
            )}

            {isLoading && !streamingContent && (
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

export default AIChatPanel