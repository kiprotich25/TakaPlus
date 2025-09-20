import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ListingsAPI } from '../utils/api'
import { useAuth } from '../utils/auth'

export const Route = createFileRoute('/listings')({
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
  }> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    ListingsAPI.list()
      .then(setListings)
      .catch((e) => setError(e.message))
  }, [])

  if (error) return <div className="alert alert-error">{error}</div>
  if (!listings) return <div className="flex justify-center py-10"><span className="loading loading-spinner"></span></div>

  return (
    <div>
      {/* Header with Add Listing Button */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold">Available Listings</h1>
        <div className="flex gap-2">
          <button
            className="btn btn-accent"
            onClick={() => navigate({ to: '/bins-map' })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Find Bins
          </button>
          {user && (
            <button
              className="btn btn-primary"
              onClick={() => navigate({ to: '/add-listing' })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Listing
            </button>
          )}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {listings.map((l) => (
          <div key={l._id} className="card bg-base-200 shadow">
            {l.photoUrl && (
              <figure>
                <img src={l.photoUrl} alt={l.title} className="h-48 w-full object-cover" />
              </figure>
            )}
            <div className="card-body">
              <h2 className="card-title">{l.title}</h2>
              <p className="text-sm text-base-content/70">{l.material} · {l.quantity}{l.unit ? ` ${l.unit}` : ''}</p>
              {l.co2Saved != null && (
                <div className="badge badge-success badge-outline">CO₂ saved: {l.co2Saved}</div>
              )}
              <div className="card-actions justify-end">
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => navigate({ to: `/listings/${l._id}` })}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

