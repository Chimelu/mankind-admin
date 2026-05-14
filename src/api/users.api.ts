import { apiUrl } from './client'
import { getAdminAuthHeaders } from './admin-auth-headers'

export type CustomerUserDto = {
  id: string
  fullName: string
  companyName: string
  cac: string
  address: string
  email: string
  isEmailVerified: boolean
  createdAt: string
  updatedAt: string
}

type UsersListResponse = {
  message?: string
  data?: CustomerUserDto[]
}

export async function getCustomerUsers(): Promise<CustomerUserDto[]> {
  const response = await fetch(apiUrl('/admin/users'), {
    headers: {
      ...getAdminAuthHeaders(),
    },
  })

  const payload = (await response.json()) as UsersListResponse
  if (!response.ok) {
    throw new Error(payload.message ?? 'Failed to fetch users')
  }

  return payload.data ?? []
}
