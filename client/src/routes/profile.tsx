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
      <div className="hero min-h-[60vh] bg-gradient-to-b from-green-50 to-emerald-100">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-3xl font-bold mb-4 text-green-700">Access Denied</h1>
            <p className="mb-6 text-green-600">Please log in to view your profile.</p>
            <button 
              className="btn bg-green-600 text-white hover:bg-green-700 border-none"
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-emerald-50 to-lime-100 p-8 space-y-10">
      {/* 🌱 Back Button */}
      <button
        onClick={() => navigate({ to: '/' })}
        className="btn btn-ghost text-green-700 hover:bg-green-200"
      >
        ← Back
      </button>

      {/* 🌿 Profile Header */}
      <section className="hero bg-white/70 backdrop-blur-md border border-green-100 rounded-3xl shadow-xl">
        <div className="hero-content text-center py-10">
          <div className="max-w-2xl">
            <div className="avatar placeholder mb-4">
              <div className="bg-green-600 text-white rounded-full w-24 flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-3 text-green-800">Welcome back, {user.name} 🌎</h1>
            <p className="text-lg text-green-700/80 mb-8">
              Manage your account, view your trading history, and track your environmental impact.
            </p>
            
            {user.role === 'admin' && (
              <div className="mt-6">
                <div className="badge bg-lime-200 text-green-800 border-none shadow-sm">
                  ⚡ Admin privileges active
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 🌳 Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <EcoStat title="Your Listings" value="12" desc="Active items" color="bg-green-50 text-green-700" icon="🌾" />
        <EcoStat title="Trades" value="8" desc="Completed" color="bg-emerald-50 text-emerald-700" icon="🔄" />
        <EcoStat title="CO₂ Saved" value="2.1" desc="Tons" color="bg-lime-50 text-lime-700" icon="🌍" />
        <EcoStat title="Earnings" value="$340" desc="This month" color="bg-green-100 text-green-800" icon="💰" />
      </section>

      {/* 🌻 Account Info & Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Account Info */}
        <div className="card bg-white/50 backdrop-blur-sm border border-green-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-green-700 mb-4">👤 Account Information</h2>
            <div className="space-y-4">
              <EcoField label="Name" value={user.name} />
              <EcoField label="Email" value={user.email} />
              <EcoField label="Role" value={user.role} />
            </div>
            <div className="card-actions justify-end mt-6">
              <button className="btn bg-green-600 hover:bg-green-700 text-white border-none">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Activity */}
        <div className="card bg-white/50 backdrop-blur-sm border border-green-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-green-700 mb-4">🌿 Recent Activity</h2>
            <EcoActivity color="bg-green-100" label="New listing created" time="2 hours ago" />
            <EcoActivity color="bg-emerald-100" label="Trade completed" time="1 day ago" />
            <EcoActivity color="bg-lime-100" label="Bid received" time="3 days ago" />
            <div className="card-actions justify-end mt-6">
              <button className="btn btn-outline border-green-500 text-green-700 hover:bg-green-600 hover:text-white">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🌎 Environmental Impact */}
      <section className="card bg-white/50 backdrop-blur-md border border-green-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-green-700 mb-6">🍃 Your Environmental Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <EcoImpact color="text-green-700" bg="bg-green-50" value="2.1" label="Tons CO₂ Saved" />
            <EcoImpact color="text-emerald-700" bg="bg-emerald-50" value="156" label="Items Recycled" />
            <EcoImpact color="text-lime-700" bg="bg-lime-50" value="$1,240" label="Total Earnings" />
          </div>
        </div>
      </section>
    </div>
  )
}

/* ---------- ♻️ Reusable Eco Components ---------- */

function EcoStat({ title, value, desc, color, icon }: any) {
  return (
    <div className={`stat ${color} rounded-2xl p-4 shadow-md`}>
      <div className="stat-title text-sm">{title}</div>
      <div className="stat-value text-2xl font-bold">{icon} {value}</div>
      <div className="stat-desc text-xs">{desc}</div>
    </div>
  )
}

function EcoField({ label, value }: any) {
  return (
    <div>
      <label className="text-sm text-green-700">{label}</label>
      <input type="text" value={value} disabled className="input input-bordered bg-green-50 text-green-800 w-full mt-1" />
    </div>
  )
}

function EcoActivity({ color, label, time }: any) {
  return (
    <div className={`flex items-center space-x-3 p-3 ${color} rounded-xl`}>
      <div className="flex-1">
        <p className="text-sm font-medium text-green-800">{label}</p>
        <p className="text-xs text-green-600">{time}</p>
      </div>
    </div>
  )
}

function EcoImpact({ color, bg, value, label }: any) {
  return (
    <div className={`text-center p-6 ${bg} rounded-2xl`}>
      <div className={`text-3xl font-bold ${color} mb-2`}>{value}</div>
      <div className="text-sm text-green-700/80">{label}</div>
    </div>
  )
}
