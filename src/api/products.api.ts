import { apiDelete, apiGet } from './client'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'

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
  imageUrl?: string
  imageFile?: File | null
  isActive?: boolean
}

export function getProducts() {
  return apiGet<ProductDto[]>('/products')
}

export function createProduct(payload: ProductInput) {
  return uploadProduct('/products', 'POST', payload)
}

export function editProduct(id: string, payload: ProductInput) {
  return uploadProduct(`/products/${id}`, 'PUT', payload)
}

export function removeProduct(id: string) {
  return apiDelete(`/products/${id}`)
}

async function uploadProduct(path: string, method: 'POST' | 'PUT', payload: ProductInput) {
  const formData = new FormData()
  formData.append('name', payload.name)
  formData.append('categoryId', payload.categoryId)
  formData.append('brand', payload.brand ?? 'Mankind')
  formData.append('group', payload.group)
  formData.append('manufacturer', payload.manufacturer)
  formData.append('packSize', payload.packSize)
  formData.append('description', payload.description)
  formData.append('price', String(payload.price))
  formData.append('isActive', String(payload.isActive ?? true))

  if (payload.imageFile) {
    formData.append('image', payload.imageFile)
  } else if (payload.imageUrl) {
    formData.append('imageUrl', payload.imageUrl)
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    body: formData,
  })
  const json = (await response.json()) as { message?: string; data?: ProductDto }
  if (!response.ok || !json.data) {
    throw new Error(json.message ?? 'Request failed')
  }
  return json.data
}
