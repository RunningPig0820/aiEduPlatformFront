import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from '../common/Sidebar'

export function DashboardLayout({ menuItems, title, roleColor = 'primary' }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const roleColors = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning'
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="drawer lg:drawer-open">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        {/* 导航栏 */}
        <nav className="navbar bg-base-200 shadow-md">
          <div className="flex-none lg:hidden">
            <label htmlFor="sidebar-drawer" className="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          <div className="flex-1">
            <span className="text-xl font-bold">
              <span className="text-primary">AI</span> 教育平台 · {title}
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

        {/* 主内容区 */}
        <main className="flex-1 p-6 bg-base-100">
          <Outlet />
        </main>
      </div>

      {/* 侧边栏 */}
      <Sidebar menuItems={menuItems} title={title} />
    </div>
  )
}

export default DashboardLayout