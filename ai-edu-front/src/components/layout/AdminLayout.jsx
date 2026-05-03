import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import AIChatPanel from '../common/AIChatPanel'
import { showPendingToast } from '../common/PendingFeature'
import { Menu, Bell } from 'lucide-react'

export function AdminLayout({ menuItems, title = '管理员端', pageCode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-sidebar-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col h-screen">
        {/* 顶部导航栏 */}
        <nav className="navbar bg-base-200 shadow-md sticky top-0 z-30">
          <div className="flex-none lg:hidden">
            <label htmlFor="admin-sidebar-drawer" className="btn btn-square btn-ghost">
              <Menu size={20} strokeWidth={1.5} />
            </label>
          </div>
          <div className="flex-1">
            <span className="text-xl font-bold">
              <span className="text-secondary">AI</span> 教育平台 · {title}
            </span>
          </div>
          <div className="flex-none gap-2">
            {/* 通知 */}
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <Bell size={20} />
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>

            {/* 用户头像 */}
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full bg-secondary text-white flex items-center justify-center">
                  <span>{user?.realName?.charAt(0) || 'A'}</span>
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li className="menu-title">
                  <span>{user?.realName || '管理员'}</span>
                </li>
                <li><a>个人中心</a></li>
                <li><a>系统设置</a></li>
                <li className="divider"></li>
                <li><a onClick={handleLogout} className="text-error">退出登录</a></li>
              </ul>
            </div>
          </div>
        </nav>

        {/* 主内容区 + AI 面板 */}
        <div className="flex flex-1 min-h-0">
          <main className="flex-1 p-6 bg-base-100 overflow-auto">
            <Outlet />
          </main>

          {/* AI 助手面板 */}
          <div className="hidden lg:block h-full">
            <AIChatPanel pageCode={pageCode} />
          </div>
        </div>
      </div>

      {/* 侧边栏 */}
      <div className="drawer-side">
        <label htmlFor="admin-sidebar-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 bg-base-200 min-h-full">
          <li className="menu-title">
            <span className="text-lg font-bold">
              <span className="text-secondary">管理</span>后台
            </span>
          </li>
          {menuItems?.map((item, index) => (
            <li key={index}>
              <MenuItem item={item} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/**
 * 菜单项组件
 */
function MenuItem({ item }) {
  // 待开发状态
  if (item.status === 'pending') {
    return (
      <div
        className="flex items-center gap-3 opacity-50 cursor-not-allowed"
        onClick={(e) => {
          e.preventDefault()
          showPendingToast()
        }}
      >
        {item.icon}
        <span>{item.label}</span>
        <span className="badge badge-xs badge-ghost ml-auto">待开发</span>
      </div>
    )
  }

  // 正常状态 - 使用 NavLink 样式
  return (
    <a
      href={item.path}
      className="flex items-center gap-3 hover:bg-base-300 rounded-lg p-2"
    >
      {item.icon}
      {item.label}
    </a>
  )
}

export default AdminLayout