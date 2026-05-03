const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'

type ApiResponse<T> = {
  message: string
  data: T
}

export type AdminAuthUser = {
  id: string
  fullName: string
  email: string
  role: 'super_admin' | 'admin'
  isActive: boolean
}

export async function loginAdmin(payload: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const json = (await response.json()) as
    | ApiResponse<{ admin: AdminAuthUser; token: string }>
    | { message?: string }
  if (!response.ok) {
    throw new Error(json.message ?? 'Login failed')
  }
  return (json as ApiResponse<{ admin: AdminAuthUser; token: string }>).data
}

export async function sendAdminPasswordResetOtp(payload: { email: string }) {
  const response = await fetch(`${API_BASE_URL}/admin/auth/send-password-reset-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const json = (await response.json()) as
    | ApiResponse<{ email: string; expiresInMinutes: number }>
    | { message?: string }
  if (!response.ok) {
    throw new Error(json.message ?? 'Request failed')
  }
  return (json as ApiResponse<{ email: string; expiresInMinutes: number }>).data
}

export async function verifyAdminPasswordResetOtp(payload: { email: string; otp: string }) {
  const response = await fetch(`${API_BASE_URL}/admin/auth/verify-password-reset-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const json = (await response.json()) as ApiResponse<{ verified: boolean }> | { message?: string }
  if (!response.ok) {
    throw new Error(json.message ?? 'Request failed')
  }
  return (json as ApiResponse<{ verified: boolean }>).data
}

export async function resetAdminPassword(payload: {
  email: string
  otp: string
  newPassword: string
}) {
  const response = await fetch(`${API_BASE_URL}/admin/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const json = (await response.json()) as ApiResponse<{ updated: boolean }> | { message?: string }
  if (!response.ok) {
    throw new Error(json.message ?? 'Request failed')
  }
  return (json as ApiResponse<{ updated: boolean }>).data
}

async function authRequest<TResponse>(
  path: string,
  token: string,
  method: 'GET' | 'PUT',
  body?: unknown,
) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const json = (await response.json()) as ApiResponse<TResponse> | { message?: string }
  if (!response.ok) {
    throw new Error(json.message ?? 'Request failed')
  }
  return (json as ApiResponse<TResponse>).data
}

export function getAdminProfile(token: string) {
  return authRequest<AdminAuthUser>('/admin/auth/me', token, 'GET')
}

export function updateAdminProfile(
  token: string,
  payload: { fullName: string; email: string },
) {
  return authRequest<AdminAuthUser>('/admin/auth/profile', token, 'PUT', payload)
}

export function updateAdminPassword(
  token: string,
  payload: { currentPassword: string; newPassword: string },
) {
  return authRequest<{ changed: boolean }>(
    '/admin/auth/change-password',
    token,
    'PUT',
    payload,
  )
}
