import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  createProduct as createProductApi,
  editProduct,
  getProducts,
  removeProduct,
  type ProductDto,
} from '../api/products.api'

export type AdminProduct = {
  id: string
  name: string
  categoryId: string
  categoryName: string
  imageUrl: string
  price: number
  status: 'active' | 'draft'
}

type ProductInput = {
  name: string
  categoryId: string
  imageUrl?: string
  imageFile?: File | null
  price: number
  status: 'active' | 'draft'
}

type ProductsContextValue = {
  products: AdminProduct[]
  loading: boolean
  addProduct: (payload: ProductInput) => Promise<void>
  updateProduct: (id: string, payload: ProductInput) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  refetchProducts: () => Promise<void>
}

const ProductsContext = createContext<ProductsContextValue | null>(null)

function mapProduct(dto: ProductDto): AdminProduct {
  return {
    id: dto.id,
    name: dto.name,
    categoryId: dto.categoryId,
    categoryName: dto.category?.name ?? 'Unknown',
    imageUrl: dto.imageUrl,
    price: Number(dto.price),
    status: dto.isActive ? 'active' : 'draft',
  }
}

export function ProductsProvider({ children }: PropsWithChildren) {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)

  const refetchProducts = async () => {
    const data = await getProducts()
    setProducts(data.map(mapProduct))
  }

  useEffect(() => {
    ;(async () => {
      try {
        await refetchProducts()
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const addProduct = async (payload: ProductInput) => {
    const created = await createProductApi({
      name: payload.name,
      categoryId: payload.categoryId,
      brand: 'Mankind',
      group: 'Drugs',
      manufacturer: 'Mankind Life Sciences',
      packSize: '1 pack',
      description: `${payload.name} product`,
      price: payload.price,
      imageUrl: payload.imageUrl,
      imageFile: payload.imageFile,
      isActive: payload.status === 'active',
    })
    setProducts((prev) => [mapProduct(created), ...prev])
  }

  const updateProduct = async (id: string, payload: ProductInput) => {
    const updated = await editProduct(id, {
      name: payload.name,
      categoryId: payload.categoryId,
      brand: 'Mankind',
      group: 'Drugs',
      manufacturer: 'Mankind Life Sciences',
      packSize: '1 pack',
      description: `${payload.name} product`,
      price: payload.price,
      imageUrl: payload.imageUrl,
      imageFile: payload.imageFile,
      isActive: payload.status === 'active',
    })
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? mapProduct(updated) : item)),
    )
  }

  const deleteProduct = async (id: string) => {
    await removeProduct(id)
    setProducts((prev) => prev.filter((item) => item.id !== id))
  }

  const value = useMemo(
    () => ({ products, loading, addProduct, updateProduct, deleteProduct, refetchProducts }),
    [products, loading],
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider')
  }
  return context
}
