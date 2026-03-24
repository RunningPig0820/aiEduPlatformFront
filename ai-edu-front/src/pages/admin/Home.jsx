import { useAuth } from '../../hooks/useAuth'
import StatCard from '../../components/common/StatCard'

export function AdminHome() {
  const { user } = useAuth()

  // Mock data - in real app, this would come from API
  const stats = {
    organizationCount: 15,
    userCount: 2580,
    todayActive: 328,
    monthlyRevenue: '¥128,500'
  }

  const recentOrganizations = [
    { id: 1, name: '北京市第一中学', users: 580, status: 'active' },
    { id: 2, name: '上海实验小学', users: 320, status: 'active' },
    { id: 3, name: '杭州教育培训中心', users: 150, status: 'pending' }
  ]

  const recentActivities = [
    { id: 1, action: '新用户注册', user: '张三', time: '2分钟前' },
    { id: 2, action: '组织创建', user: '李四', time: '15分钟前' },
    { id: 3, action: '订单支付', user: '王五', time: '30分钟前' }
  ]

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">欢迎回来，{user?.realName || '管理员'}！</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="组织数量"
          value={stats.organizationCount}
          color="secondary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          }
        />
        <StatCard
          title="用户总数"
          value={stats.userCount}
          color="primary"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          }
        />
        <StatCard
          title="今日活跃"
          value={stats.todayActive}
          color="success"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          }
        />
        <StatCard
          title="本月收入"
          value={stats.monthlyRevenue}
          color="warning"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          }
        />
      </div>

      {/* 功能模块 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近组织 */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              最近组织
            </h2>
            <div className="space-y-2">
              {recentOrganizations.map(org => (
                <div key={org.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div>
                    <p className="font-medium">{org.name}</p>
                    <p className="text-sm text-gray-500">{org.users} 用户</p>
                  </div>
                  <div className="badge badge-sm">
                    {org.status === 'active' ? '正常' : '待审核'}
                  </div>
                </div>
              ))}
            </div>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-outline btn-sm">查看全部</button>
            </div>
          </div>
        </div>

        {/* 最近活动 */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              最近活动
            </h2>
            <div className="space-y-2">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-gray-500">操作人: {activity.user}</p>
                  </div>
                  <span className="text-sm text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-outline btn-sm">查看全部</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminHome