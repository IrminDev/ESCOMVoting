import { Shield } from 'lucide-react'

const NAVY = '#050C9C'
const MUTE = '#6b7a99'
const HAIRLINE_CYAN = 'rgba(58,190,249,0.27)'
const WHITE = '#ffffff'

const footerLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Protocolo', href: '#protocol' },
  { label: 'Acceder', href: '#access' },
]

export function Footer() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${HAIRLINE_CYAN}`,
        background: WHITE,
        padding: '40px 0',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Shield size={18} style={{ color: NAVY }} strokeWidth={2} />
          <div>
            <span
              className="text-sm font-semibold"
              style={{ color: NAVY, letterSpacing: '-0.02em' }}
            >
              ESCOMVoting
            </span>
            <p className="text-xs" style={{ color: MUTE }}>
              Sistema de votación anónima
            </p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-5">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-medium transition-colors duration-150"
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
        </nav>

        {/* Copyright */}
        <p
          className="text-xs"
          style={{ color: MUTE, letterSpacing: '0.02em' }}
        >
          © 2026 ESCOM / IPN
        </p>
      </div>
    </footer>
  )
}
