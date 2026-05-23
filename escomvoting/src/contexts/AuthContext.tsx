import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { authService } from '../services/auth.service'
import {
  clearSession,
  getSession,
  saveSession,
} from '../services/session.service'
import type { Session } from '../model/Session'

// ── Context types ──────────────────────────────────────────────────────────

interface AuthContextValue {
  session: Session | null
  isAuthenticated: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateSessionName?: (name: string) => void
}

// ── Context ────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => getSession())

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login({ email, password })
    const sess: Session = { token: res.token, role: res.role, name: res.name }
    saveSession(sess)
    setSession(sess)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setSession(null)
  }, [])

  const updateSessionName = useCallback((name: string) => {
    setSession(prev => {
      if (!prev) return null
      const updated = { ...prev, name }
      saveSession(updated)
      return updated
    })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: session !== null,
      isAdmin: session?.role === 'PAAE',
      login,
      logout,
      updateSessionName,
    }),
    [session, login, logout, updateSessionName],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ── useAuth hook ───────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
