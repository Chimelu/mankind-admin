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
  type ProductsPageResult,
  type ProductDto,
} from '../api/products.api'

export type AdminProduct = {
  id: string
  name: string
  description: string
  categoryId: string
  categoryName: string
  imageUrl: string
  price: number
  status: 'active' | 'draft'
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

type ProductsContextValue = {
  products: AdminProduct[]
  loading: boolean
  currentPage: number
  totalPages: number
  totalProducts: number
  pageSize: number
  isServerPaginated: boolean
  addProduct: (payload: ProductInput) => Promise<void>
  updateProduct: (id: string, payload: ProductInput) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  setPage: (page: number) => Promise<void>
  refetchProducts: () => Promise<void>
}

const ProductsContext = createContext<ProductsContextValue | null>(null)

function mapProduct(dto: ProductDto): AdminProduct {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description,
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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)
  const [pageSize] = useState(10)
  const [isServerPaginated, setIsServerPaginated] = useState(false)

  const applyPage = (result: ProductsPageResult) => {
    setProducts(result.items.map(mapProduct))
    setCurrentPage(result.page)
    setTotalProducts(result.total)
    setTotalPages(result.totalPages)
    setIsServerPaginated(result.isServerPaginated)
  }

  const loadPage = async (page: number) => {
    const data = await getProducts(page, pageSize)
    applyPage(data)
  }

  const refetchProducts = async () => {
    await loadPage(currentPage)
  }

  const setPage = async (page: number) => {
    await loadPage(page)
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
    await createProductApi({
      name: payload.name,
      categoryId: payload.categoryId,
      brand: 'Mankind',
      group: 'Drugs',
      manufacturer: 'Mankind Life Sciences',
      packSize: '1 pack',
      description: payload.description,
      price: payload.price,
      imageUrl: payload.imageUrl,
      imageFile: payload.imageFile,
      isActive: payload.status === 'active',
    })
    await refetchProducts()
  }

  const updateProduct = async (id: string, payload: ProductInput) => {
    const updated = await editProduct(id, {
      name: payload.name,
      categoryId: payload.categoryId,
      brand: 'Mankind',
      group: 'Drugs',
      manufacturer: 'Mankind Life Sciences',
      packSize: '1 pack',
      description: payload.description,
      price: payload.price,
      imageUrl: payload.imageUrl,
      imageFile: payload.imageFile,
      isActive: payload.status === 'active',
    })
    setProducts((prev) => prev.map((item) => (item.id === id ? mapProduct(updated) : item)))
  }

  const deleteProduct = async (id: string) => {
    await removeProduct(id)
    await refetchProducts()
  }

  const value = useMemo(
    () => ({
      products,
      loading,
      currentPage,
      totalPages,
      totalProducts,
      pageSize,
      isServerPaginated,
      addProduct,
      updateProduct,
      deleteProduct,
      setPage,
      refetchProducts,
    }),
    [products, loading, currentPage, totalPages, totalProducts, pageSize, isServerPaginated],
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
