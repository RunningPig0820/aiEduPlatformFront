import { useState, useCallback } from 'react'
import React from 'react'
import TextbookTree from '@/components/kg/TextbookTree'
import KnowledgeGraph from '@/components/kg/KnowledgeGraph'
import DetailPanel from '@/components/kg/DetailPanel'

/**
 * 全局错误边界
 */
class KnowledgeGraphErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full p-6">
          <div className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto mb-3 text-error opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-error font-medium mb-1">页面渲染异常</p>
            <p className="text-xs text-base-content/50">{this.state.error?.message}</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function KnowledgeGraphPage() {
  const [selectedNode, setSelectedNode] = useState(null)
  const [nodeType, setNodeType] = useState(null)

  // 树节点选中回调（知识点类型）
  const handleTreePointSelect = useCallback((point) => {
    setSelectedNode({ uri: point.uri, label: point.name, type: 'kp', ...point })
    setNodeType('kp')
  }, [])

  // 图谱节点选中回调
  const handleGraphNodeSelect = useCallback((nodeData) => {
    setSelectedNode(nodeData)
    setNodeType(nodeData.type || 'kp')
  }, [])

  return (
    <KnowledgeGraphErrorBoundary>
      <div className="flex flex-col h-full">
        {/* 页面标题 */}
        <div className="px-6 py-3 border-b border-base-300 bg-base-100 flex-shrink-0">
          <h1 className="text-lg font-bold">
            <span className="text-secondary">知识图谱</span>管理
          </h1>
        </div>

        {/* 三栏布局：左侧树 + 中间图谱 + 右侧详情 */}
        <div className="flex flex-1 min-h-0">
          {/* 左侧：树形导航 (280px) */}
          <aside className="w-[280px] border-r border-base-300 bg-base-200 flex-shrink-0">
            <TextbookTree
              selectedUri={selectedNode?.uri}
              onSelect={handleTreePointSelect}
            />
          </aside>

          {/* 中间：关系图谱 (自适应) */}
          <main className="flex-1 bg-base-100 min-w-0">
            <KnowledgeGraph
              selectedPoint={selectedNode}
              onNodeSelect={handleGraphNodeSelect}
            />
          </main>

          {/* 右侧：详情面板 (320px) */}
          <aside className="w-[320px] border-l border-base-300 bg-base-200 flex-shrink-0">
            <DetailPanel
              selectedNode={selectedNode}
              nodeType={nodeType}
            />
          </aside>
        </div>
      </div>
    </KnowledgeGraphErrorBoundary>
  )
}

export default KnowledgeGraphPage
