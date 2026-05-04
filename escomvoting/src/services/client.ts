import { ApiError } from '../model/ApiError'
import { getSession } from './session.service'

const BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8080'

export async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const session = getSession()
  const headers: Record<string, string> = {}

  if (session?.token) {
    headers['Authorization'] = `Bearer ${session.token}`
  }
  if (body !== undefined && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body:
      body instanceof FormData
        ? body
        : body !== undefined
          ? JSON.stringify(body)
          : undefined,
  })

  if (!res.ok) {
    let message = `Error ${res.status}`
    try {
      const data = (await res.json()) as {
        detail?: string
        message?: string
        title?: string
      }
      message = data.detail ?? data.message ?? data.title ?? message
    } catch { /* ignore JSON parse failures on error bodies */ }
    throw new ApiError(res.status, message)
  }

  const text = await res.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}

/** Same as request() but never attaches an Authorization header (anonymous vote submission). */
export async function requestAnon<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    let message = `Error ${res.status}`
    try {
      const data = (await res.json()) as { detail?: string; message?: string; title?: string }
      message = data.detail ?? data.message ?? data.title ?? message
    } catch { /* ignore */ }
    throw new ApiError(res.status, message)
  }

  const text = await res.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}
