import { apiDelete, apiGet, apiPost, apiPut } from './client'

export type ProductDto = {
  id: string
  name: string
  categoryId: string
  brand: string
  group: 'Drugs' | 'Non-Drugs' | 'Laboratory Tests'
  manufacturer: string
  packSize: string
  description: string
  price: number | string
  imageUrl: string
  isActive: boolean
  category?: { id: string; name: string }
}

type ProductInput = {
  name: string
  categoryId: string
  brand?: string
  group: 'Drugs' | 'Non-Drugs' | 'Laboratory Tests'
  manufacturer: string
  packSize: string
  description: string
  price: number
  imageUrl: string
  isActive?: boolean
}

export function getProducts() {
  return apiGet<ProductDto[]>('/products')
}

export function createProduct(payload: ProductInput) {
  return apiPost<ProductDto, ProductInput>('/products', payload)
}

export function editProduct(id: string, payload: ProductInput) {
  return apiPut<ProductDto, ProductInput>(`/products/${id}`, payload)
}

export function removeProduct(id: string) {
  return apiDelete(`/products/${id}`)
}
