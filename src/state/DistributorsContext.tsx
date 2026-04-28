import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'
import {
  createDistributor,
  editDistributor,
  getDistributors,
  removeDistributor,
} from '../api/distributors.api'

export type AdminDistributor = {
  id: string
  name: string
  country: string
  city: string
  state: string
  phone: string
  email: string
  address: string
}

type DistributorInput = Omit<AdminDistributor, 'id'>

type DistributorsContextValue = {
  distributors: AdminDistributor[]
  loading: boolean
  addDistributor: (payload: DistributorInput) => Promise<void>
  updateDistributor: (id: string, payload: DistributorInput) => Promise<void>
  deleteDistributor: (id: string) => Promise<void>
  refetchDistributors: () => Promise<void>
}

const DistributorsContext = createContext<DistributorsContextValue | null>(null)

export function DistributorsProvider({ children }: PropsWithChildren) {
  const [distributors, setDistributors] = useState<AdminDistributor[]>([])
  const [loading, setLoading] = useState(true)

  const refetchDistributors = async () => {
    const data = await getDistributors()
    setDistributors(data)
  }

  useEffect(() => {
    ;(async () => {
      try {
        await refetchDistributors()
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const addDistributor = async (payload: DistributorInput) => {
    const created = await createDistributor(payload)
    setDistributors((prev) => [created, ...prev])
  }

  const updateDistributor = async (id: string, payload: DistributorInput) => {
    const updated = await editDistributor(id, payload)
    setDistributors((prev) =>
      prev.map((item) => (item.id === id ? updated : item)),
    )
  }

  const deleteDistributor = async (id: string) => {
    await removeDistributor(id)
    setDistributors((prev) => prev.filter((item) => item.id !== id))
  }

  const value = useMemo(
    () => ({
      distributors,
      loading,
      addDistributor,
      updateDistributor,
      deleteDistributor,
      refetchDistributors,
    }),
    [distributors, loading],
  )

  return <DistributorsContext.Provider value={value}>{children}</DistributorsContext.Provider>
}

export function useDistributors() {
  const context = useContext(DistributorsContext)
  if (!context) {
    throw new Error('useDistributors must be used within DistributorsProvider')
  }
  return context
}
