// client/src/routes/index.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../utils/auth'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="hero min-h-[80vh] bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 rounded-3xl">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600/10 rounded-3xl mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M10 14h10m-6 4h6" />
                </svg>
              </div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-green-700 mb-6">
                Cleaner Cities with TakaPlus
              </h1>
              <p className="text-xl text-base-content/80 max-w-2xl mx-auto leading-relaxed text-gray-900">
                Turn your household and business waste into value. 
                Sort, recycle, and trade materials — while helping your community fight pollution.
              </p>
            </div>
            
            { !user && <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button 
                className="btn btn-success btn-lg px-8"
                onClick={() => navigate({ to: '/register' })}
              >
                ♻️ Get Started
              </button>
              <button 
                className="btn btn-outline btn-lg px-8"
                onClick={() => navigate({ to: '/login' })}
              >
                🔑 Login
              </button>
            </div>}

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="stat bg-white/70 rounded-2xl shadow-lg">
                <div className="stat-title text-sm text-black">Waste Collected</div>
                <div className="stat-value text-green-700">12,450 Kg</div>
                <div className="stat-desc">Removed from landfills</div>
              </div>

              <div className="stat bg-white/70 rounded-2xl shadow-lg">
                <div className="stat-title text-sm text-black">Recyclables Traded</div>
                <div className="stat-value text-emerald-600">3,210</div>
                <div className="stat-desc">Households & businesses</div>
              </div>

              <div className="stat bg-white/70 rounded-2xl shadow-lg">
                <div className="stat-title text-sm text-black">CO₂ Saved</div>
                <div className="stat-value text-lime-600">2.4K tons</div>
                <div className="stat-desc">Cleaner, greener air</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl text-green-700 font-bold mb-4">Why Choose TakaPlus?</h2>
          <p className="text-lg  text-black max-w-2xl mx-auto">
            We're transforming waste management into opportunity for everyone
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-white/40 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body text-center bg-w">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-600/10 rounded-full flex items-center justify-center">
                ♻️
              </div>
              <h3 className="card-title justify-center mb-2 text-green-700">Smart Recycling</h3>
              <p className="text-black">
                Seamlessly sort and recycle materials with real-time pickup and drop-off options
              </p>
            </div>
          </div>

          <div className="card bg-white/40 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-emerald-600/10 rounded-full flex items-center justify-center">
                💰
              </div>
              <h3 className="card-title justify-center mb-2  text-green-700">Earn from Waste</h3>
              <p className="text-black">
                Exchange recyclables for cash or credits, giving your waste real market value
              </p>
            </div>
          </div>

          <div className="card bg-white/40 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body text-center">
              <div className="mx-auto mb-4 w-18 h-18 bg-lime-600/10 rounded-full flex items-center justify-center">
                🌍
              </div>
              <h3 className="card-title justify-center mb-2  text-green-700">Cleaner Communities</h3>
              <p className="text-black">
                Join a movement of households, businesses, and recyclers creating greener cities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="hero bg-gradient-to-r from-green-30 via-emerald-100 to-green-200 text-white rounded-3xl">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-4 text-green-700">Ready to Reduce Waste?</h2>
            <p className="mb-6 text-black text-lg">
              Be part of the solution — recycle smarter, earn more, and keep your neighborhood clean
            </p>
            <button 
              className="btn btn-lg btn-ghost text-green-700"
              onClick={() => navigate({ to: '/listings' })}
            >
              🚛 Start Trading Today
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
