import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  createCategory,
  editCategory,
  getCategories,
  removeCategory,
} from '../api/categories.api'

export type AdminCategory = {
  id: string
  name: string
  isActive: boolean
}

type CategoryInput = Omit<AdminCategory, 'id'>

type CategoriesContextValue = {
  categories: AdminCategory[]
  loading: boolean
  addCategory: (payload: CategoryInput) => Promise<void>
  updateCategory: (id: string, payload: CategoryInput) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  refetchCategories: () => Promise<void>
}

const CategoriesContext = createContext<CategoriesContextValue | null>(null)

export function CategoriesProvider({ children }: PropsWithChildren) {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)

  const refetchCategories = async () => {
    const data = await getCategories()
    setCategories(data)
  }

  useEffect(() => {
    ;(async () => {
      try {
        await refetchCategories()
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const addCategory = async (payload: CategoryInput) => {
    const created = await createCategory(payload)
    setCategories((prev) => [created, ...prev])
  }

  const updateCategory = async (id: string, payload: CategoryInput) => {
    const updated = await editCategory(id, payload)
    setCategories((prev) =>
      prev.map((item) => (item.id === id ? updated : item)),
    )
  }

  const deleteCategory = async (id: string) => {
    await removeCategory(id)
    setCategories((prev) => prev.filter((item) => item.id !== id))
  }

  const value = useMemo(
    () => ({ categories, loading, addCategory, updateCategory, deleteCategory, refetchCategories }),
    [categories, loading],
  )

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
}

export function useCategories() {
  const context = useContext(CategoriesContext)
  if (!context) {
    throw new Error('useCategories must be used within CategoriesProvider')
  }
  return context
}
