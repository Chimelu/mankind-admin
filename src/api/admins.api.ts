import { apiDelete, apiGet, apiPost, apiPut } from './client'

export type AdminDto = {
  id: string
  fullName: string
  email: string
  role: 'super_admin' | 'admin'
  isActive: boolean
}

type CreateAdminInput = {
  fullName: string
  email: string
  password: string
  role?: 'super_admin' | 'admin'
  isActive?: boolean
}

type UpdateAdminInput = {
  fullName: string
  email: string
  role: 'super_admin' | 'admin'
  isActive: boolean
  password?: string
}

export function getAdmins() {
  return apiGet<AdminDto[]>('/admins')
}

export function createAdmin(payload: CreateAdminInput) {
  return apiPost<AdminDto, CreateAdminInput>('/admins', payload)
}

export function editAdmin(id: string, payload: UpdateAdminInput) {
  return apiPut<AdminDto, UpdateAdminInput>(`/admins/${id}`, payload)
}

export function removeAdmin(id: string) {
  return apiDelete(`/admins/${id}`)
}
