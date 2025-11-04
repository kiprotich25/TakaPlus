import { createFileRoute, useSearch, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ListingsAPI, BidsAPI } from '../utils/api'
import { useAuth } from '../utils/auth'

export const Route = createFileRoute('/description')({
  component: RouteComponent,
  validateSearch(search: Record<string, unknown>) {
    return {
      id: typeof search.id === 'string' ? search.id : '',
    }
  },
})

function RouteComponent() {
  return <DescriptionPage />
}

function DescriptionPage() {
  const search = useSearch({ from: '/description' })
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const [listing, setListing] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showBidModal, setShowBidModal] = useState(false)
  const [bidAmount, setBidAmount] = useState('')
  const [bidMessage, setBidMessage] = useState('')
  const [bidError, setBidError] = useState('')
  const [bidLoading, setBidLoading] = useState(false)
  const [bidSuccess, setBidSuccess] = useState(false)

  useEffect(() => {
    if (!search.id) {
      setError('No listing ID provided.')
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    ListingsAPI.get(search.id)
      .then((data) => {
        setListing(data.listing || data)
        setIsLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setIsLoading(false)
      })
  }, [search.id])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="loading loading-spinner loading-lg text-green-600"></span>
        <p className="mt-4 text-gray-500">Loading listing...</p>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="alert alert-error shadow-lg mt-8">
        <span>{error || 'Listing not found'}</span>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 space-y-8">

      {/* 🌿 Back Button */}
      <button
        onClick={() => navigate({ to: '/listings' })}
        className="btn btn-outline border-green-600 text-green-700 hover:bg-green-600 hover:text-white transition-all duration-300 flex items-center gap-2"
      >
        ← Back to Listings
      </button>

      {/* Product Card */}
      <div className="card bg-white/45 shadow-xl border border-green-100 hover:shadow-2xl transition-all duration-300 rounded-2xl overflow-hidden">
        {listing.photoUrl && (
          <figure className="relative">
            <img
              src={listing.photoUrl}
              alt={listing.title}
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </figure>
        )}

        <div className="card-body">
          <h2 className="card-title text-3xl font-bold text-green-700 mb-2">
            {listing.title}
          </h2>

          <div className="flex flex-wrap gap-2 mb-3">
            <span className="badge bg-green-100 text-green-700 border-none">
              {listing.material}
            </span>
            {listing.co2Saved != null && (
              <span className="badge bg-emerald-100 text-emerald-700 border-none">
                ♻️ {listing.co2Saved}kg CO₂ saved
              </span>
            )}
          </div>

          <div className="space-y-1 text-gray-700">
            <p>
              <span className="font-semibold">Quantity:</span> {listing.quantity}{' '}
              {listing.unit || 'units'}
            </p>
            {listing.price && (
              <p>
                <span className="font-semibold">Price:</span> KSh {listing.price}
              </p>
            )}
            {listing.location && (
              <p>
                <span className="font-semibold">Location:</span>{' '}
                {listing.location}
              </p>
            )}
          </div>

          <div className="mt-4">
            <span className="font-semibold text-gray-800">Description:</span>
            <p className="text-gray-600 mt-1 leading-relaxed">
              {listing.description || 'No description provided.'}
            </p>
          </div>

          {listing.user && (
            <p className="text-sm text-gray-500 mt-2">
              Listed by: <span className="font-medium">{listing.user.name}</span>
            </p>
          )}

          {/* Bid Button */}
          <div className="mt-6">
            <button
              onClick={() => setShowBidModal(true)}
              className="btn btn-lg bg-green-600 hover:bg-green-700 text-white font-semibold w-full transition-all duration-300"
            >
              🚀 Place a Bid
            </button>
          </div>
        </div>
      </div>

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 relative">
            <button
              onClick={() =>
                setShowBidModal(false) ||
                (setBidAmount(''), setBidMessage(''), setBidError(''))
              }
              className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold text-green-700 text-center">
              Place Your Bid
            </h3>

            {bidError && (
              <div className="alert alert-error text-sm py-2">{bidError}</div>
            )}
            {bidSuccess && (
              <div className="alert alert-success text-sm py-2">
                ✅ Bid placed successfully!
              </div>
            )}

            {!bidSuccess && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setBidError('')
                  setBidLoading(true)
                  try {
                    await BidsAPI.place(
                      {
                        listingId: listing._id,
                        amount: parseFloat(bidAmount),
                        message: bidMessage,
                      },
                      token!
                    )
                    setBidSuccess(true)
                  } catch (err: any) {
                    setBidError(err.message || 'Failed to place bid')
                  } finally {
                    setBidLoading(false)
                  }
                }}
                className="space-y-4"
              >
                <div className="form-control">
                  <label className="label font-medium text-gray-700">
                    Amount (KSh)
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full border-green-200 focus:border-green-500"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    required
                    disabled={bidLoading}
                  />
                </div>

                <div className="form-control">
                  <label className="label font-medium text-gray-700">
                    Message (optional)
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full border-green-200 focus:border-green-500"
                    value={bidMessage}
                    onChange={(e) => setBidMessage(e.target.value)}
                    rows={2}
                    disabled={bidLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="btn bg-green-600 hover:bg-green-700 text-white w-full"
                  disabled={bidLoading}
                >
                  {bidLoading ? 'Submitting...' : 'Submit Bid'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
