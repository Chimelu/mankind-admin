const orderStats = [
  { label: 'Total Orders', value: '1,284' },
  { label: 'Pending', value: '94' },
  { label: 'Processing', value: '208' },
  { label: 'Delivered', value: '982' },
]

const orders: Array<{
  id: string
  customer: string
  items: number
  total: string
  status: string
  createdAt: string
}> = []

export function OrdersPage() {
  return (
    <section>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Sales
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Orders</h1>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {orderStats.map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
          </article>
        ))}
      </div>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-slate-900">All Orders</h2>
          <button className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700">
            Export report
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            No orders yet.
          </div>
        ) : (
          <div className="mt-4 overflow-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 font-semibold text-slate-800">{order.id}</td>
                    <td className="py-3 text-slate-700">{order.customer}</td>
                    <td className="py-3 text-slate-700">{order.items}</td>
                    <td className="py-3 font-semibold text-slate-800">{order.total}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          order.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-700'
                            : order.status === 'Processing'
                              ? 'bg-amber-100 text-amber-700'
                              : order.status === 'Pending'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-700">{order.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </section>
  )
}
