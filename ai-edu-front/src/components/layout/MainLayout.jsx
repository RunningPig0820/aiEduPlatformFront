import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 导航栏 */}
      <nav className="navbar bg-base-200 shadow-md">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            <span className="text-primary">AI</span> 教育平台
          </Link>
        </div>
        <div className="flex-none gap-2">
          {user ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full bg-primary text-white flex items-center justify-center">
                  <span>{user.realName?.charAt(0) || 'U'}</span>
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li><Link to="/profile">个人中心</Link></li>
                <li><Link to="/settings">设置</Link></li>
                <li><a onClick={handleLogout}>退出登录</a></li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary">登录</Link>
          )}
        </div>
      </nav>

      {/* 主内容 */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="footer footer-center p-4 bg-base-200 text-base-content">
        <div>
          <p>&copy; 2024 AI 教育平台 - 智能学习，精准提升</p>
        </div>
      </footer>
    </div>
  )
}

export default MainLayout