import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
type ProductFormInput = {
  name: string
  categoryId: string
  imageUrl: string
  price: number
  status: 'active' | 'draft'
}

type ProductFormProps = {
  title: string
  initialValues: ProductFormInput
  submitLabel: string
  onSubmit: (payload: ProductFormInput) => Promise<void> | void
}

export function ProductForm({
  title,
  initialValues,
  submitLabel,
  onSubmit,
}: ProductFormProps) {
  const navigate = useNavigate()
  const [form, setForm] = useState<ProductFormInput>(initialValues)

  return (
    <section>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <button
          onClick={() => navigate('/products')}
          className="rounded-full border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700"
        >
          Back to products
        </button>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          Promise.resolve(onSubmit(form)).then(() => {
            navigate('/products')
          })
        }}
        className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Product name" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} />
          <Input
            label="Category ID"
            value={form.categoryId}
            onChange={(value) => setForm((prev) => ({ ...prev, categoryId: value }))}
          />
          <Input
            label="Image URL"
            value={form.imageUrl}
            onChange={(value) => setForm((prev) => ({ ...prev, imageUrl: value }))}
          />
          <Input
            label="Price"
            type="number"
            value={String(form.price)}
            onChange={(value) => setForm((prev) => ({ ...prev, price: Number(value) }))}
          />
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Status</span>
            <select
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  status: event.target.value as ProductFormInput['status'],
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </label>
        </div>

        <button className="mt-5 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white">
          {submitLabel}
        </button>
      </form>
    </section>
  )
}

function Input({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  type?: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <input
        type={type}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
      />
    </label>
  )
}
