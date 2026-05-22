import { apiUrl } from './client'
import { getAdminAuthHeaders } from './admin-auth-headers'

export type OrderFulfillmentStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type OrderPaymentStatus = 'pending_payment' | 'partially_paid' | 'paid' | 'cancelled'

export type AdminOrderCustomer = {
  id: string
  fullName: string
  companyName: string
  email: string
}

export type AdminOrderLineItem = {
  id: string
  productId: string
  productName: string
  productImageUrl: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export type AdminOrderPayment = {
  id: string
  orderId: string
  amount: number
  currency: string
  status: 'pending' | 'success' | 'failed'
  paystackReference: string
  paystackTransactionId: string
  channel: string
  paidAt: string | null
  failureReason: string
  createdAt: string
}

export type AdminOrder = {
  id: string
  orderNumber: string
  paymentStatus: OrderPaymentStatus
  fulfillmentStatus: OrderFulfillmentStatus
  subtotal: number
  serviceFee: number
  totalAmount: number
  amountPaid: number
  balanceDue: number
  fulfillmentMethod: 'pickup' | 'delivery'
  deliveryAddress: string
  notes: string
  createdAt: string
  updatedAt: string
  items?: AdminOrderLineItem[]
  payments?: AdminOrderPayment[]
  customer?: AdminOrderCustomer
}

type OrdersListResponse = {
  message?: string
  data?: AdminOrder[]
  pagination?: {
    page: number
    limit: number
    totalItems: number
    totalPages: number
  }
}

type OrderResponse = {
  message?: string
  data?: AdminOrder
}

export async function getAdminOrders(params?: { page?: number; limit?: number }) {
  const searchParams = new URLSearchParams()
  if (params?.page) searchParams.set('page', String(params.page))
  if (params?.limit) searchParams.set('limit', String(params.limit))
  const query = searchParams.toString()

  const response = await fetch(apiUrl(`/admin/orders${query ? `?${query}` : ''}`), {
    headers: {
      ...getAdminAuthHeaders(),
    },
  })

  const payload = (await response.json()) as OrdersListResponse
  if (!response.ok) {
    throw new Error(payload.message ?? 'Failed to fetch orders')
  }

  return {
    items: payload.data ?? [],
    pagination: payload.pagination,
  }
}

export async function getAdminOrderById(orderId: string) {
  const response = await fetch(apiUrl(`/admin/orders/${orderId}`), {
    headers: {
      ...getAdminAuthHeaders(),
    },
  })

  const payload = (await response.json()) as OrderResponse
  if (!response.ok) {
    throw new Error(payload.message ?? 'Failed to fetch order')
  }

  if (!payload.data) {
    throw new Error('Order not found')
  }

  return payload.data
}

export async function updateAdminOrderStatus(
  orderId: string,
  fulfillmentStatus: OrderFulfillmentStatus,
) {
  const response = await fetch(apiUrl(`/admin/orders/${orderId}/status`), {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAdminAuthHeaders(),
    },
    body: JSON.stringify({ fulfillmentStatus }),
  })

  const payload = (await response.json()) as OrderResponse
  if (!response.ok) {
    throw new Error(payload.message ?? 'Failed to update order status')
  }

  return payload.data
}
