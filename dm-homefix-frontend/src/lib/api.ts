import axios from 'axios'

const ACCOUNT_API = import.meta.env.VITE_ACCOUNT_API || 'http://localhost:3001/api/v1'
const TV_API      = import.meta.env.VITE_TV_API      || 'http://localhost:3002/api/v1'
const CATALOG_API = import.meta.env.VITE_CATALOG_API || 'http://localhost:3003/api/v1'
const BOOKING_API = import.meta.env.VITE_BOOKING_API || 'http://localhost:3004/api/v1'
const QUOTE_API   = import.meta.env.VITE_QUOTE_API   || 'http://localhost:3005/api/v1'
const JOB_API     = import.meta.env.VITE_JOB_API     || 'http://localhost:3006/api/v1'
const PAYMENT_API = import.meta.env.VITE_PAYMENT_API || 'http://localhost:3007/api/v1'
const REVIEW_API  = import.meta.env.VITE_REVIEW_API  || 'http://localhost:3008/api/v1'
const NOTIF_API   = import.meta.env.VITE_NOTIF_API   || 'http://localhost:3009/api/v1'

function createClient(baseURL: string) {
  const client = axios.create({ baseURL, timeout: 10000 })
  client.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })
  client.interceptors.response.use(r => r, err => {
    if (err.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/auth/login'
    }
    return Promise.reject(err)
  })
  return client
}

export const accountApi = createClient(ACCOUNT_API)
export const tvApi      = createClient(TV_API)
export const catalogApi = createClient(CATALOG_API)
export const bookingApi = createClient(BOOKING_API)
export const quoteApi   = createClient(QUOTE_API)
export const jobApi     = createClient(JOB_API)
export const paymentApi = createClient(PAYMENT_API)
export const reviewApi  = createClient(REVIEW_API)
export const notifApi   = createClient(NOTIF_API)
