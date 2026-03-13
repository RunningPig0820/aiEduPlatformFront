import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function Login() {
  const [activeTab, setActiveTab] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [message, setMessage] = useState({ show: false, type: 'success', text: '' })

  const [loginForm, setLoginForm] = useState({
    identifier: '',
    password: ''
  })

  const [registerForm, setRegisterForm] = useState({
    phone: '',
    code: '',
    password: '',
    confirmPassword: ''
  })

  const { login, demoLogin, register, sendCode } = useAuth()
  const navigate = useNavigate()

  const showMessage = (type, text) => {
    setMessage({ type, text, show: true })
    setTimeout(() => setMessage({ ...message, show: false }), 3000)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(loginForm.identifier, loginForm.password)
      showMessage('success', '登录成功，正在跳转...')
      setTimeout(() => {
        redirectByRole(user.role)
      }, 1000)
    } catch (error) {
      showMessage('error', error.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (role) => {
    setLoading(true)
    try {
      await demoLogin(role)
      showMessage('success', '演示登录成功，正在跳转...')
      setTimeout(() => {
        redirectByRole(role)
      }, 1000)
    } catch (error) {
      showMessage('error', error.message || '演示登录失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSendCode = async () => {
    if (!registerForm.phone || registerForm.phone.length !== 11) {
      showMessage('error', '请输入正确的手机号')
      return
    }
    try {
      await sendCode(registerForm.phone)
      showMessage('success', '验证码已发送')
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      showMessage('error', error.message || '发送失败')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    if (registerForm.password.length < 6) {
      showMessage('error', '密码至少6位')
      return
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      showMessage('error', '两次密码不一致')
      return
    }
    setLoading(true)
    try {
      await register({
        username: 'user_' + Date.now(),
        password: registerForm.password,
        realName: '新用户',
        role: 'STUDENT'
      })
      showMessage('success', '注册成功，请登录')
      setTimeout(() => setActiveTab('login'), 1500)
    } catch (error) {
      showMessage('error', error.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  const redirectByRole = (role) => {
    const routes = {
      STUDENT: '/student',
      TEACHER: '/teacher',
      PARENT: '/parent'
    }
    navigate(routes[role] || '/')
  }

  return (
    <div className="glass-card rounded-2xl shadow-2xl w-full max-w-md p-8">
      {/* 标题 */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          <span className="text-primary">AI</span> 教育平台
        </h1>
        <p className="text-gray-500 mt-2">智能学习，精准提升</p>
      </div>

      {/* Tab 切换 */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`flex-1 py-3 text-center transition-colors ${activeTab === 'login' ? 'tab-active' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('login')}
        >
          登录
        </button>
        <button
          className={`flex-1 py-3 text-center transition-colors ${activeTab === 'register' ? 'tab-active' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('register')}
        >
          注册
        </button>
      </div>

      {/* 登录表单 */}
      {activeTab === 'login' && (
        <form onSubmit={handleLogin} className="space-y-4">
          {/* 用户名/手机号 */}
          <div className="form-control relative">
            <label className="label">
              <span className="label-text font-medium">手机号/用户名</span>
            </label>
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </span>
            <input
              type="text"
              value={loginForm.identifier}
              onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
              placeholder="请输入手机号或用户名"
              className="input input-bordered w-full input-with-icon"
              required
            />
          </div>

          {/* 密码 */}
          <div className="form-control relative">
            <label className="label">
              <span className="label-text font-medium">密码</span>
            </label>
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              placeholder="请输入密码"
              className="input input-bordered w-full input-with-icon pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* 登录按钮 */}
          <button
            type="submit"
            className={`btn btn-primary w-full text-white ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {!loading && '登 录'}
          </button>

          {/* 演示快捷登录 */}
          <div className="divider">演示快捷登录</div>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              className="btn btn-success btn-outline"
              onClick={() => handleDemoLogin('STUDENT')}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              学生
            </button>
            <button
              type="button"
              className="btn btn-primary btn-outline"
              onClick={() => handleDemoLogin('TEACHER')}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              老师
            </button>
            <button
              type="button"
              className="btn btn-warning btn-outline"
              onClick={() => handleDemoLogin('PARENT')}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              家长
            </button>
          </div>
        </form>
      )}

      {/* 注册表单 */}
      {activeTab === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          {/* 手机号 */}
          <div className="form-control relative">
            <label className="label">
              <span className="label-text font-medium">手机号</span>
            </label>
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
            <input
              type="tel"
              value={registerForm.phone}
              onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
              placeholder="请输入手机号"
              className="input input-bordered w-full input-with-icon"
              required
            />
          </div>

          {/* 验证码 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">验证码</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={registerForm.code}
                onChange={(e) => setRegisterForm({ ...registerForm, code: e.target.value })}
                placeholder="请输入验证码"
                className="input input-bordered flex-1"
                maxLength={6}
                required
              />
              <button
                type="button"
                className="btn btn-outline btn-primary"
                disabled={countdown > 0 || !registerForm.phone}
                onClick={handleSendCode}
              >
                {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
              </button>
            </div>
          </div>

          {/* 设置密码 */}
          <div className="form-control relative">
            <label className="label">
              <span className="label-text font-medium">设置密码</span>
            </label>
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={registerForm.password}
              onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
              placeholder="请设置密码（6-20位）"
              className="input input-bordered w-full input-with-icon pr-10"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
          {/* 密码提示 */}
          {registerForm.password && (
            <label className="label">
              <span className={`label-text-alt ${registerForm.password.length >= 6 ? 'text-success' : 'text-warning'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                至少6个字符
              </span>
            </label>
          )}

          {/* 确认密码 */}
          <div className="form-control relative">
            <label className="label">
              <span className="label-text font-medium">确认密码</span>
            </label>
            <span className="input-icon">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input
              type="password"
              value={registerForm.confirmPassword}
              onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
              placeholder="请再次输入密码"
              className="input input-bordered w-full input-with-icon"
              required
            />
            {registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword && (
              <label className="label">
                <span className="label-text-alt text-error">两次密码不一致</span>
              </label>
            )}
          </div>

          {/* 注册按钮 */}
          <button
            type="submit"
            className={`btn btn-primary w-full text-white ${loading ? 'loading' : ''}`}
            disabled={loading || registerForm.password !== registerForm.confirmPassword}
          >
            {!loading && '注 册'}
          </button>

          {/* 已有账号提示 */}
          <p className="text-center text-gray-500 text-sm">
            已有账号？
            <a href="#" className="text-primary hover:underline" onClick={(e) => { e.preventDefault(); setActiveTab('login') }}>点击登录</a>
          </p>
        </form>
      )}

      {/* 消息提示 */}
      {message.show && (
        <div className={`alert mt-4 ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
          <span>{message.text}</span>
        </div>
      )}
    </div>
  )
}

export default Login