export const ADMIN_TOKEN_STORAGE_KEY = 'mankind-admin-token'

export function getAdminAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)
  if (!token) {
    throw new Error('Not authenticated')
  }
  return { Authorization: `Bearer ${token}` }
}
