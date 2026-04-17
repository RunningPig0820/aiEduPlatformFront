import { useCallback, useState } from 'react'
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
import { kgApi } from '@/api/modules/kg'

/**
 * 自定义节点：教材知识点
 */
function TextbookKPNode({ data }) {
  return (
    <div className="bg-primary/10 border-2 border-primary rounded-lg px-4 py-2 min-w-[140px] shadow-md hover:shadow-lg transition-shadow">
      <Handle type="target" position={Position.Left} className="!bg-primary" />
      <div className="flex flex-col gap-1">
        <span className="badge badge-primary badge-xs">教材知识点</span>
        <span className="text-sm font-semibold text-primary truncate max-w-[120px]" title={data.label}>
          {data.label}
        </span>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-primary" />
    </div>
  )
}

/**
 * 自定义节点：知识点
 */
function KPNode({ data }) {
  return (
    <div className="bg-base-100 border-2 border-base-300 rounded-lg px-4 py-2 min-w-[120px] shadow-sm hover:shadow-md hover:border-secondary transition-all">
      <Handle type="target" position={Position.Left} className="!bg-secondary" />
      <div className="flex flex-col gap-1">
        <span className="badge badge-ghost badge-xs">知识点</span>
        <span className="text-sm font-medium truncate max-w-[100px]" title={data.label}>
          {data.label}
        </span>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-secondary" />
    </div>
  )
}

// 节点类型映射
const nodeTypes = {
  textbook_kp: TextbookKPNode,
  kp: KPNode,
}

/**
 * Tooltip 组件
 */
function NodeTooltip({ node, show }) {
  if (!show || !node) return null
  return (
    <div className="absolute z-50 px-3 py-2 bg-neutral text-neutral-content text-xs rounded shadow-lg pointer-events-none">
      <div className="font-semibold">{node.data.label}</div>
      <div className="opacity-70">{node.type === 'textbook_kp' ? '教材知识点' : '知识点'}</div>
    </div>
  )
}

/**
 * 知识图谱关系图组件
 *
 * 功能：
 * - React Flow 渲染关系图谱
 * - 支持 useNodesState/useEdgesState 优化
 * - 节点点击选中通知父组件
 * - 节点 Tooltip 悬停提示
 * - 加载状态和空数据提示
 * - 节点过多降级方案（简化视图）
 */
function KnowledgeGraph({ selectedPoint, onNodeSelect }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [simplified, setSimplified] = useState(false)

  // 加载图谱数据
  const loadGraph = useCallback(async (uri) => {
    if (!uri) return

    setLoading(true)
    setError(null)
    try {
      const data = await kgApi.getGraphData(uri)
      const { nodes: rawNodes, edges: rawEdges } = data || { nodes: [], edges: [] }

      // 空数据处理
      if (!rawNodes || rawNodes.length === 0) {
        setNodes([])
        setEdges([])
        return
      }

      // 降级：简化视图（仅显示 Top 10 关联节点）
      let displayNodes = rawNodes
      let displayEdges = rawEdges
      if (simplified && rawNodes.length > 10) {
        const topNodes = rawNodes.slice(0, 11) // 保留选中节点 + Top 10
        const topIds = new Set(topNodes.map((n) => n.id))
        displayNodes = topNodes
        displayEdges = rawEdges.filter((e) => topIds.has(e.source) && topIds.has(e.target))
      }

      // 转换为 React Flow 节点格式
      const flowNodes = displayNodes.map((node, index) => ({
        id: node.id,
        type: node.type || 'kp',
        data: { label: node.label, ...node.data },
        position: node.position || {
          x: 200 + (index % 3) * 250,
          y: 50 + Math.floor(index / 3) * 150,
        },
      }))

      // 转换为 React Flow 边格式
      const flowEdges = displayEdges.map((edge, index) => ({
        id: edge.id || `edge-${index}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 16,
          height: 16,
          color: '#94a3b8',
        },
        style: {
          stroke: '#94a3b8',
          strokeWidth: 1.5,
        },
        labelStyle: {
          fill: '#64748b',
          fontSize: 11,
        },
      }))

      setNodes(flowNodes)
      setEdges(flowEdges)
    } catch (err) {
      setError(err.message || '加载失败')
      setNodes([])
      setEdges([])
    } finally {
      setLoading(false)
    }
  }, [simplified])

  // 选中知识点变化时重新加载
  const handlePointChange = useCallback(async () => {
    if (selectedPoint?.uri) {
      await loadGraph(selectedPoint.uri)
    }
  }, [selectedPoint?.uri, loadGraph])

  // 当 selectedPoint 变化时触发加载
  if (selectedPoint?.uri) {
    // 使用 useEffect 会导致不必要的重渲染，这里用状态检查
    const _prevUri = (KnowledgeGraph._prevUri ||= null)
    if (_prevUri !== selectedPoint.uri) {
      KnowledgeGraph._prevUri = selectedPoint.uri
      handlePointChange()
    }
  }

  // 节点点击选中
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
      await loadGraph(selectedPoint.uri)
    }
  }

  // 切换简化视图
  const handleToggleSimplified = () => {
    setSimplified(!simplified)
    if (selectedPoint?.uri) {
      loadGraph(selectedPoint.uri)
    }
  }

  return (
    <div className="h-full w-full relative">
      {/* Tooltip */}
      <NodeTooltip node={hoveredNode} show={!!hoveredNode} />

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
            <button className="btn btn-error btn-sm" onClick={handleRetry}>
              重试
            </button>
          </div>
        </div>
      )}

      {/* 空状态 */}
      {!loading && !error && nodes.length === 0 && selectedPoint && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-100 z-10">
          <div className="text-center text-base-content/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-3 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <p className="text-sm">当前知识点暂无关联图谱数据</p>
          </div>
        </div>
      )}

      {/* 未选中知识点 */}
      {!loading && !error && !selectedPoint && nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-base-100 z-10">
          <div className="text-center text-base-content/50">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-3 opacity-50"
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
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{
          type: 'default',
        }}
      >
        <Background gap={16} size={1} />
        <Controls />

        {/* 节点数量提示 + 简化视图开关 */}
        {nodes.length > 10 && (
          <Panel position="bottom-right">
            <div className="flex items-center gap-2 bg-base-100/90 backdrop-blur shadow-sm rounded px-2 py-1 text-xs">
              <span className="text-base-content/60">
                {nodes.length} 个节点
              </span>
              <label className="swap swap-sm">
                <input type="checkbox" checked={simplified} onChange={handleToggleSimplified} />
                <span className="swap-off">简化视图</span>
                <span className="swap-on">已简化</span>
              </label>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  )
}

export default KnowledgeGraph
