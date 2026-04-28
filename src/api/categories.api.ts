import { apiDelete, apiGet, apiPost, apiPut } from './client'

export type CategoryDto = {
  id: string
  name: string
  isActive: boolean
}

type CategoryInput = {
  name: string
  isActive?: boolean
}

export function getCategories() {
  return apiGet<CategoryDto[]>('/categories')
}

export function createCategory(payload: CategoryInput) {
  return apiPost<CategoryDto, CategoryInput>('/categories', payload)
}

export function editCategory(id: string, payload: CategoryInput) {
  return apiPut<CategoryDto, CategoryInput>(`/categories/${id}`, payload)
}

export function removeCategory(id: string) {
  return apiDelete(`/categories/${id}`)
}
