const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://mankind-backend.vercel.app/api'

type ApiResponse<T> = {
  message: string
  data: T
}

export async function apiGet<TResponse>(path: string): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`)
  const json = (await response.json()) as ApiResponse<TResponse> | { message?: string }

  if (!response.ok) {
    throw new Error(json.message ?? 'Request failed')
  }

  return (json as ApiResponse<TResponse>).data
}

export async function apiPost<TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const json = (await response.json()) as ApiResponse<TResponse> | { message?: string }
  if (!response.ok) {
    throw new Error(json.message ?? 'Request failed')
  }

  return (json as ApiResponse<TResponse>).data
}

export async function apiPut<TResponse, TBody>(
  path: string,
  body: TBody,
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const json = (await response.json()) as ApiResponse<TResponse> | { message?: string }
  if (!response.ok) {
    throw new Error(json.message ?? 'Request failed')
  }

  return (json as ApiResponse<TResponse>).data
}

export async function apiDelete(path: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}${path}`, { method: 'DELETE' })
  if (!response.ok) {
    const json = (await response.json()) as { message?: string }
    throw new Error(json.message ?? 'Request failed')
  }
}
