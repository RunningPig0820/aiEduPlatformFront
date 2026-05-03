import { useState, useCallback, useEffect } from 'react'
import { kgApi } from '@/api/modules/kg'
import { BookOpen, Layers, CalendarDays, FolderOpen, FileText, Dot, ChevronRight, RefreshCw } from 'lucide-react'

// 节点类型常量（6级导航）
const NODE_TYPES = {
  EDITION: 'EDITION',     // 教材版本（第1级）
  SUBJECT: 'SUBJECT',     // 学科（第2级）
  GRADE: 'GRADE',         // 年级（第3级，含 textbookUri）
  CHAPTER: 'CHAPTER',     // 章节（第4级）
  SECTION: 'SECTION',     // 小节（第5级）
  POINT: 'POINT',         // 教材知识点（第6级）
}

// 节点展开后的子类型
const NODE_CHILD_TYPE = {
  EDITION: NODE_TYPES.SUBJECT,
  SUBJECT: NODE_TYPES.GRADE,
  GRADE: NODE_TYPES.CHAPTER,
  CHAPTER: NODE_TYPES.SECTION,
  SECTION: NODE_TYPES.POINT,
}

// 节点类型图标
function NodeIcon({ type }) {
  const size = 16
  switch (type) {
    case NODE_TYPES.EDITION:
      return <BookOpen size={size} strokeWidth={1.5} />
    case NODE_TYPES.SUBJECT:
      return <Layers size={size} strokeWidth={1.5} />
    case NODE_TYPES.GRADE:
      return <CalendarDays size={size} strokeWidth={1.5} />
    case NODE_TYPES.CHAPTER:
      return <FolderOpen size={size} strokeWidth={1.5} />
    case NODE_TYPES.SECTION:
      return <FileText size={size} strokeWidth={1.5} />
    case NODE_TYPES.POINT:
      return <Dot size={16} strokeWidth={1.5} className="text-primary" />
    default:
      return null
  }
}

// 节点类型中文标签
const NODE_TYPE_LABEL = {
  [NODE_TYPES.EDITION]: '教材版本',
  [NODE_TYPES.SUBJECT]: '学科',
  [NODE_TYPES.GRADE]: '年级',
  [NODE_TYPES.CHAPTER]: '章节',
  [NODE_TYPES.SECTION]: '小节',
  [NODE_TYPES.POINT]: '教材知识点',
}

/**
 * 单个树节点组件（递归）
 */
