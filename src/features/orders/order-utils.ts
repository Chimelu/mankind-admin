import type { OrderFulfillmentStatus, OrderPaymentStatus } from '../../api/orders.api'

export function formatPaymentStatus(status: OrderPaymentStatus) {
  switch (status) {
    case 'pending_payment':
      return 'Awaiting payment'
    case 'partially_paid':
      return 'Partially paid'
    case 'paid':
      return 'Paid'
    case 'cancelled':
      return 'Cancelled'
    default:
      return status
  }
}

export function paymentStatusClass(status: OrderPaymentStatus) {
  switch (status) {
    case 'paid':
      return 'bg-emerald-100 text-emerald-700'
    case 'partially_paid':
      return 'bg-amber-100 text-amber-700'
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export function formatFulfillmentStatus(status: OrderFulfillmentStatus | string) {
  switch (status) {
    case 'pending':
      return 'Pending'
    case 'processing':
      return 'Processing'
    case 'shipped':
      return 'Shipped'
    case 'delivered':
      return 'Delivered'
    case 'cancelled':
      return 'Cancelled'
    default:
      return status.replace(/_/g, ' ')
  }
}

export function fulfillmentStatusClass(status: string) {
  switch (status) {
    case 'delivered':
      return 'bg-emerald-100 text-emerald-700'
    case 'shipped':
      return 'bg-blue-100 text-blue-700'
    case 'processing':
      return 'bg-amber-100 text-amber-700'
    case 'cancelled':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export function formatOrderDate(value: string) {
  return new Date(value).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatMoney(amount: number) {
  return `₦${amount.toLocaleString()}`
}

export function formatPaymentRecordStatus(status: string) {
  if (status === 'success') return 'Successful'
  if (status === 'failed') return 'Failed'
  return 'Pending'
}

export function paymentRecordClass(status: string) {
  if (status === 'success') return 'bg-emerald-100 text-emerald-700'
  if (status === 'failed') return 'bg-red-100 text-red-700'
  return 'bg-amber-100 text-amber-700'
}
