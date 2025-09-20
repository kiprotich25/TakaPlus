import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { BinsAPI } from '../utils/api'

export const Route = createFileRoute('/bins-map')({
  component: BinsMapComponent,
})

interface Bin {
  _id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  binType: 'recycling' | 'compost' | 'general' | 'hazardous' | 'electronic';
  status: 'active' | 'maintenance' | 'full' | 'inactive';
  capacity?: number;
  currentFill?: number;
  operatingHours?: {
    open: string;
    close: string;
  };
  acceptedMaterials?: string[];
}

function BinsMapComponent() {
  const [bins, setBins] = useState<Bin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  // const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 })
  const [filters, setFilters] = useState({
    binType: '',
    status: 'active',
    radius: 10
  })

  useEffect(() => {
    loadBins()
    getUserLocation()
  })

  const loadBins = async () => {
    try {
      setLoading(true)
      const binsData = await BinsAPI.list({
        status: filters.status,
        binType: filters.binType || undefined,
        lat: userLocation?.lat,
        lng: userLocation?.lng,
        radius: filters.radius
      })
      setBins(binsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bins')
    } finally {
      setLoading(false)
    }
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(location)
          // setMapCenter(location)
        },
        (error) => {
          console.error('Error getting user location:', error)
        }
      )
    }
  }

  // const handleBinClick = (bin: Bin) => {
  //   setSelectedBin(bin)
  // }

  // const handleMapClick = () => {
  //   setSelectedBin(null)
  // }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    loadBins()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, userLocation])

  const binTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'recycling', label: 'Recycling' },
    { value: 'compost', label: 'Compost' },
    { value: 'general', label: 'General Waste' },
    { value: 'hazardous', label: 'Hazardous' },
    { value: 'electronic', label: 'Electronic' }
  ]

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'full', label: 'Full' },
    { value: 'inactive', label: 'Inactive' }
  ]

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
          <h1 className="text-3xl font-bold">Bin Locations</h1>
          <p className="text-base-content/70">Find nearby recycling and waste bins</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <select
            className="select select-bordered select-sm"
            value={filters.binType}
            onChange={(e) => handleFilterChange('binType', e.target.value)}
          >
            {binTypeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <select
            className="select select-bordered select-sm"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <select
            className="select select-bordered select-sm"
            value={filters.radius}
            onChange={(e) => handleFilterChange('radius', e.target.value)}
          >
            <option value={5}>5 km</option>
            <option value={10}>10 km</option>
            <option value={25}>25 km</option>
            <option value={50}>50 km</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body p-0">
              {/* <GoogleMap
                center={mapCenter}
                zoom={13}
                bins={bins}
                onBinClick={handleBinClick}
                onMapClick={handleMapClick}
                showUserLocation={!!userLocation}
                className="h-96 rounded-lg"
              /> */}
            </div>
          </div>
        </div>

        {/* Bin Details */}
        <div className="space-y-4">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Bin Information</h3>
              {selectedBin ? (
                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold">{selectedBin.name}</h4>
                    {selectedBin.description && (
                      <p className="text-sm text-base-content/70">{selectedBin.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className={`badge ${
                      selectedBin.status === 'active' ? 'badge-success' :
                      selectedBin.status === 'maintenance' ? 'badge-warning' :
                      selectedBin.status === 'full' ? 'badge-error' :
                      'badge-neutral'
                    }`}>
                      {selectedBin.status}
                    </span>
                    <span className="badge badge-outline">{selectedBin.binType}</span>
                  </div>

                  {selectedBin.acceptedMaterials && selectedBin.acceptedMaterials.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold">Accepts:</p>
                      <p className="text-sm text-base-content/70">
                        {selectedBin.acceptedMaterials.join(', ')}
                      </p>
                    </div>
                  )}

                  {selectedBin.operatingHours && (
                    <div>
                      <p className="text-sm font-semibold">Hours:</p>
                      <p className="text-sm text-base-content/70">
                        {selectedBin.operatingHours.open} - {selectedBin.operatingHours.close}
                      </p>
                    </div>
                  )}

                  {selectedBin.capacity && (
                    <div>
                      <p className="text-sm font-semibold">Capacity:</p>
                      <p className="text-sm text-base-content/70">
                        {selectedBin.currentFill || 0} / {selectedBin.capacity} kg
                      </p>
                      <progress 
                        className="progress progress-primary w-full" 
                        value={selectedBin.currentFill || 0} 
                        max={selectedBin.capacity}
                      ></progress>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-base-content/70">Click on a bin marker to see details</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Statistics</h3>
              <div className="stats stats-vertical">
                <div className="stat">
                  <div className="stat-title">Total Bins</div>
                  <div className="stat-value text-primary">{bins.length}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Active Bins</div>
                  <div className="stat-value text-success">
                    {bins.filter(bin => bin.status === 'active').length}
                  </div>
                </div>
                <div className="stat">
                  <div className="stat-title">Bin Types</div>
                  <div className="stat-value text-info">
                    {new Set(bins.map(bin => bin.binType)).size}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}