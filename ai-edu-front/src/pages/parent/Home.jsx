import { useAuth } from '../../hooks/useAuth'
import StatCard from '../../components/common/StatCard'

export function ParentHome() {
  const { user } = useAuth()

  // Mock data
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

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">欢迎回来，{user?.realName || '家长'}！</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="关联孩子"
          value={stats.childrenCount}
          color="primary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          }
        />
        <StatCard
          title="作业完成率"
          value={`${stats.completionRate}%`}
          color="success"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          }
        />
        <StatCard
          title="待关注"
          value={stats.attentionCount}
          color="warning"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          }
        />
        <StatCard
          title="未读消息"
          value={stats.unreadMessages}
          color="info"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
            </svg>
          }
        />
      </div>

      {/* 功能模块 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 孩子学习情况 */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              孩子学习情况
            </h2>
            <div className="space-y-4">
              {children.map(child => (
                <div key={child.id} className="p-4 bg-base-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{child.name}</span>
                    <span className="badge badge-success">{child.grade}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-primary">{child.avgScore}</div>
                      <div className="text-gray-500">平均分</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-warning">{child.errorCount}</div>
                      <div className="text-gray-500">错题数</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-success">{child.studyHours}h</div>
                      <div className="text-gray-500">学习时长</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 最近动态 */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              最近动态
            </h2>
            <div className="space-y-2">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
                  <div className={`badge ${activity.type === 'homework' ? 'badge-primary' : 'badge-warning'}`}>
                    {activity.type === 'homework' ? '作业' : '错题'}
                  </div>
                  <div>
                    <p>{activity.content}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ParentHome