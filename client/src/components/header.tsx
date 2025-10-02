import { Link, useNavigate } from "@tanstack/react-router"
import { useAuth } from "../utils/auth"
// import { useState } from "react"

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
//   const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  return (
    <header className="navbar bg-base-100 shadow-lg border-b border-base-300">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><Link to="/" className="font-medium">Home</Link></li>
            <li><Link to="/listings" className="font-medium">Listings</Link></li>
            {user && (
              <li><Link to="/add-listing" className="font-medium">Add Listing</Link></li>
            )}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl font-bold text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          TakaPlus
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/" className="font-medium hover:text-primary">Home</Link></li>
          <li><Link to="/listings" className="font-medium hover:text-primary">Listings</Link></li>
          {user && (
            <li><Link to="/add-listing" className="font-medium hover:text-primary">Add Listing</Link></li>
          )}
          
          <li><Link to="/aiSummary" className="font-medium hover:text-primary">AI Insight</Link></li>
        </ul>
      </div>
      
      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                <span className="text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span>Welcome, {user.name}</span>
              </li>
              <li><Link to="/profile" className="justify-between">
                Profile
                <span className="badge">New</span>
              </Link></li>
              <li><a>Settings</a></li>
              {user.role === 'admin' && (
                <li><a className="text-warning">Admin Panel</a></li>
              )}
              <li><a onClick={handleLogout} className="text-error">Logout</a></li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-ghost">Login</Link>
            <Link to="/register" className="btn btn-primary">Register</Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
