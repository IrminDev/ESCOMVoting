import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ShieldCheck, Sun, Moon, LogOut, Vote, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

// ── Design tokens (DESIGN.md v2.0 oceanic) ────────────────────────────────

const NAVY      = '#050C9C'
const BLUE      = '#3572EF'
const ICE       = '#A7E6FF'
const WHITE     = '#ffffff'
const MUTE      = '#6b7a99'
const HAIRLINE  = 'rgba(58,190,249,0.27)'
const ICE_SOFT  = 'rgba(167,230,255,0.33)'
const CYAN_SOFT = 'rgba(58,190,249,0.13)'
const STEP_BG   = 'linear-gradient(135deg, #050C9C 0%, #3572EF 100%)'

const ROLE_LABEL: Record<string, string> = {
  STUDENT:   'Estudiante',
  PROFESSOR: 'Profesor',
  PAAE:      'PAAE',
}

export function VoterLayout() {
  const { session, isAdmin, logout } = useAuth()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const roleLabel = ROLE_LABEL[session?.role ?? ''] ?? (session?.role ?? '')
  const initial   = session?.name.charAt(0).toUpperCase() ?? '?'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: WHITE }}>
      {/* ── Top nav ────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 h-14 flex items-center gap-4 px-4 sm:px-6"
        style={{ background: WHITE, borderBottom: `1px solid ${HAIRLINE}` }}
      >
        {/* Logo */}
        <Link
          to="/elections"
          className="flex items-center gap-2 shrink-0 group"
          style={{ textDecoration: 'none' }}
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: STEP_BG }}
          >
            <ShieldCheck size={13} strokeWidth={2.5} style={{ color: ICE }} />
          </div>
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: NAVY, letterSpacing: '-0.02em' }}
          >
            ESCOM<span style={{ color: BLUE }}>Voting</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5 ml-2">
          <NavLink
            to="/elections"
            end
            style={({ isActive }) => ({
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '6px',
              fontSize:       '0.8125rem',
              fontWeight:     500,
              padding:        '5px 10px',
              borderRadius:   '9999px',
              textDecoration: 'none',
              transition:     'all 0.15s',
              background:     isActive ? CYAN_SOFT : 'transparent',
              color:          isActive ? NAVY      : MUTE,
            })}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              if (!el.getAttribute('aria-current')) {
                el.style.background = ICE_SOFT
                el.style.color      = NAVY
              }
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              if (!el.getAttribute('aria-current')) {
                el.style.background = 'transparent'
                el.style.color      = MUTE
              }
            }}
          >
            <Vote size={13} strokeWidth={2} />
            Elecciones
          </NavLink>

          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-150"
              style={{ color: MUTE, textDecoration: 'none', background: 'transparent' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = ICE_SOFT
                e.currentTarget.style.color      = NAVY
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color      = MUTE
              }}
            >
              <LayoutDashboard size={13} strokeWidth={2} />
              Panel admin
            </Link>
          )}
        </nav>

        {/* Right: user + actions */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* User pill */}
          <Link
            to="/elections/profile"
            className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-150"
            style={{ background: ICE_SOFT, border: `1px solid ${HAIRLINE}`, textDecoration: 'none' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = CYAN_SOFT
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = ICE_SOFT
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: STEP_BG, color: ICE }}
            >
              {initial}
            </div>
            <div className="leading-none">
              <p className="text-xs font-semibold hover:underline" style={{ color: NAVY }}>
                {session?.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: MUTE }}>
                {roleLabel}
              </p>
            </div>
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150"
            style={{ color: MUTE, background: 'transparent', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = ICE_SOFT
              e.currentTarget.style.color      = NAVY
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color      = MUTE
            }}
          >
            {isDark
              ? <Sun  size={14} strokeWidth={2} />
              : <Moon size={14} strokeWidth={2} />}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150"
            style={{ color: MUTE, background: 'transparent', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(212,43,43,0.08)'
              e.currentTarget.style.color      = '#d42b2b'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color      = MUTE
            }}
          >
            <LogOut size={14} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* ── Page content ────────────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}
