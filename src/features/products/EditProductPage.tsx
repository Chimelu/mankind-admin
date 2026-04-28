import { Navigate, useParams } from 'react-router-dom'
import { ProductForm } from './ProductForm'
import { useProducts } from '../../state/ProductsContext'

export function EditProductPage() {
  const { productId } = useParams()
  const { products, updateProduct } = useProducts()

  const product = products.find((item) => item.id === productId)
  if (!product) {
    return <Navigate to="/products" replace />
  }

  return (
    <ProductForm
      title="Edit Product"
      submitLabel="Save changes"
      initialValues={{
        name: product.name,
        categoryId: product.categoryId,
        imageUrl: product.imageUrl,
        price: product.price,
        status: product.status,
      }}
      onSubmit={(payload) => updateProduct(product.id, payload)}
    />
  )
}
