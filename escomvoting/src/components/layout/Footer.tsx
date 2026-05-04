import { Shield } from 'lucide-react'

const footerLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Protocolo', href: '#protocol' },
  { label: 'Acceder', href: '#access' },
]

export function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--hairline)',
        background: 'var(--surface)',
        padding: '32px 0',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Shield size={16} style={{ color: 'var(--accent-red)' }} strokeWidth={2} />
          <div>
            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              ESCOMVoting
            </span>
            <p className="text-xs" style={{ color: 'var(--text-mute)' }}>
              Sistema de votación anónima
            </p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-4">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs transition-colors duration-150"
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
        </nav>

        {/* Copyright */}
        <p className="text-xs" style={{ color: 'var(--text-mute)' }}>
          © 2025 ESCOM / IPN
        </p>
      </div>
    </footer>
  )
}
