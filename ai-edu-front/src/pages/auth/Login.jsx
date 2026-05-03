import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { CodeScene, LoginType } from '../../api/modules/auth'
import { authApi } from '../../api'
import { User, Lock, Shield, Eye, EyeOff, BookOpen, Newspaper, UsersRound, Settings, CheckCircle, AlertCircle, Phone, IdCard, KeyRound, Sparkles, GraduationCap, Heart, Monitor } from 'lucide-react'

export function Login() {
  const [activeTab, setActiveTab] = useState('login') // login | register | reset
  const [loginMode, setLoginMode] = useState('password') // password | code
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [modal, setModal] = useState({ show: false, type: 'success', title: '', text: '' })

  // 登录表单
  const [loginForm, setLoginForm] = useState({
    identifier: '',
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

  const { login, register, sendCode } = useAuth()
  const navigate = useNavigate()

  // 演示账号配置
  const DEMO_ACCOUNTS = {
    STUDENT: { username: 'student', password: '123456' },
    TEACHER: { username: 'teacher', password: '123456' },
    PARENT: { username: 'parent', password: '123456' },
    ADMIN: { username: 'admin', password: '123456' }
  }

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
      return code
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
      setLoginForm({ ...loginForm, code: String(code) })
    }
  }

  // 演示登录
  const handleDemoLogin = async (role) => {
    setLoading(true)
    try {
      const account = DEMO_ACCOUNTS[role]
      const user = await login(account.username, account.password)
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

  // 发送注册验证码
  const handleRegisterSendCode = async () => {
    const code = await handleSendCode(registerForm.phone, CodeScene.REGISTER)
    if (code) {
      setRegisterForm({ ...registerForm, code: String(code) })
    }
  }

  // 注册处理
  const handleRegister = async (e) => {
    e.preventDefault()

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

  // 角色选项配置
  const ROLE_OPTIONS = [
    { value: 'STUDENT', label: '学生', icon: BookOpen, color: 'btn-success' },
    { value: 'TEACHER', label: '教师', icon: Newspaper, color: 'btn-primary' },
    { value: 'PARENT', label: '家长', icon: UsersRound, color: 'btn-warning' },
    { value: 'ADMIN', label: '管理员', icon: Settings, color: 'btn-secondary' }
  ]

  // 演示登录配置
  const DEMO_BUTTONS = [
    { role: 'STUDENT', label: '学生', icon: BookOpen, btnClass: 'btn-success' },
    { role: 'TEACHER', label: '老师', icon: Newspaper, btnClass: 'btn-primary' },
    { role: 'PARENT', label: '家长', icon: UsersRound, btnClass: 'btn-warning' },
    { role: 'ADMIN', label: '管理员', icon: Settings, btnClass: 'btn-secondary' }
  ]

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #F0FDFA 100%)' }}>
      {/* ===== 左侧品牌面板（lg 以上显示） ===== */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #4F46E5 0%, #0D9488 100%)' }}>
        {/* 背景装饰 */}
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-3xl"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          {/* 大图标 */}
          <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-8 ring-4 ring-white/20">
            <Sparkles size={48} strokeWidth={1.5} className="text-yellow-300" />
          </div>

          {/* 标语 */}
          <h1 className="text-4xl font-extrabold mb-4">
            <span className="text-yellow-300">AI</span> 教育平台
          </h1>
          <p className="text-lg text-white/80 text-center max-w-sm mb-12 leading-relaxed">
            智能学习，精准提升。让每一位学生都能享受个性化学习。
          </p>

          {/* 特性 bullet */}
          <div className="space-y-4 w-full max-w-xs">
            {[
              { icon: GraduationCap, text: '智能错题本 · 知识图谱' },
              { icon: Monitor, text: '多端适配 · 随时随地学习' },
              { icon: Heart, text: '家校互联 · 实时学情追踪' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <item.icon size={20} />
                </div>
                <span className="text-white/90 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== 右侧表单区 ===== */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          {/* 移动端 logo */}
          <div className="lg:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              <span className="text-primary">AI</span> 教育平台
            </h1>
            <p className="text-gray-500 mt-1 text-sm">智能学习，精准提升</p>
          </div>

          {/* 登录卡片 */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Tab 切换 */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === 'login' ? 'tab-active text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('login')}
              >
                登录
              </button>
              <button
                className={`flex-1 py-3 text-center font-medium transition-colors ${activeTab === 'register' ? 'tab-active text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('register')}
              >
                注册
              </button>
            </div>

            {/* ===== 登录表单 ===== */}
            {activeTab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                {/* 登录方式切换 */}
                <div className="flex justify-center gap-3 mb-2">
                  <button
                    type="button"
                    className={`btn btn-sm rounded-full px-5 ${loginMode === 'password' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setLoginMode('password')}
                  >
                    密码登录
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm rounded-full px-5 ${loginMode === 'code' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setLoginMode('code')}
                  >
                    验证码登录
                  </button>
                </div>

                {/* 用户名/手机号 */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">
                      {loginMode === 'code' ? '手机号' : '手机号/用户名'}
                    </span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      value={loginForm.identifier}
                      onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                      placeholder={loginMode === 'code' ? '请输入手机号' : '请输入手机号或用户名'}
                      className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                </div>

                {/* 密码 */}
                {loginMode === 'password' ? (
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-sm">密码</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Lock size={18} />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        placeholder="请输入密码"
                        className="input input-bordered w-full pl-10 pr-10 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="text-right mt-1">
                      <a
                        href="#"
                        className="text-xs text-primary hover:underline"
                        onClick={(e) => { e.preventDefault(); setActiveTab('reset') }}
                      >
                        忘记密码？
                      </a>
                    </div>
                  </div>
                ) : (
                  /* 验证码 */
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text font-medium text-sm">验证码</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <Shield size={18} />
                        </span>
                        <input
                          type="text"
                          value={loginForm.code}
                          onChange={(e) => setLoginForm({ ...loginForm, code: e.target.value })}
                          placeholder="请输入验证码"
                          className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          maxLength={6}
                          required
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline btn-primary shrink-0 rounded-lg"
                        disabled={countdown > 0 || !isPhoneNumber(loginForm.identifier)}
                        onClick={handleLoginSendCode}
                      >
                        {countdown > 0 ? `${countdown}s` : '获取'}
                      </button>
                    </div>
                  </div>
                )}

                {/* 登录按钮 */}
                <button
                  type="submit"
                  className={`btn btn-primary w-full text-white mt-2 ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {!loading && '登 录'}
                </button>

                {/* Demo 快捷登录 - 卡片式 */}
                <div className="divider text-xs text-gray-400">快捷体验</div>
                <div className="grid grid-cols-4 gap-3">
                  {DEMO_BUTTONS.map(item => (
                    <button
                      key={item.role}
                      type="button"
                      className={`btn ${item.btnClass} btn-outline btn-sm gap-1 rounded-lg h-auto py-3 flex-col hover:scale-105 transition-transform`}
                      onClick={() => handleDemoLogin(item.role)}
                      disabled={loading}
                    >
                      <item.icon size={16} />
                      <span className="text-xs">{item.label}</span>
                    </button>
                  ))}
                </div>
              </form>
            )}

            {/* ===== 注册表单 ===== */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                {/* 用户名 */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">用户名 <span className="text-error">*</span></span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      value={registerForm.username}
                      onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                      placeholder="字母开头，3-50位字母数字下划线"
                      className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      maxLength={50}
                      required
                    />
                  </div>
                </div>

                {/* 真实姓名 */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">真实姓名</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <IdCard size={18} />
                    </span>
                    <input
                      type="text"
                      value={registerForm.realName}
                      onChange={(e) => setRegisterForm({ ...registerForm, realName: e.target.value })}
                      placeholder="请输入真实姓名（选填）"
                      className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      maxLength={50}
                    />
                  </div>
                </div>

                {/* 手机号 */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">手机号 <span className="text-error">*</span></span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone size={18} />
                    </span>
                    <input
                      type="tel"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                      placeholder="请输入手机号"
                      className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      maxLength={11}
                      required
                    />
                  </div>
                </div>

                {/* 验证码 */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">验证码 <span className="text-error">*</span></span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Shield size={18} />
                      </span>
                      <input
                        type="text"
                        value={registerForm.code}
                        onChange={(e) => setRegisterForm({ ...registerForm, code: e.target.value })}
                        placeholder="请输入验证码"
                        className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        maxLength={6}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-primary shrink-0 rounded-lg"
                      disabled={countdown > 0 || !registerForm.phone || registerForm.phone.length !== 11}
                      onClick={handleRegisterSendCode}
                    >
                      {countdown > 0 ? `${countdown}s` : '获取'}
                    </button>
                  </div>
                </div>

                {/* 角色选择 - 按钮组 */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">我是 <span className="text-error">*</span></span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {ROLE_OPTIONS.map(item => (
                      <button
                        key={item.value}
                        type="button"
                        className={`btn btn-sm rounded-lg gap-1.5 ${registerForm.role === item.value ? `${item.color} text-white` : 'btn-outline'}`}
                        onClick={() => setRegisterForm({ ...registerForm, role: item.value })}
                      >
                        <item.icon size={16} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 设置密码 */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">设置密码 <span className="text-error">*</span></span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      placeholder="请设置密码（6-100位）"
                      className="input input-bordered w-full pl-10 pr-10 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                  {registerForm.password && (
                    <label className="label py-1">
                      <span className={`label-text-alt ${registerForm.password.length >= 6 ? 'text-success' : 'text-warning'}`}>
                        {registerForm.password.length >= 6 ? '✓ 密码长度合格' : '密码至少6个字符'}
                      </span>
                    </label>
                  )}
                </div>

                {/* 确认密码 */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">确认密码 <span className="text-error">*</span></span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      placeholder="请再次输入密码"
                      className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  {registerForm.confirmPassword && registerForm.password !== registerForm.confirmPassword && (
                    <label className="label py-1">
                      <span className="label-text-alt text-error">两次密码不一致</span>
                    </label>
                  )}
                </div>

                {/* 注册按钮 */}
                <button
                  type="submit"
                  className={`btn btn-primary w-full text-white mt-2 ${loading ? 'loading' : ''}`}
                  disabled={loading || (registerForm.password !== registerForm.confirmPassword && registerForm.confirmPassword)}
                >
                  {!loading && '注 册'}
                </button>

                <p className="text-center text-gray-500 text-sm">
                  已有账号？
                  <a href="#" className="text-primary hover:underline" onClick={(e) => { e.preventDefault(); setActiveTab('login') }}>点击登录</a>
                </p>
              </form>
            )}

            {/* ===== 重置密码表单 ===== */}
            {activeTab === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold">重置密码</h2>
                  <p className="text-gray-500 text-sm mt-1">通过手机验证码重置您的密码</p>
                </div>

                {/* 手机号 */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">手机号</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone size={18} />
                    </span>
                    <input
                      type="tel"
                      value={resetForm.phone}
                      onChange={(e) => setResetForm({ ...resetForm, phone: e.target.value })}
                      placeholder="请输入手机号"
                      className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      maxLength={11}
                      required
                    />
                  </div>
                </div>

                {/* 验证码 */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">验证码</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <Shield size={18} />
                      </span>
                      <input
                        type="text"
                        value={resetForm.code}
                        onChange={(e) => setResetForm({ ...resetForm, code: e.target.value })}
                        placeholder="请输入验证码"
                        className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                        maxLength={6}
                        required
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-outline btn-primary shrink-0 rounded-lg"
                      disabled={countdown > 0 || !resetForm.phone || resetForm.phone.length !== 11}
                      onClick={handleResetSendCode}
                    >
                      {countdown > 0 ? `${countdown}s` : '获取'}
                    </button>
                  </div>
                </div>

                {/* 新密码 */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">新密码</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={resetForm.newPassword}
                      onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                      placeholder="请设置新密码（6-100位）"
                      className="input input-bordered w-full pl-10 pr-10 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>

                {/* 确认新密码 */}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text font-medium text-sm">确认新密码</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      value={resetForm.confirmPassword}
                      onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                      placeholder="请再次输入新密码"
                      className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      required
                    />
                  </div>
                  {resetForm.confirmPassword && resetForm.newPassword !== resetForm.confirmPassword && (
                    <label className="label py-1">
                      <span className="label-text-alt text-error">两次密码不一致</span>
                    </label>
                  )}
                </div>

                {/* 重置按钮 */}
                <button
                  type="submit"
                  className={`btn btn-primary w-full text-white mt-2 ${loading ? 'loading' : ''}`}
                  disabled={loading}
                >
                  {!loading && '重置密码'}
                </button>

                <p className="text-center text-gray-500 text-sm">
                  <a href="#" className="text-primary hover:underline" onClick={(e) => { e.preventDefault(); setActiveTab('login') }}>
                    返回登录
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ===== 弹窗提示 ===== */}
      {modal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-6 w-80 max-w-[90vw] animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              {modal.type === 'success' ? (
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                  <CheckCircle size={40} className="text-success" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
                  <AlertCircle size={40} className="text-error" />
                </div>
              )}
            </div>

            <h3 className={`text-xl font-bold text-center mb-2 ${modal.type === 'success' ? 'text-success' : 'text-error'}`}>
              {modal.title}
            </h3>

            <p className="text-gray-600 text-center mb-4">{modal.text}</p>

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
