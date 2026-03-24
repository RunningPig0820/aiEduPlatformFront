import { useState } from 'react'

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
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
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
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
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