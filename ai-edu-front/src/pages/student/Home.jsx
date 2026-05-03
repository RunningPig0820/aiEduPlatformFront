import { useAuth } from '../../hooks/useAuth'
import StatCard from '../../components/common/StatCard'
import EmptyState from '../../components/common/EmptyState'
import { CheckCircle, AlertTriangle, Zap, Clock, ClipboardList, BookOpen } from 'lucide-react'

export function StudentHome() {
  const { user } = useAuth()

  const stats = {
    completedHomework: 12,
    errorCount: 5,
    masteryPoints: 28,
    studyHours: 36
  }

  const pendingHomework = [
    { id: 1, title: '第三章课后练习', subject: '数学', deadline: '2024-03-15' },
    { id: 2, title: '作文：我的理想', subject: '语文', deadline: '2024-03-16' },
    { id: 3, title: 'Unit 4 单词默写', subject: '英语', deadline: '2024-03-17' }
  ]

  const recentErrors = [
    { id: 1, question: '一元二次方程求解', knowledgePoint: '数学 · 代数' },
    { id: 2, question: '现在完成时用法', knowledgePoint: '英语 · 语法' }
  ]

  // 学生端统一角色色：success (绿色)
  return (
    <div className="page-enter space-y-6">
      <h1 className="text-2xl font-bold">欢迎回来，{user?.realName || '同学'}！</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="已完成作业"
          value={stats.completedHomework}
          color="primary"
          icon={<CheckCircle size={24} strokeWidth={1.5} />}
        />
        <StatCard
          title="错题数"
          value={stats.errorCount}
          color="warning"
          icon={<AlertTriangle size={24} strokeWidth={1.5} />}
        />
        <StatCard
          title="知识点掌握"
          value={stats.masteryPoints}
          color="success"
          icon={<Zap size={24} strokeWidth={1.5} />}
        />
        <StatCard
          title="学习时长"
          value={`${stats.studyHours}h`}
          color="info"
          icon={<Clock size={24} strokeWidth={1.5} />}
        />
      </div>

      {/* 功能模块 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 待完成作业 */}
        <div className="card bg-base-100 rounded-xl shadow-card-elevated border border-base-200">
          <div className="card-body p-5">
            <h2 className="card-title mb-3">
              <ClipboardList size={20} className="text-success" />
              待完成作业
            </h2>
            <div className="space-y-2">
              {pendingHomework.map(homework => (
                <div
                  key={homework.id}
                  className="flex items-center justify-between p-3 rounded-lg border-l-[3px] border-success/30 bg-base-200 hover:bg-base-300/50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{homework.title}</p>
                    <p className="text-sm text-base-content/50">{homework.subject} · 截止: {homework.deadline}</p>
                  </div>
                  <button className="btn btn-sm btn-success btn-ghost text-white hover:scale-95 transition-transform">去完成</button>
                </div>
              ))}
              {pendingHomework.length === 0 && (
                <EmptyState title="暂无待完成作业" description="太棒了，所有作业都已完成！" />
              )}
            </div>
          </div>
        </div>

        {/* 智能错题本 */}
        <div className="card bg-base-100 rounded-xl shadow-card-elevated border border-base-200">
          <div className="card-body p-5">
            <h2 className="card-title mb-3">
              <BookOpen size={20} className="text-success" />
              智能错题本
            </h2>
            <div className="space-y-2">
              {recentErrors.map(error => (
                <div
                  key={error.id}
                  className="flex items-center justify-between p-3 rounded-lg border-l-[3px] border-success/30 bg-base-200 hover:bg-base-300/50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{error.question}</p>
                    <p className="text-sm text-base-content/50">{error.knowledgePoint}</p>
                  </div>
                  <button className="btn btn-sm btn-success btn-ghost text-white hover:scale-95 transition-transform">巩固</button>
                </div>
              ))}
            </div>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-outline btn-sm hover:scale-95 transition-transform">查看全部错题</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentHome
