import { Inbox } from 'lucide-react'

/**
 * 空状态组件
 *
 * 用法：
 * <EmptyState icon={<BookOpen />} title="暂无数据" description="当前没有可用内容" action={<button>刷新</button>} />
 */
export function EmptyState({ icon, title = '暂无数据', description, action, className = '' }) {
  const IconComponent = icon
  const iconSize = 64

  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <div className="text-base-content/30 mb-4">
        {IconComponent || <Inbox size={iconSize} strokeWidth={1} />}
      </div>
      {title && <p className="text-base font-medium text-base-content/70 mb-1">{title}</p>}
      {description && <p className="text-sm text-base-content/50 mb-4 max-w-xs">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export default EmptyState
