import { apiDelete, apiGet, apiPost, apiPut } from './client'

export type DistributorDto = {
  id: string
  name: string
  country: string
  city: string
  state: string
  phone: string
  email: string
  address: string
}

type DistributorInput = Omit<DistributorDto, 'id'>

export function getDistributors() {
  return apiGet<DistributorDto[]>('/distributors')
}

export function createDistributor(payload: DistributorInput) {
  return apiPost<DistributorDto, DistributorInput>('/distributors', payload)
}

export function editDistributor(id: string, payload: DistributorInput) {
  return apiPut<DistributorDto, DistributorInput>(`/distributors/${id}`, payload)
}

export function removeDistributor(id: string) {
  return apiDelete(`/distributors/${id}`)
}
