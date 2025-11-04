// client/src/routes/listings.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ListingsAPI } from '../utils/api'
import { useAuth } from '../utils/auth'

export const Route = createFileRoute('/listings')({
  component: ListingsPage,
})

function ListingsPage() {
  const [listings, setListings] = useState<Array<any> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const { user, token } = useAuth()
  const navigate = useNavigate()

  // Redirect if not authenticated
  if (!user || !token) {
    navigate({ to: '/login' })
    return null
  }

  useEffect(() => {
    ListingsAPI.list()
      .then(setListings)
      .catch((e) => setError(e.message))
  }, [])

  const materials = [
    'All',
    'Plastic',
    'Metal',
    'Glass',
    'Paper',
    'Cardboard',
    'Textiles',
    'Electronics',
    'Wood',
    'Rubber',
    'Organic Waste',
    'Other',
  ]

  const filteredListings =
    listings
      ?.filter((listing) => {
        const matchesSearch =
          listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          listing.material.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesMaterial =
          selectedMaterial === '' ||
          selectedMaterial === 'All' ||
          listing.material === selectedMaterial
        return matchesSearch && matchesMaterial
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'newest':
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          case 'oldest':
            return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
          case 'quantity-high':
            return b.quantity - a.quantity
          case 'quantity-low':
            return a.quantity - b.quantity
          default:
            return 0
        }
      }) || []

  if (error)
    return (
      <div className="alert alert-error shadow-lg m-8">
        <h3 className="font-bold">Error loading listings!</h3>
        <div className="text-xs">{error}</div>
      </div>
    )

  if (!listings)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="loading loading-spinner loading-lg text-success"></span>
        <p className="mt-4 text-base-content/70">Loading listings...</p>
      </div>
    )

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="hero bg-gradient-to-r from-green-100 via-emerald-100 to-green-200 rounded-3xl py-16 shadow-md">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-extrabold text-green-700 mb-4">
              🌍 Sustainable Materials Marketplace
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Discover and trade sustainable materials to build a circular economy
            </p>
            {user && (
              <button
                className="btn bg-green-600 text-white hover:bg-green-700 hover:scale-105 transition-all duration-300"
                onClick={() => navigate({ to: '/add-listing' })}
              >
                ➕ Add New Listing
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card bg-gradient-to-r from-green-100 via-emerald-100 to-green-200 backdrop-blur-md border border-green-100 shadow-md rounded-2xl">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="form-control flex-1">
              <input
                type="text"
                placeholder=" Search listings..."
                className="input input-bordered w-full border-green-200 focus:ring-green-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Material Filter */}
            <select
              className="select select-bordered border-green-200"
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
            >
              {materials.map((material) => (
                <option key={material} value={material === 'All' ? '' : material}>
                  {material}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              className="select select-bordered border-green-200"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="quantity-high">Quantity: High to Low</option>
              <option value="quantity-low">Quantity: Low to High</option>
            </select>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              Showing {filteredListings.length} of {listings.length} listings
            </p>
            {(searchTerm || selectedMaterial) && (
              <button
                className="btn btn-sm text-green-700 hover:text-white hover:bg-green-600 transition-all"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedMaterial('')
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold mb-2">No listings found</h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search or be the first to add a listing 🌱
          </p>
          {user && (
            <button
              className="btn bg-green-600 text-white hover:bg-green-700 transition-all"
              onClick={() => navigate({ to: '/add-listing' })}
            >
              ➕ Add First Listing
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredListings.map((listing) => (
            <div
              key={listing._id}
              className="card bg-white/70 border border-green-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden"
            >
              {listing.photoUrl ? (
                <figure>
                  <img
                    src={listing.photoUrl}
                    alt={listing.title}
                    className="h-48 w-full object-cover"
                  />
                </figure>
              ) : (
                <figure className="h-48 w-full bg-green-100 flex items-center justify-center text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </figure>
              )}

              <div className="card-body">
                <h2 className="card-title text-lg font-semibold text-green-800">
                  {listing.title}
                </h2>
                <div className="badge badge-outline border-green-400 text-green-600 mb-3">
                  {listing.material}
                </div>

                <p className="text-gray-600 text-sm mb-2">
                  Quantity: <span className="font-medium">{listing.quantity} {listing.unit || 'units'}</span>
                </p>
                {listing.co2Saved && (
                  <p className="text-sm text-emerald-600 font-medium">
                    🌱 {listing.co2Saved} kg CO₂ saved
                  </p>
                )}
                {listing.user && (
                  <p className="text-xs text-gray-500 mt-2">by {listing.user.name}</p>
                )}

                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-sm border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition-all"
                    onClick={() =>
                      navigate({ to: '/description', search: { id: listing._id } })
                    }
                  >
                    👁 View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
