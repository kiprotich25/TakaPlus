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
    <div className="max-w-2xl mx-auto mt-8">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center mb-6">Add New Listing</h2>
          
          {error && (
            <div className="alert alert-error mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="form-control">
              <label className="label" htmlFor="title">
                <span className="label-text font-semibold">Listing Title *</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g., Recycled Plastic Bottles"
                className="input input-bordered w-full"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            {/* Material */}
            <div className="form-control">
              <label className="label" htmlFor="material">
                <span className="label-text font-semibold">Material Type *</span>
              </label>
              <select
                id="material"
                name="material"
                className="select select-bordered w-full"
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

            {/* Quantity and Unit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label" htmlFor="quantity">
                  <span className="label-text font-semibold">Quantity *</span>
                </label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="input input-bordered w-full"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-control">
                <label className="label" htmlFor="unit">
                  <span className="label-text font-semibold">Unit</span>
                </label>
                <select
                  id="unit"
                  name="unit"
                  className="select select-bordered w-full"
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

            {/* Location (Optional) */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Location (Optional)</span>
                <span className="label-text-alt text-base-content/70">For pickup coordination</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="lat"
                  type="number"
                  step="any"
                  placeholder="Latitude (e.g., 40.7128)"
                  className="input input-bordered w-full"
                  value={formData.lat}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <input
                  name="lng"
                  type="number"
                  step="any"
                  placeholder="Longitude (e.g., -74.0060)"
                  className="input input-bordered w-full"
                  value={formData.lng}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Photo URL (Optional) */}
            <div className="form-control">
              <label className="label" htmlFor="photoUrl">
                <span className="label-text font-semibold">Photo URL (Optional)</span>
                <span className="label-text-alt text-base-content/70">Link to image of the material</span>
              </label>
              <input
                id="photoUrl"
                name="photoUrl"
                type="url"
                placeholder="https://example.com/photo.jpg"
                className="input input-bordered w-full"
                value={formData.photoUrl}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {/* Preview */}
            {formData.title && formData.material && formData.quantity && (
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h3 className="font-bold">Preview:</h3>
                  <p className="text-sm">
                    <strong>{formData.title}</strong> - {formData.material} · {formData.quantity} {formData.unit}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
                disabled={isLoading || !formData.title || !formData.material || !formData.quantity}
              >
                {isLoading ? 'Creating Listing...' : 'Create Listing'}
              </button>
            </div>
          </form>

          <div className="divider">OR</div>
          
          <div className="text-center">
            <button
              className="btn btn-outline"
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