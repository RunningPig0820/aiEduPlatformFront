import { Link } from 'react-router-dom'
import { ROUTES } from '../constants'

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="text-center px-4">
        {/* 404 数字 */}
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>

        {/* 图标 */}
        <div className="mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            返回首页
          </Link>
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
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