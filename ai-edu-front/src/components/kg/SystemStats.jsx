import { useState, useCallback, useEffect } from 'react'
import { kgApi } from '@/api/modules/kg'

/**
 * 统计卡片
 */
function StatCard({ icon, label, value, color = 'primary' }) {
  return (
    <div className="flex items-center gap-3 bg-base-100 rounded-lg border border-base-300 p-3">
      <div className={`p-2 rounded-lg bg-${color}/10`}>
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
    <div className="bg-base-100 rounded-lg border border-base-300 p-3">
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
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
            label="教材数"
            value={stats?.totalTextbooks}
          />
          <StatCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
            }
            label="章节数"
            value={stats?.totalChapters}
          />
          <StatCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            label="小节数"
            value={stats?.totalSections}
          />
          <StatCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
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
