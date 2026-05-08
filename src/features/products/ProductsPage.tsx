import { useState } from 'react'
import { toast } from 'react-toastify'
import { ConfirmModal } from '../../components/common/ConfirmModal'
import { useCategories } from '../../state/CategoriesContext'
import { useProducts } from '../../state/ProductsContext'
import type { AdminProduct } from '../../state/ProductsContext'

export function ProductsPage() {
  const { products, loading: loadingProducts, addProduct, updateProduct, deleteProduct } = useProducts()
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories()
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<
    | { type: 'product'; id: string; label: string }
    | { type: 'category'; id: string; label: string }
    | null
  >(null)
  const [categoryError, setCategoryError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const stats = [
    { label: 'Total Products', value: String(products.length) },
    {
      label: 'Active Products',
      value: String(products.filter((item) => item.status === 'active').length),
    },
    {
      label: 'Draft Products',
      value: String(products.filter((item) => item.status === 'draft').length),
    },
    {
      label: 'Inventory Value',
      value: `₦${products
        .reduce((sum, item) => sum + item.price, 0)
        .toLocaleString()}`,
    },
  ]

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Catalog
          </p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Products</h1>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white"
        >
          Add new product
        </button>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <article key={item.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{item.value}</p>
          </article>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-slate-900">Categories</h2>
          <button
            onClick={() => setIsAddCategoryOpen(true)}
            className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700"
          >
            Create category
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {loading && (
            <p className="text-sm text-slate-500">Loading categories...</p>
          )}
          {categoryError && (
            <p className="text-sm font-medium text-red-600">{categoryError}</p>
          )}
          {categories.map((category) => (
            <div
              key={category.id}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm"
            >
              <span className="font-semibold text-slate-800">{category.name}</span>
              <button
                onClick={() => setEditingCategory({ id: category.id, name: category.name })}
                className="text-xs font-semibold text-slate-600"
              >
                Edit
              </button>
              <button
                onClick={() =>
                  setDeleteTarget({ type: 'category', id: category.id, label: category.name })
                }
                className="text-xs font-semibold text-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        {loadingProducts && <p className="pb-3 text-sm text-slate-500">Loading products...</p>}
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-3 font-medium">Image</th>
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Price</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="py-3">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
                  />
                </td>
                <td className="py-3 font-semibold text-slate-800">{product.name}</td>
                <td className="py-3 text-slate-700">{product.categoryName}</td>
                <td className="py-3 font-semibold text-slate-800">₦{product.price.toLocaleString()}</td>
                <td className="py-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    {product.status}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingProduct(product)}
                      className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        setDeleteTarget({ type: 'product', id: product.id, label: product.name })
                      }
                      className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddOpen && (
        <ProductModal
          title="Add New Product"
          submitLabel="Create product"
          onClose={() => setIsAddOpen(false)}
          initialValues={{
            name: '',
            description: '',
            categoryId: '',
            imageUrl: '',
            price: 0,
            status: 'active',
          }}
          categories={categories}
          onSubmit={async (payload) => {
            try {
              await addProduct(payload)
              toast.success('Product created successfully', toastOptions)
              setIsAddOpen(false)
            } catch (error) {
              toast.error(error instanceof Error ? error.message : 'Failed to create product', toastOptions)
            }
          }}
        />
      )}

      {editingProduct && (
        <ProductModal
          title="Edit Product"
          submitLabel="Save changes"
          onClose={() => setEditingProduct(null)}
          initialValues={{
            name: editingProduct.name,
            description: editingProduct.description,
            categoryId: editingProduct.categoryId,
            imageUrl: editingProduct.imageUrl,
            price: editingProduct.price,
            status: editingProduct.status,
          }}
          categories={categories}
          onSubmit={async (payload) => {
            try {
              await updateProduct(editingProduct.id, payload)
              toast.success('Product updated successfully', toastOptions)
              setEditingProduct(null)
            } catch (error) {
              toast.error(error instanceof Error ? error.message : 'Failed to update product', toastOptions)
            }
          }}
        />
      )}

      {isAddCategoryOpen && (
        <CategoryModal
          title="Create Category"
          submitLabel="Create"
          initialValue=""
          onClose={() => setIsAddCategoryOpen(false)}
          onSubmit={(name) => {
            setCategoryError('')
            addCategory({ name, isActive: true })
              .then(() => setIsAddCategoryOpen(false))
              .catch((error) => {
                setCategoryError(error instanceof Error ? error.message : 'Category action failed')
              })
          }}
        />
      )}

      {editingCategory && (
        <CategoryModal
          title="Edit Category"
          submitLabel="Save changes"
          initialValue={editingCategory.name}
          onClose={() => setEditingCategory(null)}
          onSubmit={(name) => {
            setCategoryError('')
            updateCategory(editingCategory.id, { name, isActive: true })
              .then(() => setEditingCategory(null))
              .catch((error) => {
                setCategoryError(error instanceof Error ? error.message : 'Category action failed')
              })
          }}
        />
      )}

      {deleteTarget && (
        <ConfirmModal
          title={`Delete ${deleteTarget.type}`}
          message={`Are you sure you want to delete "${deleteTarget.label}"?`}
          isLoading={isDeleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            setIsDeleting(true)
            try {
              if (deleteTarget.type === 'product') {
                await deleteProduct(deleteTarget.id)
                toast.success('Product deleted successfully', toastOptions)
              } else {
                setCategoryError('')
                await deleteCategory(deleteTarget.id)
                toast.success('Category deleted successfully', toastOptions)
              }
              setDeleteTarget(null)
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Delete action failed'
              if (deleteTarget.type === 'category') {
                setCategoryError(message)
              }
              toast.error(message, toastOptions)
            } finally {
              setIsDeleting(false)
            }
          }}
        />
      )}
    </section>
  )
}

type ProductInput = {
  name: string
  description: string
  categoryId: string
  imageUrl?: string
  imageFile?: File | null
  price: number
  status: 'active' | 'draft'
}

function ProductModal({
  title,
  submitLabel,
  onClose,
  initialValues,
  categories,
  onSubmit,
}: {
  title: string
  submitLabel: string
  onClose: () => void
  initialValues: ProductInput
  categories: { id: string; name: string }[]
  onSubmit: (payload: ProductInput) => Promise<void> | void
}) {
  const [form, setForm] = useState<ProductInput>(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
      <button className="absolute inset-0 bg-black/40" aria-label="Close modal" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="rounded-full border border-slate-300 px-3 py-1 text-sm">
            Close
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (!form.imageFile && !form.imageUrl) {
              setFormError('Please upload a product image.')
              return
            }
            setFormError('')
            setIsSubmitting(true)
            Promise.resolve(onSubmit(form)).finally(() => setIsSubmitting(false))
          }}
          className="mt-4 grid gap-4 md:grid-cols-2"
        >
          <Input label="Product name" value={form.name} onChange={(value) => setForm((prev) => ({ ...prev, name: value }))} />
          <TextArea
            label="Description"
            value={form.description}
            onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
          />
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Category</span>
            <select
              value={form.categoryId}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  categoryId: event.target.value,
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Product image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const nextFile = event.target.files?.[0] ?? null
                setForm((prev) => ({
                  ...prev,
                  imageFile: nextFile,
                }))
              }}
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-emerald-50 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-emerald-700 focus:border-emerald-500"
            />
            {form.imageUrl && !form.imageFile && (
              <p className="mt-1 text-xs text-slate-500">Using existing image. Choose a file to replace it.</p>
            )}
          </label>
          <Input
            label="Price (₦)"
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
                  status: event.target.value as ProductInput['status'],
                }))
              }
              className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </label>
          <button
            disabled={isSubmitting}
            className="rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70 md:col-span-2"
          >
            {isSubmitting ? 'Saving product...' : submitLabel}
          </button>
          {formError && <p className="text-sm font-medium text-red-600 md:col-span-2">{formError}</p>}
        </form>
      </div>
    </div>
  )
}

function CategoryModal({
  title,
  submitLabel,
  initialValue,
  onSubmit,
  onClose,
}: {
  title: string
  submitLabel: string
  initialValue: string
  onSubmit: (name: string) => Promise<void> | void
  onClose: () => void
}) {
  const [name, setName] = useState(initialValue)
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3">
      <button className="absolute inset-0 bg-black/40" aria-label="Close modal" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
          <button onClick={onClose} className="rounded-full border border-slate-300 px-3 py-1 text-sm">
            Close
          </button>
        </div>
        <form
          className="mt-4"
          onSubmit={(event) => {
            event.preventDefault()
            setIsSubmitting(true)
            Promise.resolve(onSubmit(name)).finally(() => setIsSubmitting(false))
          }}
        >
          <Input label="Category name" value={name} onChange={setName} />
          <button
            disabled={isSubmitting}
            className="mt-4 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Saving...' : submitLabel}
          </button>
        </form>
      </div>
    </div>
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

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block md:col-span-2">
      <span className="mb-1 block text-sm font-semibold text-slate-700">{label}</span>
      <textarea
        required
        rows={4}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500"
      />
    </label>
  )
}

const toastOptions = {
  position: 'top-right' as const,
  autoClose: 2600,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'colored' as const,
}
