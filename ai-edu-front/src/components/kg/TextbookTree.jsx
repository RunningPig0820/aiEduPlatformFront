import { useState, useCallback } from 'react'
import { kgApi } from '@/api/modules/kg'

// 节点类型常量
const NODE_TYPES = {
  TEXTBOOK: 'TEXTBOOK',
  CHAPTER: 'CHAPTER',
  SECTION: 'SECTION',
  POINT: 'POINT',
}

// 节点类型对应的 API 调用映射
const NODE_CHILD_API = {
  TEXTBOOK: { fn: kgApi.getChapters, param: 'textbookUri' },
  CHAPTER: { fn: kgApi.getSections, param: 'chapterUri' },
  SECTION: { fn: kgApi.getPoints, param: 'sectionUri' },
}

// 节点展开后的子类型
const NODE_CHILD_TYPE = {
  TEXTBOOK: NODE_TYPES.CHAPTER,
  CHAPTER: NODE_TYPES.SECTION,
  SECTION: NODE_TYPES.POINT,
}

// 节点类型图标
function NodeIcon({ type }) {
  switch (type) {
    case NODE_TYPES.TEXTBOOK:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    case NODE_TYPES.CHAPTER:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      )
    case NODE_TYPES.SECTION:
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    case NODE_TYPES.POINT:
      return (
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
      )
    default:
      return null
  }
}

/**
 * 单个树节点组件（递归）
 */
function TreeNode({ node, nodeType, level = 0, cache, selectedUri, onSelect }) {
  const [expanded, setExpanded] = useState(false)
  const [children, setChildren] = useState(cache[node.uri] || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isLeaf = nodeType === NODE_TYPES.POINT
  const isSelected = node.uri === selectedUri

  // 加载子节点
  const loadChildren = useCallback(async () => {
    const apiConfig = NODE_CHILD_API[nodeType]
    if (!apiConfig) return

    // 检查缓存
    if (cache[node.uri] && cache[node.uri].length > 0) {
      setChildren(cache[node.uri])
      return
    }

    setLoading(true)
    setError(null)
    try {
      const result = await apiConfig.fn(node.uri)
      const childNodes = Array.isArray(result) ? result : []
      setChildren(childNodes)
      // 写入缓存
      cache[node.uri] = childNodes
    } catch (err) {
      setError(err.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }, [nodeType, node.uri, cache])

  // 重试
  const handleRetry = async (e) => {
    e.stopPropagation()
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

  return (
    <li>
      <div
        className={`flex items-center gap-2 py-1.5 px-2 rounded-lg cursor-pointer transition-colors text-sm
          ${isSelected ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-base-300'}
          ${isLeaf ? 'pl-2' : ''}`}
        onClick={!isLeaf ? handleToggle : handleClick}
        role="treeitem"
        aria-expanded={!isLeaf ? expanded : undefined}
      >
        {/* 展开箭头 */}
        {!isLeaf && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-3 w-3 transition-transform ${expanded ? 'rotate-90' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        )}
        {isLeaf && <span className="w-3"></span>}

        {/* 节点图标 */}
        <span className="flex-shrink-0 opacity-70">
          <NodeIcon type={nodeType} />
        </span>

        {/* 节点名称 */}
        <span className="truncate">{node.name}</span>

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
              key={child.uri}
              node={child}
              nodeType={childType}
              level={level + 1}
              cache={cache}
              selectedUri={selectedUri}
              onSelect={onSelect}
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
 * 功能：
 * - 逐级懒加载子节点
 * - 知识点节点点击触发选中
 * - 已展开节点数据缓存
 * - 加载失败重试
 * - 节点类型图标区分
 */
function TextbookTree({ selectedUri, onSelect }) {
  const [textbooks, setTextbooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // 缓存：{ uri: [children] }
  const [cache] = useState({})

  // 加载教材根节点
  const loadTextbooks = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await kgApi.getTextbooks()
      setTextbooks(Array.isArray(result) ? result : [])
    } catch (err) {
      setError(err.message || '加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  // 缓存失效：切换教材时清空
  const handleTextbookChange = useCallback(() => {
    Object.keys(cache).forEach((key) => delete cache[key])
    loadTextbooks()
  }, [cache, loadTextbooks])

  // 首次加载
  const handleRetry = async () => {
    await loadTextbooks()
  }

  return (
    <div className="flex flex-col h-full bg-base-200">
      {/* 标题栏 */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-base-300 bg-base-100">
        <h2 className="text-sm font-semibold">教材导航</h2>
        <button
          className="btn btn-ghost btn-xs"
          onClick={handleTextbookChange}
          title="刷新教材列表"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
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
        {!loading && !error && textbooks.length > 0 && (
          <ul role="tree" className="space-y-0.5">
            {textbooks.map((textbook) => (
              <TreeNode
                key={textbook.uri}
                node={textbook}
                nodeType={NODE_TYPES.TEXTBOOK}
                cache={cache}
                selectedUri={selectedUri}
                onSelect={onSelect}
              />
            ))}
          </ul>
        )}

        {/* 空状态 */}
        {!loading && !error && textbooks.length === 0 && (
          <div className="text-center py-8 text-base-content/50 text-sm">
            暂无教材数据
          </div>
        )}
      </div>
    </div>
  )
}

export default TextbookTree
