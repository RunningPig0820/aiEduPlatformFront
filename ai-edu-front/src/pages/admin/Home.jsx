import { useAuth } from '../../hooks/useAuth'
import StatCard from '../../components/common/StatCard'
import { Building, Users, TrendingUp, DollarSign, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

export function AdminHome() {
  const { user } = useAuth()

  const stats = {
    organizationCount: 15,
    userCount: 2580,
    todayActive: 328,
    monthlyRevenue: '¥128,500'
  }

  // 7日用户增长趋势数据
  const userTrendData = [
    { date: '05-01', users: 2350, active: 280 },
    { date: '05-02', users: 2380, active: 295 },
    { date: '05-03', users: 2410, active: 302 },
    { date: '05-04', users: 2445, active: 288 },
    { date: '05-05', users: 2490, active: 310 },
    { date: '05-06', users: 2540, active: 318 },
    { date: '05-07', users: 2580, active: 328 },
  ]

  const recentOrganizations = [
    { id: 1, name: '北京市第一中学', users: 580, status: 'active' },
    { id: 2, name: '上海实验小学', users: 320, status: 'active' },
    { id: 3, name: '杭州教育培训中心', users: 150, status: 'pending' }
  ]

  const recentActivities = [
    { id: 1, type: 'register', action: '新用户注册', user: '张三', time: '2分钟前' },
    { id: 2, type: 'create', action: '组织创建', user: '李四', time: '15分钟前' },
    { id: 3, type: 'payment', action: '订单支付', user: '王五', time: '30分钟前' },
    { id: 4, type: 'warning', action: '登录异常', user: '赵六', time: '1小时前' },
    { id: 5, type: 'register', action: '新用户注册', user: '孙七', time: '2小时前' }
  ]

  // 活动类型对应的圆点颜色
  const activityDotColors = {
    register: 'bg-blue-500',
    create: 'bg-purple-500',
    payment: 'bg-green-500',
    warning: 'bg-red-500'
  }

  // 管理员端统一角色色：secondary (青色)
  return (
    <div className="page-enter space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">欢迎回来，{user?.realName || '管理员'}！</h1>
          <p className="text-sm text-base-content/50 mt-1">数据更新于 5 分钟前</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm btn-outline gap-1">
            <TrendingUp size={14} />
            导出数据
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="组织数量"
          value={stats.organizationCount}
          color="secondary"
          icon={<Building size={24} strokeWidth={1.5} />}
          trend="positive"
          trendLabel="较上周 +8%"
        />
        <StatCard
          title="用户总数"
          value={stats.userCount.toLocaleString()}
          color="secondary"
          icon={<Users size={24} strokeWidth={1.5} />}
          trend="positive"
          trendLabel="较昨日 +12%"
        />
        <StatCard
          title="今日活跃"
          value={stats.todayActive}
          color="secondary"
          icon={<TrendingUp size={24} strokeWidth={1.5} />}
          trend="positive"
          trendLabel="较昨日 +5.2%"
        />
        <StatCard
          title="本月收入"
          value={stats.monthlyRevenue}
          color="secondary"
          icon={<DollarSign size={24} strokeWidth={1.5} />}
          trend="negative"
          trendLabel="较上月 -2.1%"
        />
      </div>

      {/* 用户增长趋势图 - 宽幅 */}
      <div className="card bg-base-100 rounded-xl shadow-card-elevated border border-base-200">
        <div className="card-body p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="card-title">
              <TrendingUp size={20} className="text-secondary" />
              用户增长趋势
            </h2>
            <div className="flex gap-2">
              <span className="badge badge-sm badge-ghost">7天</span>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userTrendData}>
                <defs>
                  <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="用户总数"
                  stroke="#0D9488"
                  strokeWidth={2}
                  fill="url(#userGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="active"
                  name="活跃用户"
                  stroke="#4F46E5"
                  strokeWidth={2}
                  fill="url(#activeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* 图例 */}
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-secondary"></div>
              <span className="text-sm text-base-content/60">用户总数</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-sm text-base-content/60">活跃用户</span>
            </div>
          </div>
        </div>
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
                  className="flex items-center justify-between p-3 rounded-lg bg-base-200 hover:bg-base-300/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${org.status === 'active' ? 'bg-success' : 'bg-warning'}`}></div>
                    <div>
                      <p className="font-medium">{org.name}</p>
                      <p className="text-sm text-base-content/50">{org.users} 用户</p>
                    </div>
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

        {/* 最近活动 - 时间线样式 */}
        <div className="card bg-base-100 rounded-xl shadow-card-elevated border border-base-200">
          <div className="card-body p-5">
            <h2 className="card-title mb-3">
              <Clock size={20} className="text-secondary" />
              最近活动
            </h2>
            <div className="space-y-0">
              {recentActivities.map((activity, index) => (
                <div key={activity.id} className="flex gap-3">
                  {/* 时间线 */}
                  <div className="flex flex-col items-center">
                    <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${activityDotColors[activity.type] || 'bg-base-content/30'}`}></div>
                    {index < recentActivities.length - 1 && (
                      <div className="w-px h-full bg-base-200 mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{activity.action}</p>
                      <span className="text-xs text-base-content/40">{activity.time}</span>
                    </div>
                    <p className="text-sm text-base-content/50">操作人: {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-actions justify-end mt-2">
              <button className="btn btn-outline btn-sm hover:scale-95 transition-transform">查看全部</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
