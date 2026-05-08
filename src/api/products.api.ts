import { apiDelete, apiUrl } from './client'

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

type ProductsListApiResponse = {
  message?: string
  data?: ProductDto[]
  pagination?: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
}

export type ProductsPageResult = {
  items: ProductDto[]
  total: number
  page: number
  limit: number
  totalPages: number
  isServerPaginated: boolean
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

export async function getProducts(page = 1, limit = 10): Promise<ProductsPageResult> {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })
  const response = await fetch(apiUrl(`/products?${query.toString()}`))
  const payload = (await response.json()) as ProductsListApiResponse | ProductDto[]

  if (!response.ok) {
    const message =
      !Array.isArray(payload) && payload.message ? payload.message : 'Failed to fetch products'
    throw new Error(message)
  }

  if (Array.isArray(payload)) {
    return {
      items: payload,
      total: payload.length,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(payload.length / limit)),
      isServerPaginated: false,
    }
  }

  const items = payload.data ?? []
  const pagination = payload.pagination

  return {
    items,
    total: pagination?.totalItems ?? items.length,
    page: pagination?.page ?? page,
    limit: pagination?.limit ?? limit,
    totalPages: pagination?.totalPages ?? Math.max(1, Math.ceil(items.length / limit)),
    isServerPaginated: Boolean(pagination),
  }
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

  const response = await fetch(apiUrl(path), {
    method,
    body: formData,
  })
  const json = (await response.json()) as { message?: string; data?: ProductDto }
  if (!response.ok || !json.data) {
    throw new Error(json.message ?? 'Request failed')
  }
  return json.data
}
