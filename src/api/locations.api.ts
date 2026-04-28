type CountriesNowResponse<T> = {
  error: boolean
  msg: string
  data: T
}

type CountryItem = {
  name: string
}

type StateItem = {
  name: string
}

const COUNTRIES_NOW_BASE = 'https://countriesnow.space/api/v0.1/countries'

export async function getCountries() {
  const response = await fetch(`${COUNTRIES_NOW_BASE}/positions`)
  const json = (await response.json()) as CountriesNowResponse<CountryItem[]>
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'Failed to fetch countries')
  }
  return json.data.map((item) => item.name).sort((a, b) => a.localeCompare(b))
}

export async function getStatesByCountry(country: string) {
  const response = await fetch(`${COUNTRIES_NOW_BASE}/states`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ country }),
  })
  const json = (await response.json()) as CountriesNowResponse<{
    name: string
    states: StateItem[]
  }>
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'Failed to fetch states')
  }
  return json.data.states.map((item) => item.name).sort((a, b) => a.localeCompare(b))
}

export async function getCitiesByState(country: string, state: string) {
  const response = await fetch(`${COUNTRIES_NOW_BASE}/state/cities`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ country, state }),
  })
  const json = (await response.json()) as CountriesNowResponse<string[]>
  if (!response.ok || json.error) {
    throw new Error(json.msg || 'Failed to fetch cities')
  }
  return json.data.sort((a, b) => a.localeCompare(b))
}
