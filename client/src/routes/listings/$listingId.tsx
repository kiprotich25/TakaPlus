
// client/src/routes/listings/$listingId.tsx
import { createFileRoute, useNavigate, useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ListingsAPI } from '../../utils/api'
import { useAuth } from '../../utils/auth'

export const Route = createFileRoute('/listings/$listingId')({
  component: ListingDetailPage,
})


function ListingDetailPage() {
  const params = useParams({ from: '/listings/$listingId' })
  const [listing, setListing] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [bids, setBids] = useState<any[]>([])
  
  const { user, token } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        const data = await ListingsAPI.get(params.listingId) // <-- must exist in your API utils
        setListing(data)

        if (data?.bids) {
          setBids(data.bids)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load listing')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [params.listingId])

  const handleBidAction = async (bidId: string, action: 'accept' | 'reject') => {
    try {
      await ListingsAPI.create(params.listingId, token!) 
      setBids(prev => prev.map(bid => 
        bid._id === bidId ? { ...bid, status: action } : bid
      ))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed')
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-base-content/70">Loading listing...</p>
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
    <div className="max-w-4xl mx-auto mt-8 space-y-8">
      <div>TEST TEXT</div>
      {/* Listing details */}
      <div className="card bg-base-100 shadow-xl">
        {listing.photoUrl && (
          <figure>
            <img src={listing.photoUrl} alt={listing.title} className="w-full h-64 object-cover" />
          </figure>
        )}
        <div className="card-body">
          <h2 className="card-title text-3xl">{listing.title}</h2>
          <div className="flex flex-wrap gap-2 mb-2">
            <div className="badge badge-primary">{listing.material}</div>
            {listing.co2Saved != null && (
              <div className="badge badge-success">{listing.co2Saved}kg CO₂ saved</div>
            )}
          </div>
          <p className="mt-2 text-base-content/70">
            <span className="font-semibold">Quantity:</span> {listing.quantity} {listing.unit || 'units'}
          </p>
          {listing.price && (
            <p className="text-base-content/70"><span className="font-semibold">Price:</span> KSh {listing.price}</p>
          )}
          {listing.location && (
            <p className="text-base-content/70"><span className="font-semibold">Location:</span> {listing.location}</p>
          )}
          {listing.description && (
            <p className="mt-4 text-base-content/80">{listing.description}</p>
          )}
          {listing.user && (
            <p className="text-sm text-base-content/60 mt-2">Listed by: {listing.user.name}</p>
          )}
        </div>
      </div>

      {/* Bids section */}
      <div className="card bg-base-200 shadow-md">
        <div className="card-body">
          <h3 className="card-title text-2xl mb-4">Bids Received</h3>

          {bids.length === 0 ? (
            <p className="text-base-content/70">No bids yet for this listing.</p>
          ) : (
            <div className="space-y-4">
              {bids.map(bid => (
                <div
                  key={bid._id}
                  className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-base-100 rounded-lg shadow"
                >
                  <div>
                    <p className="font-semibold">
                      {bid.user?.name || 'Anonymous'} offered {bid.amount} {listing.unit}
                    </p>
                    <p className="text-sm text-base-content/70">Status: {bid.status || "pending"}</p>
                  </div>
                  {user && user.id === listing.user?._id && bid.status === 'pending' && (
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleBidAction(bid._id, 'accept')}
                      >
                        Accept
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleBidAction(bid._id, 'reject')}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Back button */}
      <div className="text-center">
        <button className="btn btn-outline" onClick={() => navigate({ to: "/listings" })}>
          Back to Listings
        </button>
      </div>
    </div>
  )
}




// import { createFileRoute } from '@tanstack/react-router'
// import { useParams } from '@tanstack/react-router'
// import { useEffect, useState } from 'react'
// import { ListingsAPI } from '../utils/api'

// export const Route = createFileRoute('/listings/$listingId')({
//   component: ListingDetail,
// })

// function ListingDetail() {
//   const { listingId } = useParams({ from: '/listings/$listingId' })
//   const [listing, setListing] = useState<any>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     ListingsAPI.get(listingId)
//       .then(setListing)
//       .finally(() => setLoading(false))
//   }, [listingId])

//   if (loading) return <div className="p-4">Loading...</div>
//   if (!listing) return <div className="p-4">Listing not found</div>

//   return (
//     <div className="p-4 max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">{listing.title}</h1>
//       <img
//         src={listing.photoUrl}
//         alt={listing.title}
//         className="w-full max-h-96 object-cover rounded mb-4"
//       />
//       <p>{listing.description}</p>
//       <p className="text-gray-500">Material: {listing.material}</p>
//       <p className="text-gray-500">Location: {listing.location}</p>
//       <p className="text-gray-500">Price: KSh {listing.price}</p>
//     </div>
//   )
// }
