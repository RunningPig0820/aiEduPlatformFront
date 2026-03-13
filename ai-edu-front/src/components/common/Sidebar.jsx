import { NavLink } from 'react-router-dom'

export function Sidebar({ menuItems, title }) {
  return (
    <div className="drawer-side">
      <label htmlFor="sidebar-drawer" className="drawer-overlay"></label>
      <ul className="menu p-4 w-64 bg-base-200 min-h-full">
        <li className="menu-title">{title}</li>
        {menuItems.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.path}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {item.icon}
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar