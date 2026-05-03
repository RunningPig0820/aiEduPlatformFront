import { useCallback, useState, useEffect, useRef } from 'react'
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
  Panel,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import dagre from 'dagre'
import { kgApi } from '@/api/modules/kg'

// ==================== 节点类型视觉配置 ====================
// 类型说明见 docs/fanan.md
// expand: 'structure'→可展开结构关系  'knowledge'→可展开知识关系  'both'→两者都可  null→不可展开
const NODE_STYLES = {
  textbook:    { label: '教材',     border: 'border-red-400',      bg: 'bg-red-50',      badge: 'badge-error',     textColor: 'text-red-700',     expand: 'structure' },
  chapter:     { label: '章节',     border: 'border-orange-400',   bg: 'bg-orange-50',   badge: 'badge-warning',   textColor: 'text-orange-700',  expand: 'structure' },
  section:     { label: '小节',     border: 'border-amber-400',    bg: 'bg-amber-50',    badge: 'badge-warning',   textColor: 'text-amber-700',   expand: 'structure' },
  textbook_kp: { label: '教材知识点', border: 'border-blue-400',    bg: 'bg-blue-50',    badge: 'badge-info',     textColor: 'text-blue-700',   expand: 'both' },
  concept:     { label: 'EduKG概念', border: 'border-amber-400',  bg: 'bg-amber-50',   badge: 'badge-warning',  textColor: 'text-amber-700',  expand: 'knowledge' },
  class:       { label: '概念类',    border: 'border-purple-400',   bg: 'bg-purple-50',   badge: 'badge-secondary', textColor: 'text-purple-700',  expand: 'knowledge' },
  statement:   { label: '定义/定理', border: 'border-emerald-400', bg: 'bg-emerald-50', badge: 'badge-success',   textColor: 'text-emerald-700', expand: 'knowledge' },
  kp:          { label: '知识点', border: 'border-pink-400',     bg: 'bg-pink-50',     badge: 'badge-accent',    textColor: 'text-pink-700',    expand: null },
  unknown:     { label: '未知',     border: 'border-gray-300',     bg: 'bg-gray-50',     badge: 'badge-ghost',     textColor: 'text-gray-600',    expand: null },
}

// ==================== 边样式 ====================
// 结构关系（虚线）：IN_UNIT, CONTAINS
// 知识关系（实线）：MATCHES_KG, RELATED_TO, BELONGS_TO 等
function getEdgeStyle(label) {
  if (!label) return { stroke: '#94a3b8', strokeWidth: 1.5 }
  const upper = label.toUpperCase()
  if (['IN_UNIT', 'CONTAINS'].includes(upper)) {
    return { stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '6,3' }
  }
  return { stroke: '#f59e0b', strokeWidth: 1.5 }
}

function getEdgeColor(label) {
  if (!label) return '#94a3b8'
  const upper = label.toUpperCase()
  if (['IN_UNIT', 'CONTAINS'].includes(upper)) return '#6366f1'
  return '#f59e0b'
}

