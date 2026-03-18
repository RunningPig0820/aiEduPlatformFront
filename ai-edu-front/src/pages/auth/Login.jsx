import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { CodeScene, LoginType } from '../../api/modules/auth'
import { authApi } from '../../api'

export function Login() {
  const [activeTab, setActiveTab] = useState('login') // login | register | reset
  const [loginMode, setLoginMode] = useState('password') // password | code
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [modal, setModal] = useState({ show: false, type: 'success', title: '', text: '' })

  // 登录表单
  const [loginForm, setLoginForm] = useState({
    identifier: '', // 用户名或手机号
    password: '',
    code: ''
  })

  // 注册表单
  const [registerForm, setRegisterForm] = useState({
    username: '',
    realName: '',
    phone: '',
    code: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT'
  })

  // 重置密码表单
  const [resetForm, setResetForm] = useState({
    phone: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  })

  const { login, demoLogin, register, sendCode } = useAuth()
  const navigate = useNavigate()

  // 弹窗提示
  const showModal = (type, text, title) => {
    const defaultTitle = type === 'success' ? '成功' : type === 'error' ? '错误' : '提示'
    setModal({ show: true, type, title: title || defaultTitle, text })
  }

  const closeModal = () => {
    setModal({ ...modal, show: false })
  }

  // 自动关闭成功弹窗
  useEffect(() => {
    if (modal.show && modal.type === 'success') {
      const timer = setTimeout(closeModal, 2000)
      return () => clearTimeout(timer)
    }
  }, [modal.show, modal.type])

  // 判断是否为手机号
  const isPhoneNumber = (str) => /^1[3-9]\d{9}$/.test(str)

  // 发送验证码（通用）- 返回验证码用于自动填充
  const handleSendCode = async (phone, scene) => {
    if (!phone || phone.length !== 11) {
      showModal('error', '请输入正确的手机号')
      return null
    }
    try {
      const code = await sendCode(phone, scene)
      showModal('success', '验证码已发送')
      startCountdown()
      return code // 返回验证码用于自动填充
    } catch (error) {
      showModal('error', error.message || '发送失败')
      return null
    }
  }

  // 开始倒计时
  const startCountdown = () => {
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
  }

  // 登录处理
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let user
      const identifier = loginForm.identifier.trim()

      if (loginMode === 'code') {
        // 手机号+验证码登录
        if (!isPhoneNumber(identifier)) {
          showModal('error', '请输入正确的手机号')
          setLoading(false)
          return
        }
        if (!loginForm.code) {
          showModal('error', '请输入验证码')
          setLoading(false)
          return
        }
        user = await authApi.loginByPhoneCode(identifier, loginForm.code)
      } else {
        // 密码登录（自动判断用户名或手机号）
        if (!identifier || !loginForm.password) {
          showModal('error', '请填写完整信息')
          setLoading(false)
          return
        }
        if (isPhoneNumber(identifier)) {
          user = await authApi.loginByPhonePassword(identifier, loginForm.password)
        } else {
          user = await login(identifier, loginForm.password)
        }
      }

      showModal('success', '登录成功，正在跳转...')
      setTimeout(() => {
        redirectByRole(user.role)
      }, 1000)
    } catch (error) {
      showModal('error', error.message || '登录失败')
    } finally {
      setLoading(false)
    }
  }

  // 发送登录验证码
  const handleLoginSendCode = async () => {
    if (!isPhoneNumber(loginForm.identifier)) {
      showModal('error', '请先输入正确的手机号')
      return
    }
    const code = await handleSendCode(loginForm.identifier, CodeScene.LOGIN)
    if (code) {
      // 自动填入验证码
      setLoginForm({ ...loginForm, code: String(code) })
    }
  }

  // 演示登录
  const handleDemoLogin = async (role) => {
    setLoading(true)
    try {
      await demoLogin(role)
      showModal('success', '演示登录成功，正在跳转...')
      setTimeout(() => {
        redirectByRole(role)
      }, 1000)
    } catch (error) {
      showModal('error', error.message || '演示登录失败')
    } finally {
      setLoading(false)
    }
  }

  // 发送注册验证码
  const handleRegisterSendCode = async () => {
    const code = await handleSendCode(registerForm.phone, CodeScene.REGISTER)
    if (code) {
      // 自动填入验证码
      setRegisterForm({ ...registerForm, code: String(code) })
    }
  }

  // 注册处理
  const handleRegister = async (e) => {
    e.preventDefault()

    // 校验
    if (!registerForm.username || registerForm.username.length < 3) {
      showModal('error', '用户名至少3个字符')
      return
    }
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(registerForm.username)) {
      showModal('error', '用户名需以字母开头，仅含字母、数字、下划线')
      return
    }
    if (!registerForm.phone || registerForm.phone.length !== 11) {
      showModal('error', '请输入正确的手机号')
      return
    }
    if (!registerForm.code || registerForm.code.length !== 6) {
      showModal('error', '请输入6位验证码')
      return
    }
    if (registerForm.password.length < 6) {
      showModal('error', '密码至少6位')
      return
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      showModal('error', '两次密码不一致')
      return
    }

    setLoading(true)
    try {
      await register({
        username: registerForm.username,
        password: registerForm.password,
        realName: registerForm.realName || '新用户',
        phone: registerForm.phone,
        code: registerForm.code,
        role: registerForm.role
      })
      showModal('success', '注册成功，请登录')
      setTimeout(() => setActiveTab('login'), 1500)
    } catch (error) {
      showModal('error', error.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  // 发送重置密码验证码
  const handleResetSendCode = async () => {
    const code = await handleSendCode(resetForm.phone, CodeScene.RESET_PASSWORD)
    if (code) {
      // 自动填入验证码
      setResetForm({ ...resetForm, code: String(code) })
    }
  }

  // 重置密码处理
  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (!resetForm.phone || resetForm.phone.length !== 11) {
      showModal('error', '请输入正确的手机号')
      return
    }
    if (!resetForm.code || resetForm.code.length !== 6) {
      showModal('error', '请输入6位验证码')
      return
    }
    if (resetForm.newPassword.length < 6) {
      showModal('error', '密码至少6位')
      return
    }
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      showModal('error', '两次密码不一致')
      return
    }

    setLoading(true)
    try {
      await authApi.resetPassword(resetForm.phone, resetForm.code, resetForm.newPassword)
      showModal('success', '密码重置成功，请登录')
      setTimeout(() => setActiveTab('login'), 1500)
    } catch (error) {
      showModal('error', error.message || '重置失败')
    } finally {
      setLoading(false)
    }
  }

  const redirectByRole = (role) => {
    const routes = {
      STUDENT: '/student',
      TEACHER: '/teacher',
      PARENT: '/parent',
      ADMIN: '/admin'
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
          {/* 登录方式切换 */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              type="button"
              className={`btn btn-sm ${loginMode === 'password' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setLoginMode('password')}
            >
              密码登录
            </button>
            <button
              type="button"
              className={`btn btn-sm ${loginMode === 'code' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setLoginMode('code')}
            >
              验证码登录
            </button>
          </div>

          {/* 用户名/手机号 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">
                {loginMode === 'code' ? '手机号' : '手机号/用户名'}
              </span>
            </label>
            <div className="input-wrapper">
              <span className="input-prefix-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                value={loginForm.identifier}
                onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                placeholder={loginMode === 'code' ? '请输入手机号' : '请输入手机号或用户名'}
                className="input input-bordered flex-1"
                required
              />
            </div>
          </div>

          {/* 密码或验证码 */}
          {loginMode === 'password' ? (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">密码</span>
              </label>
              <div className="input-wrapper">
                <span className="input-prefix-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="请输入密码"
                  className="input input-bordered flex-1"
                  required
                />
                <button
                  type="button"
                  className="input-suffix-btn"
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
            </div>
          ) : (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">验证码</span>
              </label>
              <div className="input-wrapper">
                <span className="input-prefix-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                <input
                  type="text"
                  value={loginForm.code}
                  onChange={(e) => setLoginForm({ ...loginForm, code: e.target.value })}
                  placeholder="请输入验证码"
                  className="input input-bordered flex-1"
                  maxLength={6}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline btn-primary shrink-0"
                  disabled={countdown > 0 || !isPhoneNumber(loginForm.identifier)}
                  onClick={handleLoginSendCode}
                >
                  {countdown > 0 ? `${countdown}s` : '获取验证码'}
                </button>
              </div>
            </div>
          )}

          {/* 忘记密码 */}
          {loginMode === 'password' && (
            <div className="text-right">
              <a
                href="#"
                className="text-sm text-primary hover:underline"
                onClick={(e) => { e.preventDefault(); setActiveTab('reset') }}
              >
                忘记密码？
              </a>
            </div>
          )}

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
          <div className="grid grid-cols-4 gap-3">
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
            <button
              type="button"
              className="btn btn-secondary btn-outline"
              onClick={() => handleDemoLogin('ADMIN')}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              管理员
            </button>
          </div>
        </form>
      )}

      {/* 注册表单 */}
      {activeTab === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          {/* 用户名 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">用户名 <span className="text-error">*</span></span>
            </label>
            <div className="input-wrapper">
              <span className="input-prefix-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                placeholder="字母开头，3-50位字母数字下划线"
                className="input input-bordered flex-1"
                maxLength={50}
                required
              />
            </div>
          </div>

          {/* 真实姓名 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">真实姓名</span>
            </label>
            <div className="input-wrapper">
              <span className="input-prefix-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={registerForm.realName}
                onChange={(e) => setRegisterForm({ ...registerForm, realName: e.target.value })}
                placeholder="请输入真实姓名（选填）"
                className="input input-bordered flex-1"
                maxLength={50}
              />
            </div>
          </div>

          {/* 手机号 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">手机号 <span className="text-error">*</span></span>
            </label>
            <div className="input-wrapper">
              <span className="input-prefix-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <input
                type="tel"
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                placeholder="请输入手机号"
                className="input input-bordered flex-1"
                maxLength={11}
                required
              />
            </div>
          </div>

          {/* 验证码 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">验证码 <span className="text-error">*</span></span>
            </label>
            <div className="input-wrapper">
              <span className="input-prefix-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
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
                className="btn btn-outline btn-primary shrink-0"
                disabled={countdown > 0 || !registerForm.phone || registerForm.phone.length !== 11}
                onClick={handleRegisterSendCode}
              >
                {countdown > 0 ? `${countdown}s` : '获取验证码'}
              </button>
            </div>
          </div>

          {/* 角色选择 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">我是 <span className="text-error">*</span></span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'STUDENT', label: '学生', icon: '📚' },
                { value: 'TEACHER', label: '教师', icon: '🎓' },
                { value: 'PARENT', label: '家长', icon: '👨‍👩‍👧' }
              ].map(item => (
                <button
                  key={item.value}
                  type="button"
                  className={`btn ${registerForm.role === item.value ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setRegisterForm({ ...registerForm, role: item.value })}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 设置密码 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">设置密码 <span className="text-error">*</span></span>
            </label>
            <div className="input-wrapper">
              <span className="input-prefix-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                placeholder="请设置密码（6-100位）"
                className="input input-bordered flex-1"
                required
              />
              <button
                type="button"
                className="input-suffix-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
            {registerForm.password && (
              <label className="label">
                <span className={`label-text-alt ${registerForm.password.length >= 6 ? 'text-success' : 'text-warning'}`}>
                  {registerForm.password.length >= 6 ? '✓ 密码长度合格' : '密码至少6个字符'}
                </span>
              </label>
            )}
          </div>

          {/* 确认密码 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">确认密码 <span className="text-error">*</span></span>
            </label>
            <div className="input-wrapper">
              <span className="input-prefix-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                placeholder="请再次输入密码"
                className="input input-bordered flex-1"
                required
              />
            </div>
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
            disabled={loading || (registerForm.password !== registerForm.confirmPassword && registerForm.confirmPassword)}
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

      {/* 重置密码表单 */}
      {activeTab === 'reset' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="text-center mb-4">
            <h2 className="text-xl font-semibold">重置密码</h2>
            <p className="text-gray-500 text-sm mt-1">通过手机验证码重置您的密码</p>
          </div>

          {/* 手机号 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">手机号</span>
            </label>
            <div className="input-wrapper">
              <span className="input-prefix-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </span>
              <input
                type="tel"
                value={resetForm.phone}
                onChange={(e) => setResetForm({ ...resetForm, phone: e.target.value })}
                placeholder="请输入手机号"
                className="input input-bordered flex-1"
                maxLength={11}
                required
              />
            </div>
          </div>

          {/* 验证码 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">验证码</span>
            </label>
            <div className="input-wrapper">
              <span className="input-prefix-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <input
                type="text"
                value={resetForm.code}
                onChange={(e) => setResetForm({ ...resetForm, code: e.target.value })}
                placeholder="请输入验证码"
                className="input input-bordered flex-1"
                maxLength={6}
                required
              />
              <button
                type="button"
                className="btn btn-outline btn-primary shrink-0"
                disabled={countdown > 0 || !resetForm.phone || resetForm.phone.length !== 11}
                onClick={handleResetSendCode}
              >
                {countdown > 0 ? `${countdown}s` : '获取验证码'}
              </button>
            </div>
          </div>

          {/* 新密码 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">新密码</span>
            </label>
            <div className="input-wrapper">
              <span className="input-prefix-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={resetForm.newPassword}
                onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                placeholder="请设置新密码（6-100位）"
                className="input input-bordered flex-1"
                required
              />
              <button
                type="button"
                className="input-suffix-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>

          {/* 确认新密码 */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">确认新密码</span>
            </label>
            <div className="input-wrapper">
              <span className="input-prefix-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type="password"
                value={resetForm.confirmPassword}
                onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                placeholder="请再次输入新密码"
                className="input input-bordered flex-1"
                required
              />
            </div>
            {resetForm.confirmPassword && resetForm.newPassword !== resetForm.confirmPassword && (
              <label className="label">
                <span className="label-text-alt text-error">两次密码不一致</span>
              </label>
            )}
          </div>

          {/* 重置按钮 */}
          <button
            type="submit"
            className={`btn btn-primary w-full text-white ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {!loading && '重置密码'}
          </button>

          {/* 返回登录 */}
          <p className="text-center text-gray-500 text-sm">
            <a href="#" className="text-primary hover:underline" onClick={(e) => { e.preventDefault(); setActiveTab('login') }}>
              返回登录
            </a>
          </p>
        </form>
      )}

      {/* 弹窗提示 */}
      {modal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={closeModal}>
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-6 w-80 max-w-[90vw] animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 图标 */}
            <div className="flex justify-center mb-4">
              {modal.type === 'success' ? (
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              )}
            </div>

            {/* 标题 */}
            <h3 className={`text-xl font-bold text-center mb-2 ${modal.type === 'success' ? 'text-success' : 'text-error'}`}>
              {modal.title}
            </h3>

            {/* 内容 */}
            <p className="text-gray-600 text-center mb-4">{modal.text}</p>

            {/* 按钮 */}
            <button
              className={`btn w-full ${modal.type === 'success' ? 'btn-success' : 'btn-error'} text-white`}
              onClick={closeModal}
            >
              确定
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login