function TreeNode({ node, nodeType, cache, selectedUri, onSelect, parentContext }) {
  const [expanded, setExpanded] = useState(false)
  const [children, setChildren] = useState(cache[node.code || node.uri] || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isLeaf = nodeType === NODE_TYPES.POINT
  const isSelected = node.uri === selectedUri

  // 加载子节点
  const loadChildren = useCallback(async () => {
    const cacheKey = node.code || node.uri
    if (cache[cacheKey] && cache[cacheKey].length > 0) {
      setChildren(cache[cacheKey])
      return
    }

    setLoading(true)
    setError(null)
    try {
      let childNodes = []

      if (nodeType === NODE_TYPES.EDITION) {
        // 教材版本 → 学科
        const result = await kgApi.getDimensionSubjects()
        childNodes = (Array.isArray(result) ? result : []).map((s, i) => ({
          code: s.code,
          label: s.label,
          uri: s.code,
          orderIndex: s.orderIndex || i,
          edition: node.code, // 传递教材版本
        }))
      } else if (nodeType === NODE_TYPES.SUBJECT) {
        // 学科 → 年级
        const result = await kgApi.getDimensionGrades({
          edition: node.edition || parentContext?.edition,
          subject: node.code,
        })
        childNodes = (Array.isArray(result) ? result : []).map((g, i) => ({
          label: g.label || g.grade,
          uri: g.textbookUri,
          textbookUri: g.textbookUri,
          edition: node.edition || parentContext?.edition,
          subject: node.code,
        }))
      } else if (nodeType === NODE_TYPES.GRADE) {
        // 年级 → 章节
        const result = await kgApi.getChapters(node.textbookUri || node.uri)
        childNodes = (Array.isArray(result) ? result : []).map((ch, i) => ({
          uri: ch.uri,
          label: ch.label,
          orderIndex: ch.orderIndex || i,
          chapterUri: ch.uri,
        }))
      } else if (nodeType === NODE_TYPES.CHAPTER) {
        // 章节 → 小节
        const result = await kgApi.getSections(node.chapterUri || node.uri)
        childNodes = (Array.isArray(result) ? result : []).map((sec, i) => ({
          uri: sec.uri,
          label: sec.label,
          orderIndex: sec.orderIndex || i,
          sectionUri: sec.uri,
          knowledgePointCount: sec.knowledgePointCount,
        }))
      } else if (nodeType === NODE_TYPES.SECTION) {
        // 小节 → 知识点
        const result = await kgApi.getPoints(node.sectionUri || node.uri)
        childNodes = (Array.isArray(result) ? result : []).map((p, i) => ({
          uri: p.uri,
          label: p.label || p.name,
          ...p,
        }))
      }

      setChildren(childNodes)
      cache[cacheKey] = childNodes
    } catch (err) {
      setError(err.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }, [nodeType, node, cache, parentContext])

  // 重试
  const handleRetry = async (e) => {
    e.stopPropagation()
    delete cache[node.code || node.uri] // 清除缓存
    await loadChildren()
  }

  // 展开/收起
  const handleToggle = async (e) => {
    e.stopPropagation()
    if (isLeaf) return

    if (!expanded) {
      await loadChildren()
    }
    setExpanded(!expanded)
  }

  // 点击知识点节点 → 通知父组件
  const handleClick = (e) => {
    e.stopPropagation()
    if (nodeType === NODE_TYPES.POINT) {
      onSelect(node)
    }
  }

  const childType = NODE_CHILD_TYPE[nodeType]

  // 构建传递给子节点的上下文
  const childContext = {
    ...parentContext,
    edition: node.edition || parentContext?.edition,
    subject: node.subject || parentContext?.subject || (nodeType === NODE_TYPES.SUBJECT ? node.code : undefined),
  }

  return (
    <li>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors text-sm
          ${isSelected ? 'bg-primary/15 text-primary font-semibold ring-1 ring-primary/10' : 'hover:bg-base-300'}
          ${isLeaf ? 'pl-2' : ''}`}
        onClick={!isLeaf ? handleToggle : handleClick}
        role="treeitem"
        aria-expanded={!isLeaf ? expanded : undefined}
      >
        {/* 展开箭头 */}
        {!isLeaf && (
          <ChevronRight
            className={`h-3 w-3 transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
        )}
        {isLeaf && <span className="w-3"></span>}

        {/* 节点图标 */}
        <span className="flex-shrink-0 opacity-70">
          <NodeIcon type={nodeType} />
        </span>

        {/* 节点名称 */}
        <span className="truncate">{node.label}</span>

        {/* 小节知识点数量 */}
        {nodeType === NODE_TYPES.SECTION && node.knowledgePointCount > 0 && (
          <span className="text-xs text-base-content/40">({node.knowledgePointCount})</span>
        )}

        {/* 节点类型标签 */}
        <span className="ml-auto text-[10px] text-base-content/40 flex-shrink-0">
          {NODE_TYPE_LABEL[nodeType]}
        </span>

        {/* 加载状态 */}
        {loading && <span className="loading loading-spinner loading-xs ml-auto"></span>}
      </div>

      {/* 错误提示 + 重试 */}
      {error && (
        <div className="ml-6 py-1 px-2 text-xs text-error">
          {error}
          <button className="btn btn-ghost btn-xs ml-1" onClick={handleRetry}>重试</button>
        </div>
      )}

      {/* 子节点 */}
      {expanded && children.length > 0 && (
        <ul className="ml-2 border-l border-base-300 pl-2" role="group">
          {children.map((child) => (
            <TreeNode
              key={child.uri || child.code || child.label}
              node={child}
              nodeType={childType}
              cache={cache}
              selectedUri={selectedUri}
              onSelect={onSelect}
              parentContext={childContext}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

/**
 * 教材树形导航组件
 *
 * 导航层级（6级）：教材版本 → 学科 → 年级 → 章节 → 小节 → 知识点
 * - 逐级懒加载子节点
 * - 知识点节点点击触发选中
 * - 已展开节点数据缓存
 */
function TextbookTree({ selectedUri, onSelect }) {
  const [editions, setEditions] = useState([]) // 教材版本列表
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // 缓存：{ code/uri: [children] }
  const [cache] = useState({})

  // 加载教材版本根节点（第1级）
  const loadEditions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await kgApi.getDimensionTextbooks()
      const editionNodes = (Array.isArray(result) ? result : []).map((d, i) => ({
        code: d.code,
        label: d.label,
        uri: d.code,
        orderIndex: d.orderIndex || i,
      }))
      editionNodes.sort((a, b) => a.orderIndex - b.orderIndex)
      setEditions(editionNodes)
    } catch (err) {
      setError(err.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  // 缓存失效：刷新时清空
  const handleRefresh = useCallback(() => {
    Object.keys(cache).forEach((key) => delete cache[key])
    loadEditions()
  }, [cache, loadEditions])

  // 首次加载
  useEffect(() => {
    loadEditions()
  }, [loadEditions])

  const handleRetry = async () => {
    await loadEditions()
  }

  return (
    <div className="flex flex-col h-full bg-base-200">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-base-300 bg-base-100">
        <h2 className="text-sm font-semibold">教材导航</h2>
        <button
          className="btn btn-ghost btn-xs"
          onClick={handleRefresh}
          title="刷新导航"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      {/* 树容器 */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* 加载中 */}
        {loading && (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md text-primary"></span>
          </div>
        )}

        {/* 加载失败 */}
        {error && (
          <div className="text-center py-4">
            <p className="text-error text-sm mb-2">{error}</p>
            <button className="btn btn-error btn-sm" onClick={handleRetry}>重试</button>
          </div>
        )}

        {/* 树列表 */}
        {!loading && !error && editions.length > 0 && (
          <ul role="tree" className="space-y-0.5">
            {editions.map((edition) => (
              <TreeNode
                key={edition.code}
                node={edition}
                nodeType={NODE_TYPES.EDITION}
                cache={cache}
                selectedUri={selectedUri}
                onSelect={onSelect}
                parentContext={{ edition: edition.code }}
              />
            ))}
          </ul>
        )}

        {/* 空状态 */}
        {!loading && !error && editions.length === 0 && (
          <div className="text-center py-8 text-base-content/50 text-sm">
            暂无导航数据
          </div>
        )}
      </div>
    </div>
  )
}

export default TextbookTree