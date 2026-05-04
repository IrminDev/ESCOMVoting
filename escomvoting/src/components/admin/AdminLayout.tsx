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
  Sun,
  Moon,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { cn } from '../../lib/utils'

// ── Nav items ──────────────────────────────────────────────────────────────

const navItems = [
  { to: '/admin',              label: 'Dashboard',   icon: LayoutDashboard, end: true },
  { to: '/admin/elections',    label: 'Elecciones',  icon: Vote },
  { to: '/admin/users',        label: 'Usuarios',    icon: Users },
  { to: '/admin/users/import', label: 'Importar',    icon: Upload },
]

const voterLink = { to: '/elections', label: 'Mis votos', icon: Vote }

// ── Shared styles ──────────────────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  background: 'var(--surface-elevated)',
  border: '1px solid var(--hairline)',
  borderRadius: '8px',
  color: 'var(--text-primary)',
}

// Exported so page components can reuse it
export { inputStyle }

// ── Sidebar link ───────────────────────────────────────────────────────────

function SideLink({
  item,
  onClick,
}: {
  item: (typeof navItems)[number]
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
          'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150',
          isActive
            ? 'text-[var(--text-primary)] bg-[var(--surface-elevated)]'
            : 'text-[var(--text-mute)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]',
        )
      }
    >
      <Icon size={15} strokeWidth={2} />
      {item.label}
    </NavLink>
  )
}

// ── AdminLayout ────────────────────────────────────────────────────────────

export function AdminLayout() {
  const { session, logout } = useAuth()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const sidebarContent = (
    <div
      className="flex flex-col h-full"
      style={{ background: 'var(--surface)', borderRight: '1px solid var(--hairline)' }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2 px-4 h-14 shrink-0"
        style={{ borderBottom: '1px solid var(--hairline)' }}
      >
        <Shield size={18} style={{ color: 'var(--accent-red)' }} strokeWidth={2} />
        <span
          className="text-sm font-semibold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          ESCOMVoting
        </span>
        <span
          className="ml-auto text-xs font-medium px-1.5 py-0.5 rounded-md"
          style={{
            background: 'var(--accent-red-soft)',
            color: 'var(--accent-red)',
          }}
        >
          Admin
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <SideLink
              key={item.to}
              item={item}
              onClick={() => setSidebarOpen(false)}
            />
          ))}
        </div>

        {/* Voter section divider */}
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--hairline)' }}>
          <p className="px-3 pb-1.5 text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--text-ash)' }}>
            Votación
          </p>
          <SideLink item={voterLink} onClick={() => setSidebarOpen(false)} />
        </div>
      </nav>

      {/* Bottom: user info + actions */}
      <div
        className="px-3 py-4 space-y-1 shrink-0"
        style={{ borderTop: '1px solid var(--hairline)' }}
      >
        {/* User row */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
            style={{ background: 'var(--accent-blue-soft)', color: 'var(--accent-blue)' }}
          >
            {session?.name.charAt(0).toUpperCase() ?? 'A'}
          </div>
          <div className="min-w-0">
            <p
              className="text-xs font-medium truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {session?.name ?? 'Administrador'}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-ash)' }}>
              {session?.role}
            </p>
          </div>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
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
          {isDark ? 'Modo claro' : 'Modo oscuro'}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
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
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <div
      className="flex min-h-screen"
      style={{ background: 'var(--canvas)' }}
    >
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-60 shrink-0 sticky top-0 h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
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
              style={{ background: 'rgba(0,0,0,0.5)' }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              key="sidebar"
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="fixed top-0 left-0 bottom-0 w-60 z-50 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header
          className="md:hidden h-14 flex items-center gap-3 px-4 shrink-0 sticky top-0 z-30"
          style={{
            background: 'var(--surface)',
            borderBottom: '1px solid var(--hairline)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-md"
            style={{ color: 'var(--text-mute)', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <Shield size={16} style={{ color: 'var(--accent-red)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            ESCOMVoting
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
