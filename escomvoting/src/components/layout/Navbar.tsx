import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { cn } from '../../lib/utils'

const NAVY = '#050C9C'
const BLUE = '#3572EF'
const HAIRLINE_CYAN = 'rgba(58,190,249,0.27)'
const BODY = '#3a4a6b'
const MUTE = '#6b7a99'
const WHITE = '#ffffff'

const navLinks = [
  { label: 'Características', href: '#features' },
  { label: 'Protocolo', href: '#protocol' },
]

const navRouteLinks = [
  { label: 'Historial', to: '/past-elections' },
]

export function Navbar() {
  const { isAuthenticated, isAdmin } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const indexHref = isAdmin ? '/admin' : '/elections'
  const indexLabel = isAdmin ? 'Panel admin' : 'Mis elecciones'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: '64px',
        borderBottom: `1px solid ${HAIRLINE_CYAN}`,
        background: scrolled
          ? 'rgba(255,255,255,0.85)'
          : WHITE,
        backdropFilter: scrolled ? 'blur(12px)' : undefined,
        transition: 'background 0.2s ease, backdrop-filter 0.2s ease',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 shrink-0"
          style={{ textDecoration: 'none' }}
        >
          <Shield size={22} style={{ color: NAVY }} strokeWidth={2} />
          <span
            className="text-sm font-semibold tracking-tight"
            style={{
              color: NAVY,
              letterSpacing: '-0.02em',
              fontSize: '0.95rem',
            }}
          >
            ESCOMVoting
          </span>
        </a>

        {/* Center nav links — desktop only */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                'text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-150',
              )}
              style={{ color: MUTE, textDecoration: 'none' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = NAVY
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = MUTE
              }}
            >
              {link.label}
            </a>
          ))}
          {navRouteLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={cn(
                'text-sm font-medium px-3 py-1.5 rounded-md transition-colors duration-150',
              )}
              style={{ color: MUTE, textDecoration: 'none' }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = NAVY
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.color = MUTE
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* CTA — desktop only */}
          {isAuthenticated ? (
            <Link
              to={indexHref}
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium px-5 py-2 transition-all duration-150 group"
              style={{
                background: NAVY,
                color: WHITE,
                borderRadius: '9999px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(5,12,156,0.18)',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background = BLUE
                ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 18px rgba(53,114,239,0.28)'
                ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background = NAVY
                ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 12px rgba(5,12,156,0.18)'
                ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
              }}
            >
              <LayoutDashboard size={15} strokeWidth={2.25} />
              {indexLabel}
            </Link>
          ) : (
            <Link
              to="/login"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium px-5 py-2 transition-all duration-150 group"
              style={{
                background: NAVY,
                color: WHITE,
                borderRadius: '9999px',
                textDecoration: 'none',
                boxShadow: '0 4px 12px rgba(5,12,156,0.18)',
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background = BLUE
                ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 6px 18px rgba(53,114,239,0.28)'
                ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLAnchorElement).style.background = NAVY
                ;(e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 4px 12px rgba(5,12,156,0.18)'
                ;(e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'
              }}
            >
              Iniciar sesión
              <ArrowRight size={15} strokeWidth={2.25} className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          )}

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden p-2 rounded-md transition-colors duration-150"
            style={{
              color: NAVY,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '64px',
              left: 0,
              right: 0,
              background: WHITE,
              borderBottom: `1px solid ${HAIRLINE_CYAN}`,
              zIndex: 49,
              padding: '12px 24px 20px',
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-sm font-medium py-2.5 px-2"
                style={{ color: BODY, textDecoration: 'none' }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            {navRouteLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="block text-sm font-medium py-2.5 px-2"
                style={{ color: BODY, textDecoration: 'none' }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <Link
                to={indexHref}
                className="mt-3 inline-flex items-center justify-center gap-1.5 w-full text-sm font-medium px-5 py-2.5"
                style={{
                  background: NAVY,
                  color: WHITE,
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(5,12,156,0.18)',
                }}
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard size={15} strokeWidth={2.25} />
                {indexLabel}
              </Link>
            ) : (
              <Link
                to="/login"
                className="mt-3 inline-flex items-center justify-center gap-1.5 w-full text-sm font-medium px-5 py-2.5"
                style={{
                  background: NAVY,
                  color: WHITE,
                  borderRadius: '9999px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 12px rgba(5,12,156,0.18)',
                }}
                onClick={() => setMenuOpen(false)}
              >
                Iniciar sesión
                <ArrowRight size={15} strokeWidth={2.25} />
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
