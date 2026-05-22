import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDashboardStats, type DashboardStats } from '../../api/dashboard.api'
import { type AdminOrder, getAdminOrders } from '../../api/orders.api'
import { DataTable } from '../../components/common/DataTable'
import {
  formatFulfillmentStatus,
  formatMoney,
  fulfillmentStatusClass,
} from '../orders/order-utils'

const STAT_CARD_COUNT = 6

function customerLabel(order: AdminOrder) {
  if (order.customer?.companyName?.trim()) return order.customer.companyName
  if (order.customer?.fullName?.trim()) return order.customer.fullName
  return '—'
}

function StatCardSkeleton() {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="h-4 w-32 max-w-[75%] animate-pulse rounded bg-slate-200" />
      <div className="mt-3 h-9 w-24 animate-pulse rounded bg-slate-200" />
    </article>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [statsError, setStatsError] = useState('')
  const [ordersError, setOrdersError] = useState('')

  useEffect(() => {
    let mounted = true
    setStatsLoading(true)
    setStatsError('')
    getDashboardStats()
      .then((data) => {
        if (mounted) setStats(data)
      })
      .catch((err: unknown) => {
        if (mounted) {
          setStats(null)
          setStatsError(err instanceof Error ? err.message : 'Failed to load stats')
        }
      })
      .finally(() => {
        if (mounted) setStatsLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    let mounted = true
    setOrdersLoading(true)
    setOrdersError('')
    getAdminOrders({ page: 1, limit: 5 })
      .then((result) => {
        if (mounted) setRecentOrders(result.items)
      })
      .catch((err: unknown) => {
        if (mounted) {
          setRecentOrders([])
          setOrdersError(err instanceof Error ? err.message : 'Failed to load recent orders')
        }
      })
      .finally(() => {
        if (mounted) setOrdersLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const statCards = useMemo(() => {
    if (!stats) return null
    return [
      { label: 'Total products', value: String(stats.totalProducts) },
      { label: 'Active products', value: String(stats.activeProducts) },
      { label: 'Draft products', value: String(stats.draftProducts) },
      {
        label: `Low stock (≤${stats.lowStockThreshold})`,
        value: String(stats.lowStockProducts),
      },
      { label: 'Categories', value: String(stats.totalCategories) },
      { label: 'Distributors', value: String(stats.totalDistributors) },
    ]
  }, [stats])

  const fallbackStatLabels = [
    'Total products',
    'Active products',
    'Draft products',
    'Low stock',
    'Categories',
    'Distributors',
  ]

  return (
    <section>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Dashboard</h1>
      </div>

      {statsError && !statsLoading && (
        <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {statsError}
        </p>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3">
        {statsLoading
          ? Array.from({ length: STAT_CARD_COUNT }, (_, index) => (
              <StatCardSkeleton key={`stat-skeleton-${index}`} />
            ))
          : statCards
            ? statCards.map((item) => (
                <article
                  key={item.label}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
                </article>
              ))
            : fallbackStatLabels.map((label) => (
                <article
                  key={label}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-400">—</p>
                </article>
              ))}
      </div>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
          <Link
            to="/orders"
            className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-600 hover:text-emerald-700"
          >
            View all
          </Link>
        </div>
        {ordersError && !ordersLoading && (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {ordersError}
          </p>
        )}
        <div className="mt-4">
          <DataTable
            minWidthClass="min-w-[640px]"
            columns={['Order', 'Customer', 'Total', 'Status']}
            isLoading={ordersLoading}
            skeletonRowCount={5}
            emptyMessage="No recent orders yet."
            dataLength={recentOrders.length}
          >
            {recentOrders.map((order) => (
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
                <td className="px-4 py-3 font-semibold text-slate-800">
                  {formatMoney(order.totalAmount)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${fulfillmentStatusClass(order.fulfillmentStatus)}`}
                  >
                    {formatFulfillmentStatus(order.fulfillmentStatus)}
                  </span>
                </td>
              </tr>
            ))}
          </DataTable>
        </div>
      </section>
    </section>
  )
}
