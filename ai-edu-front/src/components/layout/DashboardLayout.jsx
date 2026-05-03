import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from '../common/Sidebar'
import AIChatPanel from '../common/AIChatPanel'
import { getPageMeta } from '../../constants/pageMeta'
import { Menu } from 'lucide-react'

export function DashboardLayout({ menuItems, title, roleColor = 'primary' }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const roleColors = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning'
  }

  const roleTextColors = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning'
  }

  // 根据当前路由获取页面元信息
  const getPageCode = () => {
    const path = location.pathname
    // 移除前导斜杠，转换为大写，替换斜杠为下划线
    const code = path.split('/').filter(Boolean).join('_').toUpperCase()
    // 尝试匹配菜单项的 pageCode 或默认使用路径转换
    const menuItem = menuItems?.find(item => item.path === path)
    return menuItem?.pageCode || code || title?.toUpperCase() + '_HOME'
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col h-screen">
        {/* 导航栏 */}
        <nav className="navbar bg-base-200 shadow-md sticky top-0 z-30">
          <div className="flex-none lg:hidden">
            <label htmlFor="sidebar-drawer" className="btn btn-square btn-ghost">
              <Menu size={20} strokeWidth={1.5} />
            </label>
          </div>
          <div className="flex-1">
            <span className="text-xl font-bold">
              <span className={roleTextColors[roleColor]}>AI</span> 教育平台 · {title}
            </span>
          </div>
          <div className="flex-none gap-2">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className={`w-10 rounded-full ${roleColors[roleColor]} text-white flex items-center justify-center`}>
                  <span>{user?.realName?.charAt(0) || 'U'}</span>
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li><a>个人中心</a></li>
                <li><a>设置</a></li>
                <li><a onClick={handleLogout}>退出登录</a></li>
              </ul>
            </div>
          </div>
        </nav>

        {/* 主内容区 + AI 面板 */}
        <div className="flex flex-1 min-h-0">
          <main className="flex-1 p-6 bg-base-100 overflow-auto">
            <Outlet />
          </main>

          {/* AI 助手面板 - 仅桌面端显示 */}
          <div className="hidden lg:block h-full">
            <AIChatPanel pageCode={getPageCode()} />
          </div>
        </div>
      </div>

      {/* 侧边栏 */}
      <Sidebar menuItems={menuItems} title={title} />
    </div>
  )
}

export default DashboardLayout