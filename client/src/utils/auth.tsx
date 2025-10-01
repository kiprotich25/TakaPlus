import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { AuthAPI } from './api'

type User = { id: string; name: string; email: string; role?: string }

type AuthContextType = {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; password: string; role?: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed.user)
      setToken(parsed.token)
    }
  }, [])

  const value = useMemo<AuthContextType>(() => ({
    user,
    token,
    async login(email, password) {
      const { token, user } = await AuthAPI.login(email, password)
      setUser(user)
      setToken(token)
      localStorage.setItem('auth', JSON.stringify({ user, token }))
    },
    async register(data) {
      const { token, user } = await AuthAPI.register(data)
      setUser(user)
      setToken(token)
      localStorage.setItem('auth', JSON.stringify({ user, token }))
    },
    logout() {
      setUser(null)
      setToken(null)
      localStorage.removeItem('auth')
    }
  }), [user, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


