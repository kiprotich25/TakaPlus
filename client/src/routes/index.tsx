import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../utils/auth'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="hero min-h-[60vh]">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Welcome to TakaPlus</h1>
            <p className="py-6">
              Your platform for sustainable trading and impact investing. 
              Join our community to start making a difference.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                className="btn btn-primary"
                onClick={() => navigate({ to: '/login' })}
              >
                Login
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => navigate({ to: '/register' })}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="hero min-h-[60vh]">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome back, {user.name}!</h1>
          <p className="py-6">
            Ready to explore sustainable trading opportunities? 
            Check out our latest listings and start making an impact.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              className="btn btn-primary"
              onClick={() => navigate({ to: '/listings' })}
            >
              View Listings
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate({ to: '/add-listing' })}
            >
              Add Listing
            </button>
            {/* <button 
              className="btn btn-accent"
              onClick={() => navigate({ to: '/bins-map' })}
            >
              Find Bins
            </button> */}
            {/* {user.role === 'admin' && (
              <button 
                className="btn btn-warning"
                onClick={() => navigate({ to: '/admin-bins' })}
              >
                Manage Bins
              </button>
            )} */}
            <button 
              className="btn btn-outline"
              onClick={logout}
            >
              Logout
            </button>
          </div>
          {user.role === 'admin' && (
            <div className="mt-4">
              <p className="text-sm text-base-content/70">Admin privileges active</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