// ==================== 自定义节点组件 ====================
function KGNode({ id, data, type }) {
  const style = NODE_STYLES[type] || NODE_STYLES.unknown
  const isExpanded = data.isExpanded
  const expandType = data.expandType
  const can = style.expand // 'structure' | 'knowledge' | 'both' | null
  const canStructure = can === 'structure' || can === 'both'
  const canKnowledge = can === 'knowledge' || can === 'both'
  const noExpand = !canStructure && !canKnowledge // 叶子节点：不显示按钮区

  return (
    <div className={`relative border-2 rounded-lg px-3 py-2 min-w-[110px] shadow-sm hover:shadow-lg transition-shadow duration-200 ${style.border} ${style.bg}`}>
      {/* 左侧连接点：跨列边目标端（如 章节←教材） */}
      <Handle type="target" position={Position.Left} id="left" className="!bg-gray-400" />
      {/* 上侧连接点：同列边目标端（如同类型节点下→上连接） */}
      <Handle type="target" position={Position.Top} id="top" className="!bg-gray-400" />

      {/* 节点类型标签 + 名称 */}
      <div className="flex flex-col gap-0.5">
        <span className={`badge badge-xs ${style.badge}`}>{style.label}</span>
        <span className={`text-sm font-semibold truncate max-w-[130px] ${style.textColor}`} title={data.label}>
          {data.label}
        </span>
      </div>

      {/* 展开按钮区：不支持的类型不显示按钮 */}
      {!noExpand && (
        <div className="flex gap-1 mt-1.5 pt-1.5 border-t border-base-200 justify-center">
          {/* 结构按钮 */}
          {canStructure ? (
            <button
              className="btn btn-xs bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary text-[10px] h-5 min-h-0 px-1.5 rounded-md"
              onClick={(e) => { e.stopPropagation(); data.onExpand?.(id, 'structure') }}
              title="展开结构关系（IN_UNIT, CONTAINS）"
            >
              {isExpanded && (expandType === 'structure' || expandType === 'both') ? '↻结构' : '+结构'}
            </button>
          ) : (
            <span className="btn btn-xs bg-base-100 border-base-200 text-base-content/20 text-[10px] h-5 min-h-0 px-1.5 cursor-not-allowed rounded-md" title="此类型不支持结构展开">+结构</span>
          )}

          {/* 知识按钮 */}
          {canKnowledge ? (
            <button
              className="btn btn-xs bg-warning/5 hover:bg-warning/10 border-warning/20 text-warning text-[10px] h-5 min-h-0 px-1.5 rounded-md"
              onClick={(e) => { e.stopPropagation(); data.onExpand?.(id, 'knowledge') }}
              title="展开知识关系（MATCHES_KG, RELATED_TO 等）"
            >
              {isExpanded && (expandType === 'knowledge' || expandType === 'both') ? '↻知识' : '+知识'}
            </button>
          ) : (
            <span className="btn btn-xs bg-base-100 border-base-200 text-base-content/20 text-[10px] h-5 min-h-0 px-1.5 cursor-not-allowed rounded-md" title="此类型不支持知识展开">+知识</span>
          )}

          {isExpanded && data.hasMore && (
            <button
              className="btn btn-xs bg-base-100 hover:bg-base-200 border-base-200 text-base-content/60 text-[10px] h-5 min-h-0 px-1.5 rounded-md"
              onClick={(e) => { e.stopPropagation(); data.onLoadMore?.(id) }}
              title="加载更多"
            >
              ···
            </button>
          )}
        </div>
      )}

      {/* 右侧连接点：跨列边源端（如 教材→章节） */}
      <Handle type="source" position={Position.Right} id="right" className="!bg-gray-400" />
      {/* 下侧连接点：同列边源端（如同类型节点上→下连接） */}
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-gray-400" />
    </div>
  )
}

// 注册所有节点类型
const NODE_TYPE_KEYS = Object.keys(NODE_STYLES)
const nodeTypes = {}
NODE_TYPE_KEYS.forEach((t) => { nodeTypes[t] = KGNode })

// ==================== Dagre 自动布局 ====================
const NODE_WIDTH = 170
const NODE_HEIGHT = 90
const COLUMN_GAP = 300 // 每列间隔

// 固定流水线列位：每种节点类型占一个固定的 x 列
// 教材 → 章节 → 小节 → 教材知识点 → EduKG概念 → 定义/定理 → 概念类
const TYPE_COLUMN = {
  textbook: 0,
  chapter: 1,
  section: 2,
  textbook_kp: 3,
  kp: 3, // fallback，与 textbook_kp 同列
  concept: 4,
  statement: 5,
  class: 6,
}

function applyDagreLayout(nodes, edges, direction = 'LR') {
  if (nodes.length === 0) return nodes

  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: direction, nodesep: 100, ranksep: 200 })

  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  })

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  dagre.layout(g)

  // 将 dagre 算出的 y 坐标保留，x 坐标按类型固定到对应列
  return nodes.map((node) => {
    const pos = g.node(node.id)
    if (!pos) return node
    const col = TYPE_COLUMN[node.type] ?? -1
    return {
      ...node,
      position: {
        x: col >= 0 ? col * COLUMN_GAP : pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    }
  })
}

