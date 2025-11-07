//client/src/components/header.tsx
import { Link, useNavigate } from "@tanstack/react-router"
import { useAuth } from "../utils/auth"
// import { useState } from "react"

function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  // const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate({ to: '/' })
  }

  return (
    <header className="navbar bg-gradient-to-r from-green-50 via-emerald-100 to-green-200 shadow-md border-b border-green-300">
      <div className="navbar-start">
        {/* Mobile Menu */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden text-green-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-green-50 rounded-box w-52"
          >
            <li><Link to="/" className="font-medium text-green-800 hover:text-emerald-600">Home</Link></li>
            <li><Link to="/listings" className="font-medium text-green-800 hover:text-emerald-600">Eco Listings</Link></li>
            {user && (
              <>
              <li><Link to="/add-listing" className="font-medium text-green-800 hover:text-emerald-600">Add Recycling Point</Link></li>
              <li><Link to="/aiSummary" className="font-medium text-green-800 hover:text-emerald-600">AI Insight</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Logo */}
        <Link to="/" className="btn btn-ghost text-2xl font-extrabold text-green-700 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C9.243 2 6.5 3.5 5 6c1 2 3 4 7 4s6-2 7-4c-1.5-2.5-4.243-4-7-4zM4 14a8 8 0 0116 0c0 3.866-3.582 7-8 7s-8-3.134-8-7z" />
          </svg>
          <span>Taka<span className="text-emerald-600">Plus</span></span>
        </Link>
      </div>

      {/* Navigation (Desktop) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><Link to="/" className="font-medium text-green-800 hover:text-emerald-600">Home</Link></li>
          <li><Link to="/listings" className="font-medium text-green-800 hover:text-emerald-600">Eco Listings</Link></li>
          {user && (
            <li><Link to="/add-listing" className="font-medium text-green-800 hover:text-emerald-600">Add Recycling Point</Link></li>
          )}
          <li><Link to="/aiSummary" className="font-medium text-green-800 hover:text-emerald-600">AI Eco Insight</Link></li>
        </ul>
      </div>

      {/* Right Side / Auth Buttons */}
      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-green-600 text-white flex items-center justify-center">
                <span className="text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-green-50 rounded-box w-52"
            >
              <li className="menu-title">
                <span className="text-green-800">Welcome, {user.name}</span>
              </li>
              <li>
                <Link to="/profile" className="justify-between text-green-700">
                  Profile
                  <span className="badge badge-success">New</span>
                </Link>
              </li>
              <li><a className="text-green-700">Settings</a></li>
              {user.role === 'admin' && (
                <li><a className="text-yellow-600">Admin Panel</a></li>
              )}
              <li><a onClick={handleLogout} className="text-red-500">Logout</a></li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-outline btn-success">Login</Link>
            <Link to="/register" className="btn btn-success">Join Green Action</Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
