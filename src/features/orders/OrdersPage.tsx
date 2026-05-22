import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  type AdminOrder,
  type OrderFulfillmentStatus,
  getAdminOrders,
  updateAdminOrderStatus,
} from '../../api/orders.api'
import { DataTable } from '../../components/common/DataTable'

const FULFILLMENT_STATUSES: OrderFulfillmentStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

function formatFulfillmentLabel(status: OrderFulfillmentStatus) {
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
      return status
  }
}

function formatPaymentLabel(status: AdminOrder['paymentStatus']) {
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

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatOrderDate(value: string) {
  return new Date(value).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function customerLabel(order: AdminOrder) {
  if (order.customer?.companyName?.trim()) {
    return order.customer.companyName
  }
  if (order.customer?.fullName?.trim()) {
    return order.customer.fullName
  }
  return '—'
}

export function OrdersPage() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadOrders() {
      setLoading(true)
      setError('')
      try {
        const result = await getAdminOrders({ limit: 200 })
        if (!cancelled) {
          setOrders(result.items)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load orders')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadOrders()
    return () => {
      cancelled = true
    }
  }, [])

  const stats = useMemo(
    () => [
      { label: 'Total Orders', value: String(orders.length) },
      {
        label: 'Pending',
        value: String(orders.filter((o) => o.fulfillmentStatus === 'pending').length),
      },
      {
        label: 'Processing',
        value: String(orders.filter((o) => o.fulfillmentStatus === 'processing').length),
      },
      {
        label: 'Delivered',
        value: String(orders.filter((o) => o.fulfillmentStatus === 'delivered').length),
      },
    ],
    [orders],
  )

  async function handleStatusChange(orderId: string, fulfillmentStatus: OrderFulfillmentStatus) {
    setUpdatingOrderId(orderId)
    setError('')
    try {
      const updated = await updateAdminOrderStatus(orderId, fulfillmentStatus)
      if (updated) {
        setOrders((current) =>
          current.map((order) => (order.id === orderId ? { ...order, ...updated } : order)),
        )
      } else {
        setOrders((current) =>
          current.map((order) =>
            order.id === orderId ? { ...order, fulfillmentStatus } : order,
          ),
        )
      }
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : 'Failed to update status')
    } finally {
      setUpdatingOrderId(null)
    }
  }

  return (
    <section>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Sales
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Orders</h1>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
          </article>
        ))}
      </div>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-slate-900">All Orders</h2>
          <button
            type="button"
            className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700"
          >
            Export report
          </button>
        </div>

        <div className="mt-4">
          <DataTable
            minWidthClass="min-w-[900px]"
            columns={[
              'Order',
              'Customer',
              'Items',
              'Total',
              'Payment',
              'Fulfillment',
              'Date',
            ]}
            isLoading={loading}
            error={error || undefined}
            emptyMessage="No orders yet. When customers place orders, they will appear here."
            dataLength={orders.length}
          >
            {orders.map((order) => {
              const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
              const isUpdating = updatingOrderId === order.id

              return (
                <tr
                  key={order.id}
                  className="cursor-pointer transition hover:bg-slate-50"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    <Link
                      to={`/orders/${order.id}`}
                      onClick={(event) => event.stopPropagation()}
                      className="text-emerald-700 hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{customerLabel(order)}</td>
                  <td className="px-4 py-3 text-slate-700">{itemCount}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">
                    {formatMoney(order.totalAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {formatPaymentLabel(order.paymentStatus)}
                    </span>
                  </td>
                  <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                    <select
                      value={order.fulfillmentStatus}
                      disabled={isUpdating}
                      onChange={(event) =>
                        handleStatusChange(
                          order.id,
                          event.target.value as OrderFulfillmentStatus,
                        )
                      }
                      className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 disabled:opacity-60"
                    >
                      {FULFILLMENT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {formatFulfillmentLabel(status)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{formatOrderDate(order.createdAt)}</td>
                </tr>
              )
            })}
          </DataTable>
        </div>
      </section>
    </section>
  )
}
