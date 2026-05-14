import { ProductForm } from './ProductForm'
import { useProducts } from '../../state/ProductsContext'

export function AddProductPage() {
  const { addProduct } = useProducts()

  return (
    <ProductForm
      title="Add New Product"
      submitLabel="Create product"
      initialValues={{
        name: '',
        description: '',
        categoryId: '',
        imageUrl: '',
        price: 0,
        quantity: 0,
        status: 'active',
      }}
      onSubmit={addProduct}
    />
  )
}
