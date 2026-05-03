export function StatCard({ title, value, icon: Icon, color = 'primary' }) {
  const colorMap = {
    primary: { figure: 'text-primary', bg: 'bg-primary/10', border: 'from-primary/80 to-primary', ring: 'ring-primary/20' },
    secondary: { figure: 'text-secondary', bg: 'bg-secondary/10', border: 'from-secondary/80 to-secondary', ring: 'ring-secondary/20' },
    success: { figure: 'text-success', bg: 'bg-success/10', border: 'from-success/80 to-success', ring: 'ring-success/20' },
    warning: { figure: 'text-warning', bg: 'bg-warning/10', border: 'from-warning/80 to-warning', ring: 'ring-warning/20' },
    info: { figure: 'text-info', bg: 'bg-info/10', border: 'from-info/80 to-info', ring: 'ring-info/20' },
  }
  const c = colorMap[color] || colorMap.primary

  // 兼容 JSX 元素和组件函数两种形式
  const iconContent = typeof Icon === 'function'
    ? <Icon size={24} strokeWidth={1.5} />
    : Icon

  return (
    <div className={`group stat-card relative bg-base-100 rounded-xl shadow-card-elevated hover:shadow-card-hover transition-all duration-200 overflow-hidden border border-base-200 hover:border-base-300 hover:-translate-y-0.5`}>
      {/* 顶部渐变条 */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${c.border}`}></div>

      <div className="p-5 flex items-center gap-4">
        {/* 图标容器 */}
        <div className={`w-14 h-14 rounded-xl ${c.bg} ${c.figure} flex items-center justify-center flex-shrink-0 ring-2 ${c.ring} group-hover:scale-105 transition-transform duration-200`}>
          {iconContent}
        </div>

        {/* 文字区域 */}
        <div className="flex-1 min-w-0">
          <div className="stat-title text-xs font-medium text-base-content/60 mb-0.5">{title}</div>
          <div className={`stat-value text-2xl font-bold ${c.figure} truncate`}>{value}</div>
        </div>
      </div>
    </div>
  )
}

export default StatCard
