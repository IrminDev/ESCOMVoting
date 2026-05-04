import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Shield, Sun, Moon, LogOut, Vote, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { cn } from '../../lib/utils'

const ROLE_LABEL: Record<string, string> = {
  STUDENT:   'Estudiante',
  PROFESSOR: 'Profesor',
  ADMIN:     'Administrador',
}

export function VoterLayout() {
  const { session, logout } = useAuth()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const roleLabel = ROLE_LABEL[session?.role ?? ''] ?? session?.role ?? ''
  const isAdmin = session?.role === 'ADMIN'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--canvas)' }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-30 h-14 flex items-center gap-4 px-4 sm:px-6"
        style={{
          background: 'var(--surface)',
          borderBottom: '1px solid var(--hairline)',
        }}
      >
        {/* Logo */}
        <Link
          to="/elections"
          className="flex items-center gap-2 shrink-0"
          style={{ textDecoration: 'none' }}
        >
          <Shield size={18} style={{ color: 'var(--accent-red)' }} strokeWidth={2} />
          <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            ESCOMVoting
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1 ml-2">
          <NavLink
            to="/elections"
            end
            className={({ isActive }) =>
              cn(
                'flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-150',
                isActive
                  ? 'text-[var(--text-primary)] bg-[var(--surface-elevated)]'
                  : 'text-[var(--text-mute)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]',
              )
            }
          >
            <Vote size={14} strokeWidth={2} />
            Elecciones
          </NavLink>

          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-150"
              style={{ color: 'var(--text-mute)', textDecoration: 'none' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)'
                e.currentTarget.style.background = 'var(--surface-elevated)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-mute)'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <LayoutDashboard size={14} strokeWidth={2} />
              Panel admin
            </Link>
          )}
        </nav>

        {/* Right: user info + actions */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Role + name pill */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: 'var(--surface-elevated)', border: '1px solid var(--hairline)' }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{ background: 'var(--accent-blue-soft)', color: 'var(--accent-blue)' }}
            >
              {session?.name.charAt(0).toUpperCase() ?? '?'}
            </div>
            <div className="leading-none">
              <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                {session?.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-ash)' }}>
                {roleLabel}
              </p>
            </div>
          </div>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="p-2 rounded-md transition-colors duration-150"
            style={{ color: 'var(--text-mute)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)'
              e.currentTarget.style.background = 'var(--surface-elevated)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-mute)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            {isDark ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="p-2 rounded-md transition-colors duration-150"
            aria-label="Cerrar sesión"
            style={{ color: 'var(--text-mute)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent-red)'
              e.currentTarget.style.background = 'var(--accent-red-soft)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-mute)'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <LogOut size={15} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
