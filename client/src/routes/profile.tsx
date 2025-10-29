
// client/src/routes/profile.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../utils/auth'

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="hero min-h-[60vh]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="mb-6">Please log in to view your profile.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate({ to: '/login' })}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <section className="hero bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-3xl">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <div className="avatar placeholder mb-4">
              <div className="bg-primary my-auto text-primary-content rounded-full w-24 flex items-center justify-center">
                <span className=" fletter text-3xl relative w-full font-bold text-center top-[50%] mt-6 ">{user.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4">Welcome back, {user.name}!</h1>
            <p className="text-lg text-base-content/80 mb-8">
              Manage your account, view your trading history, and track your environmental impact.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => navigate({ to: '/listings' })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                View Listings
              </button>
              <button 
                className="btn btn-secondary btn-lg"
                onClick={() => navigate({ to: '/add-listing' })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add Listing
              </button>
            </div>
            {user.role === 'admin' && (
              <div className="mt-6">
                <div className="badge badge-warning badge-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Admin privileges active
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat bg-base-100 shadow-lg rounded-2xl">
          <div className="stat-figure text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div className="stat-title text-sm">Your Listings</div>
          <div className="stat-value text-lg">12</div>
          <div className="stat-desc text-xs">Active items</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-2xl">
          <div className="stat-figure text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div className="stat-title text-sm">Trades</div>
          <div className="stat-value text-lg">8</div>
          <div className="stat-desc text-xs">Completed</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-2xl">
          <div className="stat-figure text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="stat-title text-sm">CO₂ Saved</div>
          <div className="stat-value text-lg">2.1</div>
          <div className="stat-desc text-xs">Tons</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-2xl">
          <div className="stat-figure text-info">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <div className="stat-title text-sm">Earnings</div>
          <div className="stat-value text-lg">$340</div>
          <div className="stat-desc text-xs">This month</div>
        </div>
      </section>

      {/* Profile Information */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Account Information */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Account Information
            </h2>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input type="text" value={user.name} className="input input-bordered" disabled />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input type="email" value={user.email} className="input input-bordered" disabled />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <input type="text" value={user.role} className="input input-bordered capitalize" disabled />
              </div>
            </div>
            <div className="card-actions justify-end mt-6">
              <button className="btn btn-outline">Edit Profile</button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-8">
                    <span className="text-xs">L</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New listing created</p>
                  <p className="text-xs text-base-content/60">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                <div className="avatar placeholder">
                  <div className="bg-secondary text-secondary-content rounded-full w-8">
                    <span className="text-xs">T</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Trade completed</p>
                  <p className="text-xs text-base-content/60">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                <div className="avatar placeholder">
                  <div className="bg-accent text-accent-content rounded-full w-8">
                    <span className="text-xs">B</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Bid received</p>
                  <p className="text-xs text-base-content/60">3 days ago</p>
                </div>
              </div>
            </div>
            <div className="card-actions justify-end mt-6">
              <button className="btn btn-outline">View All Activity</button>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental Impact */}
      <section className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            Your Environmental Impact
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-primary/10 rounded-2xl">
              <div className="text-3xl font-bold text-primary mb-2">2.1</div>
              <div className="text-sm text-base-content/70">Tons CO₂ Saved</div>
            </div>
            <div className="text-center p-6 bg-secondary/10 rounded-2xl">
              <div className="text-3xl font-bold text-secondary mb-2">156</div>
              <div className="text-sm text-base-content/70">Items Recycled</div>
            </div>
            <div className="text-center p-6 bg-accent/10 rounded-2xl">
              <div className="text-3xl font-bold text-accent mb-2">$1,240</div>
              <div className="text-sm text-base-content/70">Total Earnings</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}