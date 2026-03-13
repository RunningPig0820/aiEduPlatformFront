import { Link } from 'react-router-dom'

export function Navbar({ title, roleColor = 'primary' }) {
  const roleColors = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning'
  }

  return (
    <nav className="navbar bg-base-200 shadow-md">
      <div className="flex-none lg:hidden">
        <label htmlFor="sidebar-drawer" className="btn btn-square btn-ghost drawer-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
      </div>
      <div className="flex-1">
        <span className="text-xl font-bold">
          <Link to="/" className="text-primary">AI</Link> 教育平台 · {title}
        </span>
      </div>
      <div className="flex-none gap-2">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className={`w-10 rounded-full ${roleColors[roleColor]} text-white flex items-center justify-center`}>
              <span>U</span>
            </div>
          </label>
        </div>
      </div>
    </nav>
  )
}

export default Navbar