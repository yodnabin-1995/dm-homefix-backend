import { useAuthStore } from '../store/authStore'
import { accountApi } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export function useAuth() {
  const { user, isAuthenticated, setAuth, logout } = useAuthStore()
  const navigate = useNavigate()

  async function login(identifier: string, password: string) {
    const { data } = await accountApi.post('/auth/login', { identifier, password })
    const profileRes = await accountApi.get('/profile', { headers: { Authorization: `Bearer ${data.accessToken}` } })
    setAuth(profileRes.data, data.accessToken, data.refreshToken)
    return profileRes.data
  }

  async function register(payload: object) {
    const { data } = await accountApi.post('/auth/register', payload)
    return data
  }

  async function verifyOtp(accountId: string, otp: string) {
    return accountApi.post('/auth/verify-otp', { accountId, otp })
  }

  function signOut() { logout(); navigate('/auth/login') }

  return { user, isAuthenticated, login, register, verifyOtp, signOut }
}
