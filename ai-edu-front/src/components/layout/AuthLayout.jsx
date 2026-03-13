import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 auth-bg">
      <Outlet />
      {/* 页脚 */}
      <footer className="fixed bottom-0 w-full text-center text-white/70 text-sm py-4">
        <p>&copy; 2026 AI 教育平台 - 智能学习，精准提升</p>
      </footer>
    </div>
  )
}

export default AuthLayout