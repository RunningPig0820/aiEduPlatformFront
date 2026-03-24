import { NavLink } from 'react-router-dom'
import { showPendingToast } from './PendingFeature'

export function Sidebar({ menuItems, title }) {
  return (
    <div className="drawer-side">
      <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu p-4 w-64 bg-base-200 min-h-full">
        <li className="menu-title">{title}</li>
        {menuItems.map((item, index) => (
          <li key={index}>
            <MenuItem item={item} />
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * 菜单项组件
 */
function MenuItem({ item }) {
  // 待开发状态
  if (item.status === 'pending') {
    return (
      <div
        className="flex items-center gap-3 opacity-50 cursor-not-allowed"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          showPendingToast()
        }}
      >
        {item.icon}
        <span>{item.label}</span>
        <span className="badge badge-xs badge-ghost ml-auto">待开发</span>
      </div>
    )
  }

  // 正常状态
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) => isActive ? 'active' : ''}
    >
      {item.icon}
      {item.label}
    </NavLink>
  )
}

export default Sidebar