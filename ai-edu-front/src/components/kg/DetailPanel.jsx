import { useState, useCallback } from 'react'
import { kgApi } from '@/api/modules/kg'
import { Copy, Check, Target } from 'lucide-react'

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
        <Check size={12} className="text-success" />
      ) : (
        <Copy size={12} />
      )}
    </button>
  )
}

/**
 * 详情字段行
 */
function DetailField({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5 p-3 rounded-lg bg-base-100 border border-base-200">
      <span className="text-xs text-base-content/50 font-medium">{label}</span>
      <span className="text-sm">{value || '-'}</span>
    </div>
  )
}

/**
 * 难度文字显示（后端返回字符串如 EASY/MEDIUM/HARD）
 */
function DifficultyText({ level }) {
  const labelMap = {
    EASY: '简单',
    MEDIUM: '中等',
    HARD: '困难'
  }
  return <span className="text-sm font-medium">{labelMap[level] || level || '-'}</span>
}

/**
 * 重要性文字显示
 */
function ImportanceText({ level }) {
  const labelMap = {
    LOW: '低',
    MEDIUM: '中',
    HIGH: '高',
    CORE: '核心'
  }
  return <span className="text-sm font-medium">{labelMap[level] || level || '-'}</span>
}

/**
 * 教材知识点详情面板
 * 后端返回字段: uri, label, difficulty, importance, cognitiveLevel, sectionUri, sectionLabel, chapterUri, chapterLabel
 */
function TextbookKPDetail({ data }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <DetailField label="名称" value={data.label} />
        <DetailField label="章节" value={data.chapterLabel} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <DetailField label="小节" value={data.sectionLabel} />
        <DetailField label="认知层级" value={data.cognitiveLevel} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg bg-base-100 border border-base-200 flex flex-col gap-0.5">
          <span className="text-xs text-base-content/50 font-medium">难度</span>
          <DifficultyText level={data.difficulty} />
        </div>
        <div className="p-3 rounded-lg bg-base-100 border border-base-200 flex flex-col gap-0.5">
          <span className="text-xs text-base-content/50 font-medium">重要性</span>
          <ImportanceText level={data.importance} />
        </div>
      </div>
      <div className="p-3 rounded-lg bg-base-100 border border-base-200 flex flex-col gap-0.5">
        <span className="text-xs text-base-content/50 font-medium">URI</span>
        <CopyUriButton uri={data.uri} />
      </div>
    </div>
  )
}

/**
 * 知识点详情面板
 * 后端返回字段: uri, label, difficulty, importance, cognitiveLevel, sectionUri, sectionLabel, chapterUri, chapterLabel
 */
function KPDetail({ data }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <DetailField label="名称" value={data.label} />
        <DetailField label="章节" value={data.chapterLabel} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <DetailField label="小节" value={data.sectionLabel} />
        <DetailField label="认知层级" value={data.cognitiveLevel} />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg bg-base-100 border border-base-200 flex flex-col gap-0.5">
          <span className="text-xs text-base-content/50 font-medium">难度</span>
          <DifficultyText level={data.difficulty} />
        </div>
        <div className="p-3 rounded-lg bg-base-100 border border-base-200 flex flex-col gap-0.5">
          <span className="text-xs text-base-content/50 font-medium">重要性</span>
          <ImportanceText level={data.importance} />
        </div>
      </div>
      <div className="p-3 rounded-lg bg-base-100 border border-base-200 flex flex-col gap-0.5">
        <span className="text-xs text-base-content/50 font-medium">URI</span>
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
        <Target size={48} className="mb-3 opacity-50" />
        <p className="text-sm text-center">请选择一个节点查看详情</p>
      </div>
    )
  }

  const isTextbookKP = nodeType === 'textbook_kp'

  return (
    <div className="flex flex-col h-full">
      {/* 标题 */}
      <div className="px-4 py-3 border-b border-base-300 bg-base-100 rounded-t-lg">
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