/**
 * 知识图谱关系图组件
 *
 * 功能：
 * - React Flow 渲染关系图谱
 * - 节点点击展开（结构关系 / 知识关系）像 Neo4j 客户端
 * - 支持多种节点类型（教材/章/节/知识点/概念/陈述/班级）不同颜色
 * - 边标签区分结构关系和知识关系
 * - hasMore 分页加载
 * - 加载状态、空数据提示、错误处理
 * - 简化视图开关
 */
function KnowledgeGraph({ selectedPoint, onNodeSelect }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const reactFlowInstance = useRef(null)
  const [layoutVersion, setLayoutVersion] = useState(0)
  const [simplified, setSimplified] = useState(false)
  const [toast, setToast] = useState(null) // { message, type } | null

  // toast 自动消失
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  // 每次图谱布局更新后自动缩放适配视口
  useEffect(() => {
    if (layoutVersion > 0 && reactFlowInstance.current) {
      const timer = setTimeout(() => {
        reactFlowInstance.current?.fitView({ padding: 0.2, duration: 300 })
      }, 80)
      return () => clearTimeout(timer)
    }
  }, [layoutVersion])

  // 始终保持最新 nodes/edges 的引用，避免回调中的闭包过期问题
  const nodesRef = useRef(nodes)
  nodesRef.current = nodes
  const edgesRef = useRef(edges)
  edgesRef.current = edges

  // 记录每个节点的展开状态: Map<nodeId, { type: 'structure'|'knowledge'|'both', hasMore: bool }>
  const expandedStateRef = useRef(new Map())
  // 记录当前加载的起始节点 URI，用于切换知识点时重置展开状态
  const rootUriRef = useRef(null)
  // 防止并发展开同一个节点
  const expandingRef = useRef(new Set())

  // 将后端原始数据转换为 React Flow 格式（不含回调，回调通过 attachCallbacks 注入）
  // existingTypeMap: { [nodeId]: type } — 已存在的节点类型，用于判断边的 src/dst 是否同列
  const toFlowFormat = useCallback((rawNodes, rawEdges, existingTypeMap = {}) => {
    // 构建完整的节点类型查找表
    const typeMap = { ...existingTypeMap }
    rawNodes.forEach((n) => { typeMap[n.id] = n.type || 'unknown' })

    const flowNodes = rawNodes.map((node, index) => {
      const nodeId = node.id
      const expandState = expandedStateRef.current.get(nodeId)
      return {
        id: nodeId,
        type: typeMap[nodeId] || node.type || 'unknown',
        data: {
          label: node.label || node.data?.name || node.id,
          uri: node.data?.uri || nodeId,
          ...node.data,
          isExpanded: !!expandState,
          expandType: expandState?.type,
          hasMore: expandState?.hasMore || false,
        },
        position: node.position || {
          x: 200 + (index % 3) * 250,
          y: 50 + Math.floor(index / 3) * 150,
        },
      }
    })

    const flowEdges = rawEdges.map((edge) => {
      const color = getEdgeColor(edge.label)
      const srcType = typeMap[edge.source]
      const tgtType = typeMap[edge.target]
      const srcCol = TYPE_COLUMN[srcType] ?? -1
      const tgtCol = TYPE_COLUMN[tgtType] ?? -1

      // 后端边方向可能与流水线方向相反（如 IN_UNIT: TextbookKP→Section 在流水线中应为 Section→TextbookKP）
      // 根据列位置判断：如果 src 列 > tgt 列，交换 source/target 使边从左向右流动
      const needSwap = srcCol >= 0 && tgtCol >= 0 && srcCol > tgtCol
      const finalSource = needSwap ? edge.target : edge.source
      const finalTarget = needSwap ? edge.source : edge.target
      const finalSrcCol = needSwap ? tgtCol : srcCol
      const finalTgtCol = needSwap ? srcCol : tgtCol
      const sameColumn = finalSrcCol === finalTgtCol && finalSrcCol >= 0

      // 边 ID 基于后端原始 ID，保持稳定（不受 swap 影响）
      const edgeId = edge.id || `${edge.source}→${edge.target}${edge.label ? `_${edge.label}` : ''}`
      return {
        id: edgeId,
        source: finalSource,
        target: finalTarget,
        sourceHandle: sameColumn ? 'bottom' : 'right',
        targetHandle: sameColumn ? 'top' : 'left',
        label: edge.label,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color,
        },
        style: getEdgeStyle(edge.label),
        labelStyle: { fill: color, fontSize: 10, fontWeight: 500 },
        labelBgStyle: { fill: '#fff', fillOpacity: 0.8 },
        labelBgPadding: [4, 2],
        labelBgBorderRadius: 2,
      }
    })

    return { flowNodes, flowEdges }
  }, [])

  // 将 onExpand / onLoadMore 注入到节点 data 中（使用 ref 保持回调始终最新）
  const attachCallbacks = useCallback((nodeList) => {
    return nodeList.map((n) => ({
      ...n,
      data: {
        ...n.data,
        onExpand: expandDispatcherRef.current,
        onLoadMore: loadMoreDispatcherRef.current,
      },
    }))
  }, [])

  // 稳定的展开调度器（通过 ref 调用最新的 handleExpand）
  const expandDispatcherRef = useRef(null)
  const loadMoreDispatcherRef = useRef(null)

  // 加载图谱数据（初始加载或切换知识点）
  const loadGraph = useCallback(
    async (uri) => {
      setLoading(true)
      setError(null)
      try {
        const data = await kgApi.getGraphData(uri)
        const { nodes: rawNodes, edges: rawEdges } = data || { nodes: [], edges: [] }

        if (!rawNodes || rawNodes.length === 0) {
          // 如果当前已有图谱数据，不要清空，给一个 toast 提示即可
          if (nodesRef.current.length > 0) {
            setToast({ message: '当前知识点暂无关联图谱数据', type: 'info' })
          } else {
            setNodes([])
            setEdges([])
          }
          return
        }

        let displayNodes = rawNodes
        let displayEdges = rawEdges
        if (simplified && rawNodes.length > 10) {
          const topNodes = rawNodes.slice(0, 11)
          const topIds = new Set(topNodes.map((n) => n.id))
          displayNodes = topNodes
          displayEdges = rawEdges.filter((e) => topIds.has(e.source) && topIds.has(e.target))
        }

        const { flowNodes, flowEdges } = toFlowFormat(displayNodes, displayEdges)
        const nodesWithCallbacks = attachCallbacks(flowNodes)
        const layoutedNodes = applyDagreLayout(nodesWithCallbacks, flowEdges)
        setNodes(layoutedNodes); setLayoutVersion(v => v + 1)
        setEdges(flowEdges)
      } catch (err) {
        // 加载出错时也保留现有图谱，仅显示 toast
        if (nodesRef.current.length > 0) {
          setToast({ message: err.message || '加载失败', type: 'error' })
        } else {
          setError(err.message || '加载失败')
          setNodes([])
          setEdges([])
        }
      } finally {
        setLoading(false)
      }
    },
    [simplified, toFlowFormat, attachCallbacks]
  )

  // 展开节点关系（通过 ref 读取最新 nodes/edges，避免闭包过期）
  const handleExpand = useCallback(
    async (nodeId, expandType) => {
      if (expandingRef.current.has(nodeId)) return

      const currentNodes = nodesRef.current
      const currentEdges = edgesRef.current
      const node = currentNodes.find((n) => n.id === nodeId)
      if (!node) return

      // 检查节点类型是否支持该展开类型
      const nodeStyle = NODE_STYLES[node.type]
      const expandCaps = nodeStyle?.expand
      if (!expandCaps) return // 不支持任何展开
      if (expandType === 'structure' && expandCaps !== 'structure' && expandCaps !== 'both') return
      if (expandType === 'knowledge' && expandCaps !== 'knowledge' && expandCaps !== 'both') return

      // 如果已经展开过同类型，跳过
      const currentExpand = expandedStateRef.current.get(nodeId)
      if (currentExpand && (currentExpand.type === expandType || currentExpand.type === 'both')) {
        return
      }

      const nodeUri = node.data?.uri || nodeId

      expandingRef.current.add(nodeId)
      try {
        const api = expandType === 'structure' ? kgApi.expandStructure : kgApi.expandKnowledge
        const data = await api(nodeUri)

        const { nodes: newRawNodes, edges: newRawEdges, hasMore } = data || { nodes: [], edges: [], hasMore: false }

        if (!newRawNodes || newRawNodes.length === 0) {
          const prev = expandedStateRef.current.get(nodeId) || {}
          const newState = {
            type: prev.type === expandType ? prev.type : prev.type ? 'both' : expandType,
            hasMore: false,
          }
          expandedStateRef.current.set(nodeId, newState)
          // 只更新源节点，不扫全量
          setNodes((prevNodes) =>
            prevNodes.map((n) =>
              n.id === nodeId
                ? { ...n, data: { ...n.data, isExpanded: true, expandType: newState.type, hasMore: false } }
                : n
            )
          )
          return
        }

        // 过滤已存在的节点/边（用后端 Neo4j ID 去重）
        const existingNodeIds = new Set(currentNodes.map((n) => n.id))
        const existingEdgeIds = new Set(currentEdges.map((e) => e.id))
        const uniqueNewNodes = newRawNodes.filter((n) => !existingNodeIds.has(n.id))
        const uniqueNewEdges = newRawEdges.filter((e) => !existingEdgeIds.has(e.id))

        // 更新展开状态
        const prev = expandedStateRef.current.get(nodeId) || {}
        const newExpandState = {
          type: prev.type === expandType ? prev.type : prev.type ? 'both' : expandType,
          hasMore: hasMore || false,
        }
        expandedStateRef.current.set(nodeId, newExpandState)

        // 构建已有节点的类型映射，供 toFlowFormat 判断边的同列/跨列
        const existingTypeMap = {}
        currentNodes.forEach((n) => { existingTypeMap[n.id] = n.type })

        const { flowNodes: newFlowNodes, flowEdges: newFlowEdges } = toFlowFormat(uniqueNewNodes, uniqueNewEdges, existingTypeMap)

        // 更新源节点展开状态
        const updatedOldNodes = currentNodes.map((n) =>
          n.id === nodeId
            ? { ...n, data: { ...n.data, isExpanded: true, expandType: newExpandState.type, hasMore: newExpandState.hasMore } }
            : n
        )
        // 全局 dagre LR 统一排版，形成 教材→章节→小节→教材知识点→概念→定理 流水线
        const allNodes = [...updatedOldNodes, ...attachCallbacks(newFlowNodes)]
        const allEdges = [...currentEdges, ...newFlowEdges]
        const layoutedNodes = applyDagreLayout(allNodes, allEdges, 'LR')
        setNodes(layoutedNodes); setLayoutVersion((v) => v + 1)
        setEdges(allEdges)
      } catch (err) {
        console.error('Expand failed:', err.message)
      } finally {
        expandingRef.current.delete(nodeId)
      }
    },
    [toFlowFormat, attachCallbacks]
  )

  // 加载更多（hasMore 为 true 时）
  const handleLoadMore = useCallback(
    async (nodeId) => {
      const currentNodes = nodesRef.current
      const currentEdges = edgesRef.current
      const node = currentNodes.find((n) => n.id === nodeId)
      if (!node) return

      const expandState = expandedStateRef.current.get(nodeId)
      if (!expandState || !expandState.hasMore) return

      const nodeUri = node.data?.uri || nodeId
      try {
        const apis = []
        if (expandState.type === 'both' || expandState.type === 'structure') {
          apis.push(kgApi.expandStructure)
        }
        if (expandState.type === 'both' || expandState.type === 'knowledge') {
          apis.push(kgApi.expandKnowledge)
        }

        let allNewNodes = []
        let allNewEdges = []
        let anyHasMore = false

        for (const api of apis) {
          const data = await api(nodeUri, 50)
          if (data?.nodes) allNewNodes = allNewNodes.concat(data.nodes)
          if (data?.edges) allNewEdges = allNewEdges.concat(data.edges)
          if (data?.hasMore) anyHasMore = true
        }

        const existingNodeIds = new Set(currentNodes.map((n) => n.id))
        const existingEdgeIds = new Set(currentEdges.map((e) => e.id))
        const uniqueNewNodes = allNewNodes.filter((n) => !existingNodeIds.has(n.id))
        const uniqueNewEdges = allNewEdges.filter((e) => !existingEdgeIds.has(e.id))

        if (uniqueNewNodes.length === 0 && uniqueNewEdges.length === 0) {
          expandedStateRef.current.set(nodeId, { ...expandState, hasMore: false })
          setNodes((prevNodes) =>
            prevNodes.map((n) =>
              n.id === nodeId ? { ...n, data: { ...n.data, hasMore: false } } : n
            )
          )
          return
        }

        // 构建已有节点的类型映射，供 toFlowFormat 判断边的同列/跨列
        const existingTypeMapLM = {}
        currentNodes.forEach((n) => { existingTypeMapLM[n.id] = n.type })

        const { flowNodes: newFlowNodes, flowEdges: newFlowEdges } = toFlowFormat(uniqueNewNodes, uniqueNewEdges, existingTypeMapLM)

        const newExpandState = { ...expandState, hasMore: anyHasMore }
        expandedStateRef.current.set(nodeId, newExpandState)

        const updatedOldNodes = currentNodes.map((n) =>
          n.id === nodeId ? { ...n, data: { ...n.data, hasMore: anyHasMore } } : n
        )
        const allNodes = [...updatedOldNodes, ...attachCallbacks(newFlowNodes)]
        const allEdges = [...currentEdges, ...newFlowEdges]
        const layoutedNodes = applyDagreLayout(allNodes, allEdges, 'LR')
        setNodes(layoutedNodes); setLayoutVersion((v) => v + 1)
        setEdges(allEdges)
      } catch (err) {
        console.error('Load more failed:', err.message)
      }
    },
    [toFlowFormat, attachCallbacks]
  )

  // 保持调度器 ref 始终指向最新的回调
  expandDispatcherRef.current = handleExpand
  loadMoreDispatcherRef.current = handleLoadMore

  // 选中知识点变化时重新加载图谱
  useEffect(() => {
    if (selectedPoint?.uri && selectedPoint.uri !== rootUriRef.current) {
      rootUriRef.current = selectedPoint.uri
      // 清空展开状态
      expandedStateRef.current.clear()
      loadGraph(selectedPoint.uri)
    }
  }, [selectedPoint?.uri, loadGraph])

  // 节点点击选中（通知父组件展示详情）
  const handleNodeClick = useCallback(
    (_event, clickedNode) => {
      if (clickedNode?.data) {
        onNodeSelect?.(clickedNode.data)
      }
    },
    [onNodeSelect]
  )

  // 节点鼠标悬停
  const handleNodeMouseEnter = useCallback((_event, node) => {
    setHoveredNode(node)
  }, [])

  const handleNodeMouseLeave = useCallback(() => {
    setHoveredNode(null)
  }, [])

  // 重试
  const handleRetry = async () => {
    if (selectedPoint?.uri) {
      expandedStateRef.current.clear()
      await loadGraph(selectedPoint.uri)
    }
  }

  // 切换简化视图
  const handleToggleSimplified = () => {
    setSimplified((prev) => !prev)
  }

  // 重新布局：dagre 重排所有节点（修复手动拖乱后的布局）
  const handleReLayout = useCallback(() => {
    if (nodes.length === 0) return
    const layouted = applyDagreLayout(
      nodes.map((n) => ({ ...n, position: n.position })), // 浅拷贝
      edges,
      'LR'
    )
    setNodes(layouted)
    setLayoutVersion((v) => v + 1)
  }, [nodes, edges])

  // 当 simplified 变化时重新加载（仅在已有数据时）
  useEffect(() => {
    if (selectedPoint?.uri && rootUriRef.current) {
      expandedStateRef.current.clear()
      loadGraph(selectedPoint.uri)
    }
  }, [simplified]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="h-full w-full relative">
      {/* Tooltip */}
      {hoveredNode && (
        <div className="absolute z-50 px-3 py-2 bg-neutral text-neutral-content text-xs rounded shadow-lg pointer-events-none top-2 left-2">
          <div className="font-semibold">{hoveredNode.data.label}</div>
          <div className="opacity-70">
            {NODE_STYLES[hoveredNode.type]?.label || hoveredNode.type || '未知'}
          </div>
          <div className="opacity-50 text-[10px] mt-0.5">{hoveredNode.data.uri}</div>
        </div>
      )}

      {/* 非阻塞 Toast 提示 */}
      {toast && (
        <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-lg shadow-lg text-sm transition-all animate-pulse ${
          toast.type === 'error'
            ? 'bg-error/90 text-error-content'
            : 'bg-warning/90 text-warning-content'
        }`}>
          {toast.message}
        </div>
      )}

      {/* 加载中 */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-100/80 z-10">
          <div className="flex flex-col items-center gap-2">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <span className="text-sm text-base-content/60">加载图谱数据...</span>
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-100 z-10">
          <div className="text-center">
            <p className="text-error mb-2">{error}</p>
            <button className="btn btn-error btn-sm" onClick={handleRetry}>重试</button>
          </div>
        </div>
      )}

      {/* 空状态：有选中但无数据 */}
      {!loading && !error && nodes.length === 0 && selectedPoint && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-100 z-10">
          <div className="text-center text-base-content/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-3 opacity-50"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <p className="text-sm">当前知识点暂无关联图谱数据</p>
          </div>
        </div>
      )}

      {/* 空状态：未选中 */}
      {!loading && !error && !selectedPoint && nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-100 z-10">
          <div className="text-center text-base-content/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-3 opacity-50"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path
                strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
            <p className="text-sm">请从左侧选择一个知识点</p>
          </div>
        </div>
      )}

      {/* React Flow 图谱 */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeMouseEnter={handleNodeMouseEnter}
        onNodeMouseLeave={handleNodeMouseLeave}
        nodeTypes={nodeTypes}
        onInit={(instance) => { reactFlowInstance.current = instance }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{ type: 'default' }}
      >
        <Background gap={16} size={1} />
        <Controls />

        {/* 图例 + 节点统计 */}
        <Panel position="bottom-left">
          <div className="bg-base-100/90 backdrop-blur shadow-card-elevated rounded-lg p-2 text-[10px] space-y-1">
            <div className="font-semibold text-xs mb-1">图例</div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-indigo-500" style={{ borderTop: '2px dashed #6366f1' }}></span>
              <span className="text-gray-500">结构关系 (IN_UNIT / CONTAINS)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-amber-500"></span>
              <span className="text-gray-500">知识关系 (MATCHES_KG / RELATED_TO)</span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="badge badge-xs badge-error">教材</span>
              <span className="badge badge-xs badge-info">教材知识点</span>
              <span className="badge badge-xs badge-warning">EduKG概念</span>
              <span className="badge badge-xs badge-success">定义/定理</span>
            </div>
          </div>
        </Panel>

        {/* 工具按钮：节点数量 + 重新布局 + 简化视图 */}
        {nodes.length > 0 && (
          <Panel position="bottom-right">
            <div className="flex items-center gap-2 bg-base-100/90 backdrop-blur shadow-card-elevated rounded-lg px-2 py-1 text-xs">
              <span className="text-base-content/60">{nodes.length} 个节点</span>
              <button className="btn btn-xs btn-ghost text-[10px] h-6 min-h-0 px-1.5" onClick={handleReLayout} title="dagre 重新排版">
                ⟳ 重排
              </button>
              {nodes.length > 10 && (
                <label className="cursor-pointer flex items-center gap-1">
                  <input type="checkbox" className="toggle toggle-xs" checked={simplified} onChange={handleToggleSimplified} />
                  <span className={simplified ? 'text-primary' : 'text-base-content/50'}>简化</span>
                </label>
              )}
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  )
}

export default KnowledgeGraph
