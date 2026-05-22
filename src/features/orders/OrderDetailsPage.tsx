import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  type AdminOrder,
  type OrderFulfillmentStatus,
  getAdminOrderById,
  updateAdminOrderStatus,
} from '../../api/orders.api'
import {
  formatFulfillmentStatus,
  formatMoney,
  formatOrderDate,
  formatPaymentRecordStatus,
  formatPaymentStatus,
  fulfillmentStatusClass,
  paymentRecordClass,
  paymentStatusClass,
} from './order-utils'

const FULFILLMENT_STATUSES: OrderFulfillmentStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

function customerName(order: AdminOrder) {
  if (order.customer?.companyName?.trim()) return order.customer.companyName
  if (order.customer?.fullName?.trim()) return order.customer.fullName
  return '—'
}

export function OrderDetailsPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState<AdminOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const loadOrder = useCallback(async () => {
    if (!orderId) {
      setLoading(false)
      setError('Order id is missing')
      return
    }

    setLoading(true)
    setError('')
    try {
      const data = await getAdminOrderById(orderId)
      setOrder(data)
    } catch (loadError) {
      setOrder(null)
      setError(loadError instanceof Error ? loadError.message : 'Failed to load order')
    } finally {
      setLoading(false)
    }
  }, [orderId])

  useEffect(() => {
    void loadOrder()
  }, [loadOrder])

  async function handleStatusChange(fulfillmentStatus: OrderFulfillmentStatus) {
    if (!order) return

    setIsUpdatingStatus(true)
    setError('')
    try {
      const updated = await updateAdminOrderStatus(order.id, fulfillmentStatus)
      setOrder(updated ?? { ...order, fulfillmentStatus })
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Failed to update status')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  if (loading) {
    return (
      <section className="animate-pulse">
        <div className="h-8 w-32 rounded bg-slate-200" />
        <div className="mt-5 h-40 rounded-2xl bg-slate-200" />
        <div className="mt-5 h-56 rounded-2xl bg-slate-200" />
        <div className="mt-5 h-48 rounded-2xl bg-slate-200" />
      </section>
    )
  }

  if (!order) {
    return (
      <section>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Order not found</h1>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          <Link
            to="/orders"
            className="mt-4 inline-flex rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white"
          >
            Back to orders
          </Link>
        </div>
      </section>
    )
  }

  const payments = order.payments ?? []

  return (
    <section>
      <div className="mb-4">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700"
        >
          <span aria-hidden="true">←</span>
          Back to orders
        </Link>
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Order details
        </p>
        <h1 className="mt-2 break-all text-2xl font-bold text-slate-900">{order.orderNumber}</h1>

        <div className="mt-3 flex flex-wrap gap-2">
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${paymentStatusClass(order.paymentStatus)}`}
          >
            Payment: {formatPaymentStatus(order.paymentStatus)}
          </span>
          <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${fulfillmentStatusClass(order.fulfillmentStatus)}`}
          >
            Fulfillment: {formatFulfillmentStatus(order.fulfillmentStatus)}
          </span>
        </div>

        <p className="mt-2 text-sm text-slate-600">
          Placed {formatOrderDate(order.createdAt)} ·{' '}
          {order.fulfillmentMethod === 'delivery' ? 'Delivery' : 'Pickup'}
        </p>
        {order.deliveryAddress && (
          <p className="mt-1 break-words text-sm text-slate-600">
            Address: {order.deliveryAddress}
          </p>
        )}
        {order.notes?.trim() && (
          <p className="mt-1 break-words text-sm text-slate-600">Notes: {order.notes}</p>
        )}

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Customer</p>
          <p className="mt-1 font-semibold text-slate-900">{customerName(order)}</p>
          {order.customer?.email && (
            <p className="mt-1 text-sm text-slate-600">{order.customer.email}</p>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Order total</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{formatMoney(order.totalAmount)}</p>
          </div>
          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total paid</p>
            <p className="mt-1 text-xl font-bold text-emerald-700">{formatMoney(order.amountPaid)}</p>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50/80 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-red-600">Balance due</p>
            <p className="mt-1 text-xl font-bold text-red-700">{formatMoney(order.balanceDue)}</p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label htmlFor="fulfillment-status" className="text-sm font-semibold text-slate-700">
            Update fulfillment status
          </label>
          <select
            id="fulfillment-status"
            value={order.fulfillmentStatus}
            disabled={isUpdatingStatus}
            onChange={(event) =>
              handleStatusChange(event.target.value as OrderFulfillmentStatus)
            }
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-60 sm:max-w-xs"
          >
            {FULFILLMENT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {formatFulfillmentStatus(status)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Items</h2>
        <div className="mt-4 space-y-3">
          {(order.items ?? []).length === 0 ? (
            <p className="text-sm text-slate-600">No items on this order.</p>
          ) : (
            (order.items ?? []).map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5">
                    {item.productImageUrl ? (
                      <img
                        src={item.productImageUrl}
                        alt={item.productName}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-slate-400">No image</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-slate-800">{item.productName}</p>
                    <p className="text-sm text-slate-600">
                      Qty: {item.quantity} · Unit: {formatMoney(item.unitPrice)}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-700 sm:text-right">
                  {formatMoney(item.lineTotal)}
                </p>
              </article>
            ))
          )}
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Payment history</h2>
        {payments.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">No payments recorded yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-2 font-semibold">Date</th>
                  <th className="px-3 py-2 font-semibold">Amount</th>
                  <th className="px-3 py-2 font-semibold">Channel</th>
                  <th className="px-3 py-2 font-semibold">Reference</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-100">
                    <td className="px-3 py-3 text-slate-700">
                      {payment.paidAt
                        ? formatOrderDate(payment.paidAt)
                        : formatOrderDate(payment.createdAt)}
                    </td>
                    <td className="px-3 py-3 font-semibold text-slate-900">
                      {formatMoney(payment.amount)}
                    </td>
                    <td className="px-3 py-3 text-slate-700">{payment.channel || '—'}</td>
                    <td className="px-3 py-3 font-mono text-xs text-slate-600">
                      {payment.paystackReference}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${paymentRecordClass(payment.status)}`}
                      >
                        {formatPaymentRecordStatus(payment.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}
