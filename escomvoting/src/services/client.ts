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
    if (res.status === 403) {
      message = 'No tienes los permisos necesarios para realizar esta acción.'
    } else if (res.status === 401) {
      message = 'Tu sesión ha expirado o no has iniciado sesión.'
    }

    try {
      const data = (await res.json()) as {
        detail?: string
        message?: string
        title?: string
      }
      const backendMessage = data.detail ?? data.message ?? data.title
      if (backendMessage) {
        message = backendMessage
      }
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
    if (res.status === 403) {
      message = 'No tienes los permisos necesarios para realizar esta acción.'
    } else if (res.status === 401) {
      message = 'Tu sesión ha expirado o no has iniciado sesión.'
    }

    try {
      const data = (await res.json()) as { detail?: string; message?: string; title?: string }
      const backendMessage = data.detail ?? data.message ?? data.title
      if (backendMessage) {
        message = backendMessage
      }
    } catch { /* ignore */ }
    throw new ApiError(res.status, message)
  }

  const text = await res.text()
  if (!text) return undefined as T
  return JSON.parse(text) as T
}
