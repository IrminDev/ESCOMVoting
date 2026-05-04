import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface BadgeProps {
  color: 'blue' | 'red' | 'green' | 'yellow'
  children: string
}

function Badge({ color, children }: BadgeProps) {
  const colorMap: Record<string, { bg: string; fg: string }> = {
    blue: { bg: 'var(--accent-blue-soft)', fg: 'var(--accent-blue)' },
    red: { bg: 'var(--accent-red-soft)', fg: 'var(--accent-red)' },
    green: { bg: 'var(--accent-green-soft)', fg: 'var(--accent-green)' },
    yellow: { bg: 'var(--accent-yellow-soft)', fg: 'var(--accent-yellow)' },
  }
  const { bg, fg } = colorMap[color]
  return (
    <span
      className="text-xs font-medium rounded-sm px-1.5 py-0.5"
      style={{ background: bg, color: fg }}
    >
      {children}
    </span>
  )
}

interface RowProps {
  selected?: boolean
  children: React.ReactNode
}

function Row({ selected, children }: RowProps) {
  return (
    <div
      className={cn('flex items-center gap-3 px-3 py-2.5 text-sm')}
      style={{
        background: selected ? 'var(--surface-card)' : 'transparent',
        borderRadius: selected ? '6px' : undefined,
        color: 'var(--text-body)',
      }}
    >
      {children}
    </div>
  )
}

export function CommandPaletteCard() {
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--hairline)',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'var(--palette-shadow, 0 24px 80px rgba(0,0,0,0.12))',
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            background: 'var(--surface-elevated)',
            borderBottom: '1px solid var(--hairline)',
          }}
        >
          <div className="flex items-center gap-2">
            {/* Traffic lights */}
            <span className="w-2.5 h-2.5 rounded-full block" style={{ background: '#ff5f57' }} />
            <span className="w-2.5 h-2.5 rounded-full block" style={{ background: '#febc2e' }} />
            <span className="w-2.5 h-2.5 rounded-full block" style={{ background: '#28c840' }} />
            <span
              className="ml-3 text-xs font-medium"
              style={{ color: 'var(--text-mute)' }}
            >
              ESCOMVoting
            </span>
          </div>
          <kbd
            className="text-xs px-1.5 py-0.5 rounded font-mono"
            style={{
              background: 'var(--surface-card)',
              color: 'var(--text-ash)',
              border: '1px solid var(--hairline)',
            }}
          >
            ⌘K
          </kbd>
        </div>

        {/* Search row */}
        <div
          className="flex items-center gap-2 px-4 py-3"
          style={{
            background: 'var(--surface-elevated)',
            borderBottom: '1px solid var(--hairline)',
          }}
        >
          <Search size={14} style={{ color: 'var(--text-ash)', flexShrink: 0 }} strokeWidth={2} />
          <span className="text-sm" style={{ color: 'var(--text-ash)' }}>
            Buscar elecciones...
          </span>
        </div>

        {/* Rows */}
        <div className="px-2 py-2 space-y-0.5">
          <Row selected>
            <span>🗳</span>
            <span className="flex-1 truncate" style={{ color: 'var(--text-primary)' }}>
              Elección de Director General 2025
            </span>
            <Badge color="green">OPEN</Badge>
          </Row>
          <Row>
            <span>📊</span>
            <span className="flex-1 truncate">
              Consulta: Plan de estudios 2026
            </span>
            <Badge color="yellow">DRAFT</Badge>
          </Row>
          <Row>
            <span style={{ color: 'var(--accent-green)', fontSize: '14px' }}>✓</span>
            <span className="flex-1 text-xs" style={{ color: 'var(--text-mute)' }}>
              Firma verificada · secp256k1
            </span>
          </Row>
          <Row>
            <span>🔐</span>
            <span className="flex-1 text-xs" style={{ color: 'var(--text-mute)' }}>
              Nullifier: único · SHA-256
            </span>
          </Row>
        </div>

        {/* Bottom hints */}
        <div
          className="flex items-center gap-4 px-4 py-2.5"
          style={{
            background: 'var(--surface-elevated)',
            borderTop: '1px solid var(--hairline)',
          }}
        >
          {[
            { key: '↵', label: 'Votar' },
            { key: '⌘K', label: 'Acciones' },
            { key: 'Esc', label: 'Salir' },
          ].map(({ key, label }) => (
            <span key={key} className="flex items-center gap-1">
              <kbd
                className="text-xs px-1 py-0.5 rounded font-mono"
                style={{
                  background: 'var(--surface-card)',
                  color: 'var(--text-ash)',
                  border: '1px solid var(--hairline)',
                }}
              >
                {key}
              </kbd>
              <span className="text-xs" style={{ color: 'var(--text-ash)' }}>
                {label}
              </span>
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
