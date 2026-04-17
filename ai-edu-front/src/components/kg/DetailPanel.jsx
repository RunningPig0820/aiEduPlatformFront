import { useState, useCallback } from 'react'
import { kgApi } from '@/api/modules/kg'

/**
 * 难度星级显示
 */
function DifficultyStars({ level }) {
  const fullStars = Math.floor(level) || 0
  const hasHalfStar = level % 1 >= 0.5
  const maxStars = 5

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }).map((_, i) => {
        if (i < fullStars) {
          return (
            <svg key={i} className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )
        }
        if (i === fullStars && hasHalfStar) {
          return (
            <svg key={i} className="w-4 h-4 text-warning" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          )
        }
        return (
          <svg key={i} className="w-4 h-4 text-base-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )
      })}
    </div>
  )
}

/**
 * 复制 URI 按钮
 */
function CopyUriButton({ uri }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(uri)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = uri
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [uri])

  return (
    <button
      className="btn btn-ghost btn-xs gap-1 font-mono text-xs"
      onClick={handleCopy}
      title="复制 URI"
    >
      <span className="truncate max-w-[180px]">{uri}</span>
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  )
}

/**
 * 详情字段行
 */
function DetailField({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-base-content/50">{label}</span>
      <span className="text-sm font-medium">{value || '-'}</span>
    </div>
  )
}

/**
 * 教材知识点详情面板
 */
function TextbookKPDetail({ data }) {
  return (
    <div className="flex flex-col gap-4">
      <DetailField label="名称" value={data.name} />
      <DetailField label="学科" value={data.subject} />
      <DetailField label="年级" value={data.grade} />
      <DetailField label="单元" value={data.unit} />
      <DetailField label="课时" value={data.lesson} />
      <DetailField label="难度" value={data.difficulty ? <DifficultyStars level={data.difficulty} /> : '-'} />
      <DetailField label="认知层级" value={data.cognitiveLevel} />
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-base-content/50">URI</span>
        <CopyUriButton uri={data.uri} />
      </div>
    </div>
  )
}

/**
 * 知识点详情面板
 */
function KPDetail({ data }) {
  return (
    <div className="flex flex-col gap-4">
      <DetailField label="名称" value={data.name} />
      <DetailField label="学科" value={data.subject} />
      <DetailField label="难度" value={data.difficulty ? <DifficultyStars level={data.difficulty} /> : '-'} />
      <DetailField label="认知层级" value={data.cognitiveLevel} />
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-base-content/50">URI</span>
        <CopyUriButton uri={data.uri} />
      </div>
    </div>
  )
}

/**
 * 详情面板组件
 *
 * 功能：
 * - 根据节点类型（教材知识点/知识点）展示不同字段
 * - 支持复制 URI 到剪贴板
 * - 未选中状态占位提示
 */
function DetailPanel({ selectedNode, nodeType }) {
  // 未选中状态
  if (!selectedNode) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-base-content/50 p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 mb-3 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
          />
        </svg>
        <p className="text-sm text-center">请选择一个节点查看详情</p>
      </div>
    )
  }

  const isTextbookKP = nodeType === 'textbook_kp'

  return (
    <div className="flex flex-col h-full">
      {/* 标题 */}
      <div className="px-4 py-3 border-b border-base-300 bg-base-100">
        <h3 className="text-sm font-semibold">
          {isTextbookKP ? '教材知识点详情' : '知识点详情'}
        </h3>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto p-4">
        {isTextbookKP ? (
          <TextbookKPDetail data={selectedNode} />
        ) : (
          <KPDetail data={selectedNode} />
        )}
      </div>
    </div>
  )
}

export default DetailPanel
