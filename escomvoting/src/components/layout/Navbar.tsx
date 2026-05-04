import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { cn } from '../../lib/utils'

const navLinks = [
  { label: 'Características', href: '#features' },
  { label: 'Protocolo', href: '#protocol' },
]

const navRouteLinks = [
  { label: 'Historial', to: '/past-elections' },
]

export function Navbar() {
  const { isDark, toggle } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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
        height: '56px',
        borderBottom: '1px solid var(--hairline)',
        background: scrolled
          ? 'color-mix(in srgb, var(--canvas) 80%, transparent)'
          : 'var(--canvas)',
        backdropFilter: scrolled ? 'blur(12px)' : undefined,
        transition: 'background 0.2s ease, backdrop-filter 0.2s ease',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 shrink-0"
          style={{ textDecoration: 'none' }}
        >
          <Shield
            size={20}
            style={{ color: 'var(--accent-red)' }}
            strokeWidth={2}
          />
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
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
              style={{ color: 'var(--text-mute)', textDecoration: 'none' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-mute)'
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
              style={{ color: 'var(--text-mute)', textDecoration: 'none' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-mute)'
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="p-2 rounded-md transition-colors duration-150"
            style={{ color: 'var(--text-mute)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-primary)'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'var(--surface-elevated)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-mute)'
              ;(e.currentTarget as HTMLButtonElement).style.background = 'transparent'
            }}
          >
            {isDark ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
          </button>

          {/* CTA — desktop only */}
          <Link
            to="/login"
            className="hidden md:inline-flex items-center text-sm font-medium px-4 py-1.5 rounded-lg transition-colors duration-150"
            style={{
              background: 'var(--cta-bg)',
              color: 'var(--cta-fg)',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'var(--cta-bg-hover)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'var(--cta-bg)'
            }}
          >
            Iniciar sesión
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden p-2 rounded-md transition-colors duration-150"
            style={{ color: 'var(--text-mute)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
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
              top: '56px',
              left: 0,
              right: 0,
              background: 'var(--canvas)',
              borderBottom: '1px solid var(--hairline)',
              zIndex: 49,
              padding: '8px 16px 16px',
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-sm font-medium py-2.5 px-2"
                style={{ color: 'var(--text-body)', textDecoration: 'none' }}
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
                style={{ color: 'var(--text-body)', textDecoration: 'none' }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/login"
              className="mt-2 block text-center text-sm font-medium px-4 py-2 rounded-lg"
              style={{
                background: 'var(--cta-bg)',
                color: 'var(--cta-fg)',
                textDecoration: 'none',
              }}
              onClick={() => setMenuOpen(false)}
            >
              Iniciar sesión
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
