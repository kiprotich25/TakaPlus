/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api'

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT'

export async function apiFetch<T>(path: string, options: { method?: HttpMethod; body?: any; token?: string } = {}): Promise<T> {
  const { method = 'GET', body, token } = options
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    let error: any
    try { error = await res.json() } catch { error = { error: res.statusText } }
    throw new Error(error.error || 'Request failed')
  }
  return res.json()
}

// Listings
export const ListingsAPI = {
  list: () => apiFetch<any[]>('/listings'),
  get: (id: string) => apiFetch<{ listing: any; bids: any[] }>(`/listings/${id}`),
  create: (data: any, token: string) => apiFetch<any>('/listings', { method: 'POST', body: data, token }),
}

// Bids
export const BidsAPI = {
  place: (data: any, token: string) => apiFetch<any>('/bids', { method: 'POST', body: data, token }),
  accept: (bidId: string, token: string) => apiFetch<any>(`/bids/${bidId}/accept`, { method: 'POST', token }),
}

// Auth
export const AuthAPI = {
  login: (email: string, password: string) => apiFetch<{ token: string; user: any }>('/auth/login', { method: 'POST', body: { email, password } }),
  register: (data: { name: string; email: string; password: string; role?: string }) => apiFetch<{ token: string; user: any }>('/auth/register', { method: 'POST', body: data }),
}

// Bins
export const BinsAPI = {
  list: (params?: { binType?: string; status?: string; lat?: number; lng?: number; radius?: number }) => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiFetch<any[]>(`/bins${query ? `?${query}` : ''}`);
  },
  get: (id: string) => apiFetch<any>(`/bins/${id}`),
  create: (data: any, token: string) => apiFetch<any>('/bins', { method: 'POST' as const, body: data, token }),
  update: (id: string, data: any, token: string) => apiFetch<any>(`/bins/${id}`, { method: 'PUT' as const, body: data, token }),
  delete: (id: string, token: string) => apiFetch<any>(`/bins/${id}`, { method: 'DELETE' as const, token }),
  getNearby: (lat: number, lng: number, radius?: number, binType?: string) => {
    const params = new URLSearchParams({ lat: lat.toString(), lng: lng.toString() });
    if (radius) params.append('radius', radius.toString());
    if (binType) params.append('binType', binType);
    return apiFetch<any[]>(`/bins/nearby?${params.toString()}`);
  }
}

// Maps
export const MapsAPI = {
  getConfig: () => apiFetch<{ available: boolean; message: string }>('/maps/config'),
  geocode: (address: string) => apiFetch<any>(`/maps/geocode?address=${encodeURIComponent(address)}`),
  reverseGeocode: (lat: number, lng: number) => apiFetch<any>(`/maps/reverse-geocode?lat=${lat}&lng=${lng}`),
  searchNearby: (lat: number, lng: number, radius?: number, type?: string) => {
    const params = new URLSearchParams({ lat: lat.toString(), lng: lng.toString() });
    if (radius) params.append('radius', radius.toString());
    if (type) params.append('type', type);
    return apiFetch<any>(`/maps/nearby?${params.toString()}`);
  }
}


