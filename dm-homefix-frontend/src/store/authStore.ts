import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '../types'

interface AuthState {
  user: User | null; accessToken: string | null; isAuthenticated: boolean
  setAuth: (user: User, token: string, refresh: string) => void
  updateUser: (u: Partial<User>) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, accessToken: null, isAuthenticated: false,
      setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        set({ user, accessToken, isAuthenticated: true })
      },
      updateUser: (u) => set(s => ({ user: s.user ? { ...s.user, ...u } : null })),
      logout: () => { localStorage.clear(); set({ user:null, accessToken:null, isAuthenticated:false }) },
    }),
    { name: 'dm-homefix-auth' }
  )
)
