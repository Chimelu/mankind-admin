import { apiUrl } from './client'
import { getAdminAuthHeaders } from './admin-auth-headers'

export type DashboardStats = {
  totalProducts: number
  activeProducts: number
  draftProducts: number
  totalCategories: number
  totalDistributors: number
  lowStockProducts: number
  lowStockThreshold: number
}

type StatsApiResponse = {
  message?: string
  data?: DashboardStats
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await fetch(apiUrl('/admin/dashboard-stats'), {
    headers: getAdminAuthHeaders(),
  })

  const payload = (await response.json()) as StatsApiResponse
  if (!response.ok || !payload.data) {
    throw new Error(payload.message ?? 'Failed to load dashboard stats')
  }

  return payload.data
}
