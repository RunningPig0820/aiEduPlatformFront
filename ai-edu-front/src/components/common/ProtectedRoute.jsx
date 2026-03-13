import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES, ROLE_ROUTES } from '../../constants'

/**
 * 受保护的路由组件
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子组件
 * @param {string[]} [props.roles] - 允许访问的角色列表
 * @param {string} [props.redirectTo] - 重定向路径
 */
export function ProtectedRoute({ children, roles, redirectTo = ROUTES.LOGIN }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  // 加载中显示 loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  // 未登录，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // 检查角色权限
  if (roles && roles.length > 0) {
    const hasRole = roles.includes(user?.role)
    if (!hasRole) {
      // 没有权限，重定向到对应角色的首页
      const defaultRoute = ROLE_ROUTES[user?.role] || ROUTES.HOME
      return <Navigate to={defaultRoute} replace />
    }
  }

  return children
}

/**
 * 仅限未登录访问的路由（如登录页）
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子组件
 */
export function GuestRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  // 已登录，重定向到对应角色的首页
  if (isAuthenticated) {
    const defaultRoute = ROLE_ROUTES[user?.role] || ROUTES.HOME
    return <Navigate to={defaultRoute} replace />
  }

  return children
}

export default ProtectedRoute