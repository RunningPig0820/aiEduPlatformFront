import { useState, useCallback, useEffect } from 'react'
import { kgApi } from '@/api/modules/kg'
import { BookOpen, FolderOpen, FileText, Zap, Server } from 'lucide-react'

/**
 * 统计卡片
 */
function StatCard({ icon, label, value, color = 'primary' }) {
  return (
    <div className="flex items-center gap-3 bg-base-100 rounded-lg shadow-sm border border-base-200 p-3 hover:shadow transition-shadow">
      <div className={`p-2 rounded-lg bg-${color}/10 ring-1 ring-${color}/20`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-base-content/50">{label}</p>
        <p className="text-lg font-bold">{value ?? '-'}</p>
      </div>
    </div>
  )
}

/**
 * 难度分布条
 */
function DifficultyBar({ distribution }) {
  if (!distribution || Object.keys(distribution).length === 0) return null

  const maxVal = Math.max(...Object.values(distribution), 1)

  return (
    <div className="bg-base-100 rounded-lg shadow-sm border border-base-200 p-3">
      <h4 className="text-xs font-semibold text-base-content/50 mb-2">难度分布</h4>
      <div className="flex flex-col gap-1.5">
        {Object.entries(distribution).map(([level, count]) => (
          <div key={level} className="flex items-center gap-2 text-xs">
            <span className="w-16 truncate">{level}</span>
            <div className="flex-1 bg-base-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all"
                style={{ width: `${(count / maxVal) * 100}%` }}
              ></div>
            </div>
            <span className="w-8 text-right font-medium">{count}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Neo4j 健康状态
 */
function HealthStatus({ health }) {
  if (!health) return null

  return (
    <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full ${health.available ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
      <span className={`inline-block w-2 h-2 rounded-full ${health.available ? 'bg-success' : 'bg-error'}`}></span>
      <Server size={12} />
      <span>Neo4j {health.available ? '连接正常' : '连接异常'}</span>
      {health.responseTimeMs != null && <span className="opacity-60">({health.responseTimeMs}ms)</span>}
    </div>
  )
}

/**
 * 系统统计面板组件
 *
 * 功能：
 * - 展示教材/章节/知识点数量统计
 * - 难度分布可视化
 * - Neo4j 健康状态检查
 */
function SystemStats() {
  const [stats, setStats] = useState(null)
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadStats = useCallback(async () => {
    try {
      const result = await kgApi.getGradeStats('')
      setStats(result)
    } catch (err) {
      console.error('加载统计失败:', err)
    }
  }, [])

  const loadHealth = useCallback(async () => {
    try {
      const result = await kgApi.getNeo4jHealth()
      setHealth(result)
    } catch (err) {
      console.error('加载健康状态失败:', err)
      setHealth({ available: false, message: err.message })
    }
  }, [])

  useEffect(() => {
    Promise.all([loadStats(), loadHealth()]).finally(() => setLoading(false))
  }, [loadStats, loadHealth])

  if (loading) {
    return (
      <div className="flex justify-center py-3">
        <span className="loading loading-spinner loading-xs text-primary"></span>
      </div>
    )
  }

  return (
    <div className="bg-base-200 border-b border-base-300">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="grid grid-cols-5 gap-3 flex-1">
          <StatCard
            icon={<BookOpen size={20} strokeWidth={1.5} className="text-primary" />}
            label="教材数"
            value={stats?.totalTextbooks}
          />
          <StatCard
            icon={<FolderOpen size={20} strokeWidth={1.5} className="text-secondary" />}
            label="章节数"
            value={stats?.totalChapters}
          />
          <StatCard
            icon={<FileText size={20} strokeWidth={1.5} className="text-accent" />}
            label="小节数"
            value={stats?.totalSections}
          />
          <StatCard
            icon={<Zap size={20} strokeWidth={1.5} className="text-info" />}
            label="知识点总数"
            value={stats?.totalKnowledgePoints}
          />
          <div className="flex items-center gap-2">
            <HealthStatus health={health} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStats
