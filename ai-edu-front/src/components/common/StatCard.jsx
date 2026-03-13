export function StatCard({ title, value, icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    success: 'text-success',
    warning: 'text-warning',
    info: 'text-info'
  }

  return (
    <div className="stat-card p-4">
      <div className={`stat-figure ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="stat-title">{title}</div>
      <div className={`stat-value ${colorClasses[color]}`}>{value}</div>
    </div>
  )
}

export default StatCard