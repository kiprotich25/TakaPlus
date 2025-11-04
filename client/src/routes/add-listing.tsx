
// client/src/routes/add-listing.tsx
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuth } from '../utils/auth'
import { ListingsAPI } from '../utils/api'

export const Route = createFileRoute('/add-listing')({
  component: AddListingComponent,
})

function AddListingComponent() {
  
  const [formData, setFormData] = useState({
    title: '',
    material: '',
    quantity: '',
    unit: 'kg',
    description: '',
    lat: '',
    lng: '',
    photoUrl: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { token, user } = useAuth()
  const navigate = useNavigate()

  // Redirect if not authenticated
  if (!user || !token) {
    navigate({ to: '/login' })
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const listingData = {
        title: formData.title,
        material: formData.material,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        description: formData.description,
        ...(formData.lat && formData.lng && {
          lat: parseFloat(formData.lat),
          lng: parseFloat(formData.lng)
        }),
        ...(formData.photoUrl && { photoUrl: formData.photoUrl })
      }

      await ListingsAPI.create(listingData, token)
      navigate({ to: '/listings' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create listing')
    } finally {
      setIsLoading(false)
    }
  }

  const commonMaterials = [
    'Plastic', 'Metal', 'Glass', 'Paper', 'Cardboard', 'Textiles', 
    'Electronics', 'Wood', 'Rubber', 'Organic Waste', 'Other'
  ]

  const units = ['kg', 'lbs', 'tons', 'pieces', 'liters', 'gallons']

  return (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-100 to-green-200 py-12 px-4 flex justify-center items-start">
    <div className="w-full max-w-2xl">
      <div className="card bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl border border-green-100">
        <div className="card-body p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-green-700 mb-2">Add New Listing</h2>
            <p className="text-base text-gray-600">
              Share your recyclable materials and contribute to a circular economy ♻️
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block font-semibold text-gray-700 mb-1">Listing Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Recycled Plastic Bottles"
                className="input input-bordered w-full focus:ring-2 focus:ring-green-400"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            {/* Material */}
            <div>
              <label htmlFor="material" className="block font-semibold text-gray-700 mb-1">Material Type *</label>
              <select
                id="material"
                name="material"
                className="select select-bordered w-full focus:ring-2 focus:ring-green-400"
                value={formData.material}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="">Select material type</option>
                {commonMaterials.map(material => (
                  <option key={material} value={material}>{material}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block font-semibold text-gray-700 mb-1">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your listing (optional)"
                className="textarea textarea-bordered w-full focus:ring-2 focus:ring-green-400"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                disabled={isLoading}
              />
            </div>

            {/* Quantity & Unit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantity" className="block font-semibold text-gray-700 mb-1">Quantity *</label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="input input-bordered w-full focus:ring-2 focus:ring-green-400"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="unit" className="block font-semibold text-gray-700 mb-1">Unit</label>
                <select
                  id="unit"
                  name="unit"
                  className="select select-bordered w-full focus:ring-2 focus:ring-green-400"
                  value={formData.unit}
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Location (Optional)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="lat"
                  type="number"
                  step="any"
                  placeholder="Latitude (e.g., 40.7128)"
                  className="input input-bordered w-full focus:ring-2 focus:ring-green-400"
                  value={formData.lat}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <input
                  name="lng"
                  type="number"
                  step="any"
                  placeholder="Longitude (e.g., -74.0060)"
                  className="input input-bordered w-full focus:ring-2 focus:ring-green-400"
                  value={formData.lng}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Photo URL */}
            <div>
              <label htmlFor="photoUrl" className="block font-semibold text-gray-700 mb-1">Photo URL (Optional)</label>
              <input
                id="photoUrl"
                name="photoUrl"
                type="url"
                placeholder="https://example.com/photo.jpg"
                className="input input-bordered w-full focus:ring-2 focus:ring-green-400"
                value={formData.photoUrl}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {/* Preview */}
            {formData.title && formData.material && formData.quantity && (
              <div className="alert bg-green-50 border border-green-200 text-green-700 flex gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold">Preview:</p>
                  <p>{formData.title} — {formData.material} · {formData.quantity} {formData.unit}</p>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={`btn w-full bg-green-600 hover:bg-green-700 text-gray-700 border-none rounded-xl transition-all duration-300 ${
                isLoading ? 'loading' : ''
              }`}
              disabled={isLoading || !formData.title || !formData.material || !formData.quantity}
            >
              {isLoading ? 'Creating Listing...' : '✅ Create Listing'}
            </button>
          </form>

          <div className="divider">OR</div>

          {/* Cancel */}
          <button
            className="btn btn-outline border-green-600 text-green-700 hover:bg-green-600 hover:text-white w-full rounded-xl transition-all"
            onClick={() => navigate({ to: '/listings' })}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)
}