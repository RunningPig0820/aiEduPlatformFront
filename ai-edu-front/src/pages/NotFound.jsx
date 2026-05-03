import { Link } from 'react-router-dom'
import { ROUTES } from '../constants'
import { AlertCircle, Home, ArrowLeft } from 'lucide-react'

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="text-center px-4">
        {/* 404 数字 */}
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>

        {/* 图标 */}
        <div className="mb-6">
          <AlertCircle className="h-24 w-24 mx-auto text-gray-400" strokeWidth={1.5} />
        </div>

        {/* 标题 */}
        <h2 className="text-2xl font-bold text-gray-700 mb-2">页面未找到</h2>

        {/* 描述 */}
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          抱歉，您访问的页面不存在或已被移除。请检查网址是否正确，或返回首页继续浏览。
        </p>

        {/* 操作按钮 */}
        <div className="flex gap-4 justify-center">
          <Link to={ROUTES.HOME} className="btn btn-primary">
            <Home size={18} className="mr-1" />
            返回首页
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline"
          >
            <ArrowLeft size={18} className="mr-1" />
            返回上页
          </button>
        </div>

        {/* 帮助链接 */}
        <div className="mt-12 text-sm text-gray-400">
          <p>
            如果您认为这是一个错误，请
            <a href="#" className="text-primary hover:underline">联系管理员</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound