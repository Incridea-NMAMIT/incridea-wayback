import axios from 'axios'

const rawBaseUrl =
  typeof import.meta.env.VITE_API_URL === 'string' && import.meta.env.VITE_API_URL.length > 0
    ? import.meta.env.VITE_API_URL
    : '/api'

const apiBaseUrl = rawBaseUrl.replace(/\/+$/, '').endsWith('/api')
  ? rawBaseUrl.replace(/\/+$/, '')
  : `${rawBaseUrl.replace(/\/+$/, '')}/api`

const rawAuthBaseUrl =
  typeof import.meta.env.VITE_AUTH_URL === 'string' && import.meta.env.VITE_AUTH_URL.length > 0
    ? import.meta.env.VITE_AUTH_URL
    : 'https://auth.incridea.in'

const authBaseUrl = rawAuthBaseUrl.replace(/\/+$/, '').endsWith('/api')
  ? rawAuthBaseUrl.replace(/\/+$/, '')
  : `${rawAuthBaseUrl.replace(/\/+$/, '')}/api`

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 5000,
})

export const archiveAuthClient = axios.create({
  baseURL: authBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 5000,
})

const rejectArchiveRequest = () => {
  return Promise.reject(new Error('This is just a snapshot. Data not available'))
}

apiClient.interceptors.request.use(rejectArchiveRequest)
archiveAuthClient.interceptors.request.use(rejectArchiveRequest)

export default apiClient
