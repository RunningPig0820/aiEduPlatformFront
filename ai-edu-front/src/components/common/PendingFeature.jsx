import { useState } from 'react'
import { AlertTriangle, Lock } from 'lucide-react'

/**
 * 待开发功能提示 Toast
 */
export function showPendingToast() {
  // 使用 daisyUI 的 alert 样式创建 Toast
  const toastContainer = document.getElementById('toast-container') || createToastContainer()

  const toast = document.createElement('div')
  toast.className = 'alert alert-warning shadow-lg mb-2 animate-pulse'
  toast.innerHTML = `
    <div>
      <div class="stroke-current flex-shrink-0 h-6 w-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div>
        <h3 class="font-bold">功能开发中</h3>
        <div class="text-xs">该功能正在开发中，敬请期待...</div>
      </div>
    </div>
    <button class="btn btn-sm btn-ghost">知道了</button>
  `

  // 点击关闭按钮
  const closeBtn = toast.querySelector('button')
  closeBtn.onclick = () => {
    toast.remove()
  }

  toastContainer.appendChild(toast)

  // 3 秒后自动消失
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add('opacity-0', 'transition-opacity')
      setTimeout(() => toast.remove(), 300)
    }
  }, 3000)
}

/**
 * 创建 Toast 容器
 */
function createToastContainer() {
  const container = document.createElement('div')
  container.id = 'toast-container'
  container.className = 'toast toast-end z-50'
  container.style.cssText = 'position: fixed; bottom: 1rem; right: 1rem;'
  document.body.appendChild(container)
  return container
}

/**
 * 待开发功能包装组件
 * 用于菜单项和卡片的置灰显示
 */
export function PendingFeature({ children, className = '', showLabel = true }) {
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    showPendingToast()
  }

  return (
    <div
      className={`opacity-50 cursor-not-allowed relative ${className}`}
      onClick={handleClick}
    >
      {children}
      {showLabel && (
        <span className="badge badge-sm badge-ghost gap-1 ml-2">
          <Lock size={12} />
          待开发
        </span>
      )}
    </div>
  )
}

/**
 * 待开发菜单项组件
 */
export function PendingMenuItem({ icon, label }) {
  return (
    <PendingFeature showLabel={true}>
      <a className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </a>
    </PendingFeature>
  )
}

export default PendingFeature