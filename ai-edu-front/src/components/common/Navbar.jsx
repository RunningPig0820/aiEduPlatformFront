import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { authApi } from '../../api'

export function Navbar({ title, roleColor = 'primary' }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ show: false, type: '', text: '' })

  const roleColors = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning'
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/auth/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (passwordForm.newPassword.length < 6) {
      setMessage({ show: true, type: 'error', text: '新密码至少6位' })
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ show: true, type: 'error', text: '两次密码不一致' })
      return
    }
    if (passwordForm.oldPassword === passwordForm.newPassword) {
      setMessage({ show: true, type: 'error', text: '新密码不能与原密码相同' })
      return
    }

    setLoading(true)
    try {
      await authApi.changePassword(passwordForm.oldPassword, passwordForm.newPassword)
      setMessage({ show: true, type: 'success', text: '密码修改成功' })
      setTimeout(() => {
        setShowChangePassword(false)
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
        setMessage({ show: false, type: '', text: '' })
      }, 1500)
    } catch (error) {
      setMessage({ show: true, type: 'error', text: error.message || '修改失败' })
    } finally {
      setLoading(false)
    }
  }

  const getInitial = () => {
    if (user?.realName) return user.realName.charAt(0).toUpperCase()
    if (user?.username) return user.username.charAt(0).toUpperCase()
    return 'U'
  }

  return (
    <>
      <nav className="navbar bg-base-200 shadow-md">
        <div className="flex-none lg:hidden">
          <label htmlFor="sidebar-drawer" className="btn btn-square btn-ghost drawer-button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </label>
        </div>
        <div className="flex-1">
          <span className="text-xl font-bold">
            <Link to="/" className="text-primary">AI</Link> 教育平台 · {title}
          </span>
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className={`w-10 rounded-full ${roleColors[roleColor]} text-white flex items-center justify-center`}>
                <span>{getInitial()}</span>
              </div>
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-base-100 rounded-box w-52">
              <li className="menu-title px-4 py-2">
                <span className="text-gray-600">{user?.realName || user?.username || '用户'}</span>
              </li>
              <li className="border-t border-base-200"></li>
              <li>
                <a onClick={() => setShowChangePassword(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  修改密码
                </a>
              </li>
              <li>
                <a onClick={handleLogout} className="text-error">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  退出登录
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* 修改密码模态框 */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">修改密码</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* 原密码 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">原密码</span>
                </label>
                <input
                  type="password"
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  placeholder="请输入原密码"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* 新密码 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">新密码</span>
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="请输入新密码（6-100位）"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* 确认新密码 */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">确认新密码</span>
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="请再次输入新密码"
                  className="input input-bordered w-full"
                  required
                />
              </div>

              {/* 消息提示 */}
              {message.show && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg`}>
                  <div className="flex items-center gap-2">
                    {message.type === 'success' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                    <span className="font-medium">{message.text}</span>
                  </div>
                </div>
              )}

              {/* 按钮 */}
              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowChangePassword(false)
                    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
                    setMessage({ show: false, type: '', text: '' })
                  }}
                >
                  取消
                </button>
                <button
                  type="submit"
                  className={`btn btn-primary ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  确认修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar