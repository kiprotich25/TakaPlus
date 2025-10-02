import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ListingsAPI } from '../../utils/api'
import { useAuth } from '../../utils/auth'

export const Route = createFileRoute('/listings/')({
  component: ListingsPage,
})



function ListingsPage() {
  const [listings, setListings] = useState<Array<{
    _id: string;
    title: string;
    material: string;
    quantity: number;
    unit?: string;
    photoUrl?: string;
    co2Saved?: number;
    createdAt?: string;
    user?: { name: string };
  }> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMaterial, setSelectedMaterial] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    ListingsAPI.list()
      .then(setListings)
      .catch((e) => setError(e.message))
  }, [])

  const materials = ['All', 'Plastic', 'Metal', 'Glass', 'Paper', 'Cardboard', 'Textiles', 'Electronics', 'Wood', 'Rubber', 'Organic Waste', 'Other']

  const filteredListings = listings?.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.material.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMaterial = selectedMaterial === '' || selectedMaterial === 'All' || listing.material === selectedMaterial
    return matchesSearch && matchesMaterial
  }).sort((a, b) => {
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

  if (error) return (
    <div className="alert alert-error shadow-lg">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <h3 className="font-bold">Error loading listings!</h3>
        <div className="text-xs">{error}</div>
      </div>
    </div>
  )

  if (!listings) return (
    <div className="flex flex-col items-center justify-center py-20">
      <span className="loading loading-spinner loading-lg text-primary"></span>
      <p className="mt-4 text-base-content/70">Loading listings...</p>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="hero bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl py-12">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Sustainable Materials Marketplace</h1>
            <p className="text-lg text-base-content/80 mb-6">
              Discover and trade sustainable materials to build a circular economy
            </p>
            {user && (
              <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate({ to: '/add-listing' })}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Add New Listing
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="form-control flex-1">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search listings..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-square">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Material Filter */}
            <div className="form-control">
              <select
                className="select select-bordered"
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
              >
                {materials.map(material => (
                  <option key={material} value={material === 'All' ? '' : material}>
                    {material}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="form-control">
              <select
                className="select select-bordered"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="quantity-high">Quantity: High to Low</option>
                <option value="quantity-low">Quantity: Low to High</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-base-content/70">
              Showing {filteredListings.length} of {listings.length} listings
            </p>
            {(searchTerm || selectedMaterial) && (
              <button
                className="btn btn-ghost btn-sm"
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
          <div className="w-24 h-24 mx-auto mb-6 bg-base-200 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-base-content/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No listings found</h3>
          <p className="text-base-content/70 mb-6">
            {searchTerm || selectedMaterial 
              ? "Try adjusting your search criteria or filters"
              : "Be the first to add a listing to the marketplace"
            }
          </p>
          {user && (
            <button
              className="btn btn-primary"
              onClick={() => navigate({ to: '/add-listing' })}
            >
              Add First Listing
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredListings.map((listing) => (
            <div key={listing._id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              {listing.photoUrl ? (
                <figure className="relative">
                  <img 
                    src={listing.photoUrl} 
                    alt={listing.title} 
                    className="h-48 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                  <div className=" h-48 w-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </figure>
              ) : (
                <figure className="h-48 w-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </figure>
              )}
              
              <div className="card-body">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="card-title text-lg leading-tight">{listing.title}</h2>
                  <div className="badge badge-primary badge-outline">{listing.material}</div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-base-content/70">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="font-medium">{listing.quantity} {listing.unit || 'units'}</span>
                  </div>
                  
                  {listing.co2Saved != null && (
                    <div className="flex items-center text-sm text-success">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="font-medium">{listing.co2Saved}kg CO₂ saved</span>
                    </div>
                  )}
                  
                  {listing.user && (
                    <div className="flex items-center text-sm text-base-content/60">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>by {listing.user.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="card-actions justify-end">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={ () =>  {
                        navigate({ to: '/login'});
                        console.log('navigating to login');
                    }}  //`/listings/${listing._id}`
                  >
                    
                    {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg> */}
                    View Details
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

