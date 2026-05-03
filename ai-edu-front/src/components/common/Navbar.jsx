import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { authApi } from '../../api'
import { Menu, Key, LogOut, CheckCircle, AlertTriangle } from 'lucide-react'

export function Navbar({ title, roleColor = 'primary' }) {
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
            <Menu size={20} strokeWidth={1.5} className="stroke-current" />
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
                  <Key size={16} strokeWidth={1.5} />
                  修改密码
                </a>
              </li>
              <li>
                <a onClick={handleLogout} className="text-error">
                  <LogOut size={16} strokeWidth={1.5} />
                  退出登录
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* 修改密码模态框 */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
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
                      <CheckCircle size={24} strokeWidth={1.5} />
                    ) : (
                      <AlertTriangle size={24} strokeWidth={1.5} />
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
