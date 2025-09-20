import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useAuth } from '../utils/auth'
import { BinsAPI } from '../utils/api'

export const Route = createFileRoute('/admin-bins')({
  component: AdminBinsComponent,
})

interface Bin {
  _id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  address?: string;
  binType: 'recycling' | 'compost' | 'general' | 'hazardous' | 'electronic';
  status: 'active' | 'maintenance' | 'full' | 'inactive';
  capacity?: number;
  currentFill?: number;
  operatingHours?: {
    open: string;
    close: string;
  };
  acceptedMaterials?: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
  };
  addedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

function AdminBinsComponent() {
  const [bins, setBins] = useState<Bin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBin, setEditingBin] = useState<Bin | null>(null)
  
  const { user, token } = useAuth()
  const navigate = useNavigate()

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    navigate({ to: '/login' })
    return null
  }

  useEffect(() => {
    loadBins()
  }, [])

  const loadBins = async () => {
    try {
      setLoading(true)
      const binsData = await BinsAPI.list()
      setBins(binsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bins')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (binId: string) => {
    if (!confirm('Are you sure you want to delete this bin?')) return
    
    try {
      await BinsAPI.delete(binId, token!)
      setBins(bins.filter(bin => bin._id !== binId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete bin')
    }
  }

  const handleStatusChange = async (binId: string, newStatus: string) => {
    try {
      const updatedBin = await BinsAPI.update(binId, { status: newStatus }, token!)
      setBins(bins.map(bin => bin._id === binId ? updatedBin : bin))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bin status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bin Management</h1>
          <p className="text-base-content/70">Manage recycling and waste bins</p>
        </div>
        
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Bin
        </button>
      </div>

      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Bins Table */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Added By</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bins.map(bin => (
                  <tr key={bin._id}>
                    <td>
                      <div>
                        <div className="font-semibold">{bin.name}</div>
                        {bin.description && (
                          <div className="text-sm text-base-content/70">{bin.description}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline capitalize">{bin.binType}</span>
                    </td>
                    <td>
                      <select
                        className={`select select-sm ${
                          bin.status === 'active' ? 'select-success' :
                          bin.status === 'maintenance' ? 'select-warning' :
                          bin.status === 'full' ? 'select-error' :
                          'select-neutral'
                        }`}
                        value={bin.status}
                        onChange={(e) => handleStatusChange(bin._id, e.target.value)}
                      >
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="full">Full</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>{bin.address || 'No address'}</div>
                        <div className="text-base-content/70">
                          {bin.lat.toFixed(4)}, {bin.lng.toFixed(4)}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>{bin.addedBy.name}</div>
                        <div className="text-base-content/70">{bin.addedBy.email}</div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        {new Date(bin.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setEditingBin(bin)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => handleDelete(bin._id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Bin Modal */}
      {(showAddForm || editingBin) && (
        <AddEditBinModal
          bin={editingBin}
          onClose={() => {
            setShowAddForm(false)
            setEditingBin(null)
          }}
          onSave={(binData) => {
            // Handle save logic here
            setShowAddForm(false)
            setEditingBin(null)
            loadBins()
          }}
          token={token!}
        />
      )}
    </div>
  )
}

// Add/Edit Bin Modal Component
function AddEditBinModal({ 
  bin, 
  onClose, 
  onSave, 
  token 
}: { 
  bin: Bin | null
  onClose: () => void
  onSave: (binData: any) => void
  token: string
}) {
  const [formData, setFormData] = useState({
    name: bin?.name || '',
    description: bin?.description || '',
    lat: bin?.lat?.toString() || '',
    lng: bin?.lng?.toString() || '',
    address: bin?.address || '',
    binType: bin?.binType || 'recycling',
    status: bin?.status || 'active',
    capacity: bin?.capacity?.toString() || '',
    currentFill: bin?.currentFill?.toString() || '0',
    operatingHours: {
      open: bin?.operatingHours?.open || '06:00',
      close: bin?.operatingHours?.close || '22:00'
    },
    acceptedMaterials: bin?.acceptedMaterials?.join(', ') || '',
    contactInfo: {
      phone: bin?.contactInfo?.phone || '',
      email: bin?.contactInfo?.email || ''
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const binData = {
        ...formData,
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        capacity: formData.capacity ? parseFloat(formData.capacity) : undefined,
        currentFill: parseFloat(formData.currentFill),
        acceptedMaterials: formData.acceptedMaterials.split(',').map(s => s.trim()).filter(Boolean)
      }

      if (bin) {
        await BinsAPI.update(bin._id, binData, token)
      } else {
        await BinsAPI.create(binData, token)
      }
      
      onSave(binData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save bin')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">
          {bin ? 'Edit Bin' : 'Add New Bin'}
        </h3>
        
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name *</span>
              </label>
              <input
                type="text"
                name="name"
                className="input input-bordered"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Type *</span>
              </label>
              <select
                name="binType"
                className="select select-bordered"
                value={formData.binType}
                onChange={handleChange}
                required
              >
                <option value="recycling">Recycling</option>
                <option value="compost">Compost</option>
                <option value="general">General Waste</option>
                <option value="hazardous">Hazardous</option>
                <option value="electronic">Electronic</option>
              </select>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              name="description"
              className="textarea textarea-bordered"
              value={formData.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Latitude *</span>
              </label>
              <input
                type="number"
                step="any"
                name="lat"
                className="input input-bordered"
                value={formData.lat}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Longitude *</span>
              </label>
              <input
                type="number"
                step="any"
                name="lng"
                className="input input-bordered"
                value={formData.lng}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Address</span>
            </label>
            <input
              type="text"
              name="address"
              className="input input-bordered"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Status</span>
              </label>
              <select
                name="status"
                className="select select-bordered"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="full">Full</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Capacity (kg)</span>
              </label>
              <input
                type="number"
                name="capacity"
                className="input input-bordered"
                value={formData.capacity}
                onChange={handleChange}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Current Fill (kg)</span>
              </label>
              <input
                type="number"
                name="currentFill"
                className="input input-bordered"
                value={formData.currentFill}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Accepted Materials (comma-separated)</span>
            </label>
            <input
              type="text"
              name="acceptedMaterials"
              className="input input-bordered"
              value={formData.acceptedMaterials}
              onChange={handleChange}
              placeholder="plastic, paper, glass, metal"
            />
          </div>

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : (bin ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}