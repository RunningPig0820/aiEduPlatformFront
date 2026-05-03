import { useAuth } from '../../hooks/useAuth'
import StatCard from '../../components/common/StatCard'
import { Building, Users, TrendingUp, DollarSign, Clock } from 'lucide-react'

export function AdminHome() {
  const { user } = useAuth()

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

  // 管理员端统一角色色：secondary (青色)
  return (
    <div className="page-enter space-y-6">
      <h1 className="text-2xl font-bold">欢迎回来，{user?.realName || '管理员'}！</h1>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="组织数量"
          value={stats.organizationCount}
          color="secondary"
          icon={<Building size={24} strokeWidth={1.5} />}
        />
        <StatCard
          title="用户总数"
          value={stats.userCount}
          color="secondary"
          icon={<Users size={24} strokeWidth={1.5} />}
        />
        <StatCard
          title="今日活跃"
          value={stats.todayActive}
          color="secondary"
          icon={<TrendingUp size={24} strokeWidth={1.5} />}
        />
        <StatCard
          title="本月收入"
          value={stats.monthlyRevenue}
          color="secondary"
          icon={<DollarSign size={24} strokeWidth={1.5} />}
        />
      </div>

      {/* 功能模块 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近组织 */}
        <div className="card bg-base-100 rounded-xl shadow-card-elevated border border-base-200">
          <div className="card-body p-5">
            <h2 className="card-title mb-3">
              <Building size={20} className="text-secondary" />
              最近组织
            </h2>
            <div className="space-y-2">
              {recentOrganizations.map(org => (
                <div
                  key={org.id}
                  className="flex items-center justify-between p-3 rounded-lg border-l-[3px] border-secondary/30 bg-base-200 hover:bg-base-300/50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{org.name}</p>
                    <p className="text-sm text-base-content/50">{org.users} 用户</p>
                  </div>
                  <div className={`badge badge-sm ${org.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                    {org.status === 'active' ? '正常' : '待审核'}
                  </div>
                </div>
              ))}
            </div>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-outline btn-sm hover:scale-95 transition-transform">查看全部</button>
            </div>
          </div>
        </div>

        {/* 最近活动 */}
        <div className="card bg-base-100 rounded-xl shadow-card-elevated border border-base-200">
          <div className="card-body p-5">
            <h2 className="card-title mb-3">
              <Clock size={20} className="text-secondary" />
              最近活动
            </h2>
            <div className="space-y-2">
              {recentActivities.map(activity => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg border-l-[3px] border-secondary/30 bg-base-200 hover:bg-base-300/50 transition-colors cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-base-content/50">操作人: {activity.user}</p>
                  </div>
                  <span className="text-sm text-base-content/40">{activity.time}</span>
                </div>
              ))}
            </div>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-outline btn-sm hover:scale-95 transition-transform">查看全部</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
