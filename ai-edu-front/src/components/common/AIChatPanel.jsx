import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { getPageMeta } from '../../constants/pageMeta'
import { llmApi } from '../../api'
import { Monitor, Plus, ChevronRight, ChevronLeft, Send, MessageSquare, Bot, Sparkles, Check, Clock, ChevronDown } from 'lucide-react'
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
          content: err.message,
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
        flex flex-col h-full bg-base-100 border-l border-base-300
        transition-all duration-300 ease-in-out
        ${className}
      `}
      style={{ width: isExpanded ? '380px' : '48px' }}
    >
      {/* 展开状态的内容 */}
      {isExpanded ? (
        <>
          {/* 头部 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI 助手</h3>
                {pageMeta && (
                  <p className="text-xs text-base-content/50">{pageMeta.name}</p>
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
                <Plus size={18} />
              </button>
              {/* 收起按钮 */}
              <button
                className="btn btn-ghost btn-sm btn-circle"
                onClick={() => setIsExpanded(false)}
                title="收起"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* 模型选择器 */}
          <div className="relative border-b border-base-300 px-4 py-2">
            <button
              className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-lg hover:bg-base-200 transition-colors"
              onClick={() => setShowModelSelector(!showModelSelector)}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-primary" />
                <span className="text-base-content/70 font-medium">
                  {selectedModel?.displayName || '默认模型'}
                </span>
                {selectedModel?.free && (
                  <span className="badge badge-success badge-xs">免费</span>
                )}
              </div>
              <ChevronDown size={14} className={`text-base-content/50 transition-transform ${showModelSelector ? 'rotate-180' : ''}`} />
            </button>

            {showModelSelector && (
              <>
                {/* 遮罩 - 点击关闭 */}
                <div className="fixed inset-0 z-10" onClick={() => setShowModelSelector(false)}></div>
                <div className="absolute left-4 right-4 top-full z-20 bg-base-100 border border-base-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                  {models.map((model) => (
                    <button
                      key={model.fullName}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-base-200 transition-colors rounded-t-lg first:rounded-t-lg last:rounded-b-lg ${
                        selectedModel?.fullName === model.fullName ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => handleSelectModel(model)}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles size={14} className="text-primary" />
                        <span className="font-medium">{model.displayName}</span>
                        {model.free && <span className="badge badge-success badge-xs">免费</span>}
                      </div>
                      {selectedModel?.fullName === model.fullName && (
                        <Check size={16} className="text-primary" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 页面功能提示 */}
          {pageMeta && pageMeta.features && pageMeta.features.length > 0 && (
            <div className="px-4 py-2 bg-base-200/50 text-xs text-base-content/60 border-b border-base-300">
              <p className="font-medium mb-1">当前页面功能：</p>
              <ul className="list-disc list-inside space-y-0.5">
                {pageMeta.features.slice(0, 3).map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 消息列表 */}
          <div className="flex-1 min-h-0 h-0 overflow-y-auto px-4 py-3 space-y-4">
            {messages.length === 0 && !streamingContent && (
              <div className="text-center text-base-content/50 text-sm py-10">
                <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">开始与 AI 助手对话</p>
                {pageMeta?.aiPrompts?.length > 0 && (
                  <div className="mt-3 px-4 py-3 bg-base-200 rounded-lg text-xs">
                    <p className="font-medium mb-1">试试问我：</p>
                    <p className="text-primary/80">{pageMeta.aiPrompts[0]}</p>
                  </div>
                )}
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {/* AI 消息 */}
                {message.role === 'user' ? (
                  /* 用户消息气泡 */
                  <div className="max-w-[85%]">
                    <div className="bg-primary text-primary-content rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed break-words">
                      {message.content}
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-1 text-xs text-base-content/40">
                      <Clock size={10} />
                      <span>{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                ) : (
                  /* AI 消息气泡 */
                  <div className="max-w-[85%]">
                    <div className={`rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed border-l-[3px] ${
                      message.isError
                        ? 'bg-error/5 border-error text-error'
                        : 'bg-base-200 border-primary'
                    }`}>
                      {message.isError ? (
                        <p>{message.content}</p>
                      ) : (
                        <div className="prose prose-sm max-w-none prose-p:text-sm prose-p:my-1 prose-headings:text-base-content prose-strong:text-base-content prose-code:text-base-content prose-code:bg-neutral/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-neutral prose-pre:text-neutral-content prose-pre:rounded-md prose-pre:max-h-64 prose-pre:overflow-auto">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-base-content/40">
                      <Clock size={10} />
                      <span>{formatTime(message.timestamp)}</span>
                      {message.modelUsed && (
                        <span className="ml-2 text-base-content/30">· {message.modelUsed}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* 流式内容显示 */}
            {streamingContent && (
              <div className="flex justify-start">
                <div className="max-w-[85%]">
                  <div className="rounded-2xl rounded-tl-sm px-4 py-2.5 text-sm leading-relaxed bg-base-200 border-l-[3px] border-primary">
                    <div className="prose prose-sm max-w-none prose-p:text-sm prose-p:my-1 prose-headings:text-base-content prose-strong:text-base-content prose-code:text-base-content prose-code:bg-neutral/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-neutral prose-pre:text-neutral-content prose-pre:rounded-md prose-pre:max-h-64 prose-pre:overflow-auto">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {streamingContent}
                      </ReactMarkdown>
                    </div>
                    <span className="inline-block w-1.5 h-4 bg-primary animate-pulse ml-0.5 align-middle"></span>
                  </div>
                </div>
              </div>
            )}

            {isLoading && !streamingContent && (
              <div className="flex justify-start">
                <div className="bg-base-200 rounded-2xl rounded-tl-sm px-4 py-3 border-l-[3px] border-primary">
                  <span className="loading loading-dots loading-sm"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <div className="p-4 border-t border-base-300">
            <div className="flex gap-2 items-end">
              <div className="flex-1 bg-base-200 rounded-xl px-3 py-1 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                <textarea
                  placeholder="输入消息..."
                  className="w-full bg-transparent border-none outline-none resize-none text-sm py-2 max-h-24"
                  rows={1}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  disabled={isLoading}
                />
              </div>
              <button
                className={`btn btn-primary btn-circle btn-sm h-9 w-9 ${!inputValue.trim() || isLoading ? 'btn-disabled' : 'hover:scale-105 transition-transform'}`}
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
              >
                <Send size={16} />
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
            <ChevronLeft size={20} />
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
