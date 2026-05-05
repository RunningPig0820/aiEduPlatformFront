import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import AIChatPanel from '../common/AIChatPanel'
import { showPendingToast } from '../common/PendingFeature'
import { Menu, Bell, ChevronRight, Home } from 'lucide-react'

export function AdminLayout({ menuItems, title = '管理员端', pageCode }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // 根据当前路径生成面包屑
  const getBreadcrumbItems = () => {
    const path = location.pathname
    const items = [{ label: '首页', path: '/admin', icon: <Home size={14} /> }]

    // 查找匹配的菜单项
    const currentMenu = menuItems?.find(item => item.path === path)
    if (currentMenu && path !== '/admin') {
      items.push({ label: currentMenu.label })
    }

    return items
  }

  const breadcrumbs = getBreadcrumbItems()

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

        {/* 面包屑导航 */}
        <div className="px-6 py-2 bg-base-100 border-b border-base-200">
          <div className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-1">
                {index > 0 && <ChevronRight size={14} className="text-base-content/40" />}
                {crumb.path ? (
                  <a
                    href={crumb.path}
                    className="flex items-center gap-1 text-base-content/60 hover:text-secondary transition-colors"
                  >
                    {crumb.icon}
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-base-content font-medium">{crumb.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 主内容区 */}
        <main className="flex-1 p-6 bg-base-200 overflow-auto">
          <Outlet />
        </main>

        {/* AI 助手 - 抽屉式 */}
        <AIChatPanel pageCode={pageCode} />
      </div>

      {/* 侧边栏 */}
      <div className="drawer-side">
        <label htmlFor="admin-sidebar-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 bg-base-200 min-h-full">
          <li className="menu-title mb-2">
            <span className="text-lg font-bold">
              <span className="text-secondary">管理</span>后台
            </span>
          </li>
          {menuItems?.map((item, index) => (
            <li key={index}>
              <MenuItem item={item} currentPath={location.pathname} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/**
 * 菜单项组件 - 带激活状态高亮
 */
function MenuItem({ item, currentPath }) {
  const isActive = currentPath === item.path

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

  // 正常状态 - 带激活高亮
  return (
    <a
      href={item.path}
      className={`flex items-center gap-3 rounded-lg p-2 transition-all duration-150 ${
        isActive
          ? 'bg-secondary/10 font-semibold text-secondary'
          : 'hover:bg-base-300 text-base-content/80'
      }`}
    >
      {item.icon}
      {item.label}
      {isActive && <div className="w-1 h-4 bg-secondary rounded-full ml-auto"></div>}
    </a>
  )
}

export default AdminLayout