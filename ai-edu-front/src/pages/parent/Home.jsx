import { useAuth } from '../../hooks/useAuth'
import StatCard from '../../components/common/StatCard'
import { User, CheckCircle, AlertTriangle, MessageSquare, Users, Bell } from 'lucide-react'

export function ParentHome() {
  const { user } = useAuth()

  const stats = {
    childrenCount: 2,
    completionRate: 92,
    attentionCount: 3,
    unreadMessages: 5
  }

  const children = [
    { id: 1, name: '张小明', grade: '高三', avgScore: 85, errorCount: 5, studyHours: 12 },
    { id: 2, name: '张小红', grade: '高一', avgScore: 92, errorCount: 2, studyHours: 8 }
  ]

  const recentActivities = [
    { id: 1, type: 'homework', content: '张小明完成了数学作业，得分 92 分', time: '今天 14:30' },
    { id: 2, type: 'error', content: '张小红在英语单元测试中有 2 道错题', time: '今天 11:20' },
    { id: 3, type: 'homework', content: '张小红完成了语文作文', time: '昨天 20:15' }
  ]

  // 家长端统一角色色：warning (琥珀色)
  return (
    <div className="page-enter space-y-6">
      <h1 className="text-2xl font-bold">欢迎回来，{user?.realName || '家长'}！</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="关联孩子"
          value={stats.childrenCount}
          color="warning"
          icon={<User size={24} strokeWidth={1.5} />}
        />
        <StatCard
          title="作业完成率"
          value={`${stats.completionRate}%`}
          color="warning"
          icon={<CheckCircle size={24} strokeWidth={1.5} />}
        />
        <StatCard
          title="待关注"
          value={stats.attentionCount}
          color="warning"
          icon={<AlertTriangle size={24} strokeWidth={1.5} />}
        />
        <StatCard
          title="未读消息"
          value={stats.unreadMessages}
          color="warning"
          icon={<MessageSquare size={24} strokeWidth={1.5} />}
        />
      </div>

      {/* 功能模块 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 孩子学习情况 */}
        <div className="card bg-base-100 rounded-xl shadow-card-elevated border border-base-200">
          <div className="card-body p-5">
            <h2 className="card-title mb-3">
              <Users size={20} className="text-warning" />
              孩子学习情况
            </h2>
            <div className="space-y-4">
              {children.map(child => (
                <div key={child.id} className="p-4 rounded-lg border border-base-200 bg-base-200/50 hover:bg-base-200 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold">{child.name}</span>
                    <span className="badge badge-warning badge-sm">{child.grade}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="text-center p-2 rounded-lg bg-base-100">
                      <div className="font-bold text-warning">{child.avgScore}</div>
                      <div className="text-xs text-base-content/50">平均分</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-base-100">
                      <div className="font-bold text-warning">{child.errorCount}</div>
                      <div className="text-xs text-base-content/50">错题数</div>
                    </div>
                    <div className="text-center p-2 rounded-lg bg-base-100">
                      <div className="font-bold text-warning">{child.studyHours}h</div>
                      <div className="text-xs text-base-content/50">学习时长</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 最近动态 */}
        <div className="card bg-base-100 rounded-xl shadow-card-elevated border border-base-200">
          <div className="card-body p-5">
            <h2 className="card-title mb-3">
              <Bell size={20} className="text-warning" />
              最近动态
            </h2>
            <div className="space-y-2">
              {recentActivities.map(activity => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg border-l-[3px] border-warning/30 bg-base-200 hover:bg-base-300/50 transition-colors"
                >
                  <div className="badge badge-warning badge-sm">
                    {activity.type === 'homework' ? '作业' : '错题'}
                  </div>
                  <div>
                    <p>{activity.content}</p>
                    <p className="text-sm text-base-content/50">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParentHome
