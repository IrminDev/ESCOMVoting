import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard,
  Vote,
  Users,
  Upload,
  LogOut,
  Shield,
  Menu,
  X,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'

// ── Oceanic palette (DESIGN.md v2.0) ───────────────────────────────────────

const NAVY = '#050C9C'
const CYAN = '#3ABEF9'
const ICE = '#A7E6FF'
const WHITE = '#ffffff'
const MUTE = '#6b7a99'
const HAIRLINE_CYAN = 'rgba(58,190,249,0.27)'
const HAIRLINE_ICE = 'rgba(167,230,255,0.27)'
const SIDEBAR_GRADIENT =
  'linear-gradient(180deg, #050C9C 0%, #0a1ab3 60%, #040A7A 100%)'
const ACTIVE_BG = 'rgba(255,255,255,0.10)'
const ACTIVE_BG_HOVER = 'rgba(167,230,255,0.07)'

// ── Nav items ──────────────────────────────────────────────────────────────

const navItems = [
  { to: '/admin',              label: 'Dashboard',  icon: LayoutDashboard, end: true },
  { to: '/admin/elections',    label: 'Elecciones', icon: Vote },
  { to: '/admin/users',        label: 'Usuarios',   icon: Users },
  { to: '/admin/users/import', label: 'Importar',   icon: Upload },
]

const voterLink = { to: '/elections', label: 'Mis votos', icon: Vote }

// ── Sidebar link ───────────────────────────────────────────────────────────

function SideLink({
  item,
  onClick,
}: {
  item: { to: string; label: string; icon: React.ElementType; end?: boolean }
  onClick?: () => void
}) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 relative',
          isActive ? 'font-semibold' : '',
        )
      }
      style={({ isActive }) => ({
        color: isActive ? WHITE : 'rgba(167,230,255,0.85)',
        background: isActive ? ACTIVE_BG : 'transparent',
        border: `1px solid ${isActive ? HAIRLINE_ICE : 'transparent'}`,
      })}
      onMouseEnter={(e) => {
        if (!e.currentTarget.classList.contains('font-semibold')) {
          e.currentTarget.style.background = ACTIVE_BG_HOVER
          e.currentTarget.style.color = WHITE
        }
      }}
      onMouseLeave={(e) => {
        if (!e.currentTarget.classList.contains('font-semibold')) {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = 'rgba(167,230,255,0.85)'
        }
      }}
    >
      <Icon size={16} strokeWidth={2} />
      {item.label}
    </NavLink>
  )
}

// ── AdminLayout ────────────────────────────────────────────────────────────

export function AdminLayout() {
  const { session, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const sidebarContent = (
    <div
      className="flex flex-col h-full relative overflow-hidden"
      style={{ background: SIDEBAR_GRADIENT }}
    >
      {/* Ambient orb */}
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: '-20%',
          left: '-30%',
          width: '24rem',
          height: '24rem',
          background:
            'radial-gradient(circle, rgba(58,190,249,0.35) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          bottom: '-10%',
          right: '-30%',
          width: '20rem',
          height: '20rem',
          background:
            'radial-gradient(circle, rgba(167,230,255,0.18) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Logo */}
      <div
        className="relative flex items-center gap-2 px-5 h-16 shrink-0"
        style={{ borderBottom: `1px solid ${HAIRLINE_ICE}` }}
      >
        <Shield size={20} style={{ color: ICE }} strokeWidth={2} />
        <span
          className="text-sm font-semibold tracking-tight"
          style={{ color: WHITE }}
        >
          ESCOMVoting
        </span>
        <span
          className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full"
          style={{
            background: 'rgba(167,230,255,0.12)',
            color: ICE,
            border: `1px solid ${HAIRLINE_ICE}`,
            letterSpacing: '0.1em',
          }}
        >
          <Sparkles size={9} strokeWidth={2.5} />
          PAAE
        </span>
      </div>

      {/* Nav */}
      <nav className="relative flex-1 px-3 py-5 overflow-y-auto">
        <p
          className="px-3 pb-2 text-[10px] font-semibold uppercase"
          style={{ color: 'rgba(167,230,255,0.55)', letterSpacing: '0.18em' }}
        >
          Administración
        </p>
        <div className="space-y-1">
          {navItems.map((item) => (
            <SideLink
              key={item.to}
              item={item}
              onClick={() => setSidebarOpen(false)}
            />
          ))}
        </div>

        <div
          className="mt-5 pt-5"
          style={{ borderTop: `1px solid ${HAIRLINE_ICE}` }}
        >
          <p
            className="px-3 pb-2 text-[10px] font-semibold uppercase"
            style={{ color: 'rgba(167,230,255,0.55)', letterSpacing: '0.18em' }}
          >
            Votación
          </p>
          <SideLink item={voterLink} onClick={() => setSidebarOpen(false)} />
        </div>
      </nav>

      {/* Bottom */}
      <div
        className="relative px-3 py-4 space-y-2 shrink-0"
        style={{ borderTop: `1px solid ${HAIRLINE_ICE}` }}
      >
        <NavLink
          to="/admin/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150"
          style={({ isActive }) => ({
            background: isActive ? ACTIVE_BG : 'rgba(167,230,255,0.07)',
            border: `1px solid ${isActive ? HAIRLINE_ICE : 'transparent'}`,
            textDecoration: 'none'
          })}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.15)'
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains('active')) {
              e.currentTarget.style.background = 'rgba(167,230,255,0.07)'
            } else {
              e.currentTarget.style.background = ACTIVE_BG
            }
          }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0"
            style={{
              background: 'linear-gradient(135deg, #3572EF 0%, #3ABEF9 100%)',
              color: NAVY,
            }}
          >
            {session?.name.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <div className="min-w-0">
            <p
              className="text-xs font-semibold truncate"
              style={{ color: WHITE }}
            >
              {session?.name ?? 'Administrador'}
            </p>
            <p
              className="text-[10px] uppercase mt-0.5"
              style={{ color: ICE, letterSpacing: '0.15em' }}
            >
              {session?.role ?? 'PAAE'}
            </p>
          </div>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150"
          style={{
            color: 'rgba(167,230,255,0.85)',
            background: 'transparent',
            border: '1px solid transparent',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.10)'
            e.currentTarget.style.borderColor = HAIRLINE_ICE
            e.currentTarget.style.color = WHITE
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'transparent'
            e.currentTarget.style.color = 'rgba(167,230,255,0.85)'
          }}
        >
          <LogOut size={15} strokeWidth={2} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen" style={{ background: WHITE }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-64 shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(5,12,156,0.55)', backdropFilter: 'blur(4px)' }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              key="sidebar"
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-0 left-0 bottom-0 w-64 z-50 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header
          className="md:hidden h-16 flex items-center gap-3 px-5 shrink-0 sticky top-0 z-30"
          style={{
            background: WHITE,
            borderBottom: `1px solid ${HAIRLINE_CYAN}`,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg transition-colors"
            style={{
              color: NAVY,
              background: 'transparent',
              border: `1px solid ${HAIRLINE_CYAN}`,
              cursor: 'pointer',
            }}
            aria-label="Abrir menú"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
          <Shield size={18} style={{ color: NAVY }} />
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: NAVY }}
          >
            ESCOMVoting
          </span>
          <span
            className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(58,190,249,0.13)',
              color: NAVY,
              letterSpacing: '0.1em',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: CYAN }}
            />
            PAAE
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-10 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
