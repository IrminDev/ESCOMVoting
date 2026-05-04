import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Vote, Users, CheckCircle2, Clock, Plus, Upload, ArrowRight } from 'lucide-react'
import { electionService } from '../../services/election.service'
import { userService } from '../../services/user.service'
import type { ElectionDTO } from '../../model/response/ElectionDTO'
import type { UserDTO } from '../../model/response/UserDTO'

// ── Status badge ───────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  DRAFT:   { label: 'Borrador',   color: 'var(--text-ash)',    bg: 'var(--surface-card)' },
  OPEN:    { label: 'En curso',   color: 'var(--accent-green)',bg: 'var(--accent-green-soft)' },
  CLOSED:  { label: 'Cerrada',    color: 'var(--accent-yellow)',bg: 'var(--accent-yellow-soft)' },
  TALLIED: { label: 'Resultados', color: 'var(--accent-blue)', bg: 'var(--accent-blue-soft)' },
} as const

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.DRAFT
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}

// ── Stat card ──────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  accentSoft,
  delay,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  accent: string
  accentSoft: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      className="p-5 rounded-xl flex items-start gap-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: accentSoft, color: accent }}
      >
        <Icon size={16} strokeWidth={2} />
      </div>
      <div>
        <p
          className="text-2xl font-semibold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {value}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-mute)' }}>
          {label}
        </p>
      </div>
    </motion.div>
  )
}

// ── Skeleton loader ────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded animate-pulse ${className ?? ''}`}
      style={{ background: 'var(--surface-elevated)' }}
    />
  )
}

// ── DashboardPage ──────────────────────────────────────────────────────────

export function DashboardPage() {
  const [elections, setElections] = useState<ElectionDTO[]>([])
  const [users, setUsers] = useState<UserDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([electionService.listAll(), userService.listAll()])
      .then(([e, u]) => {
        if (cancelled) return
        setElections(e.content)
        setUsers(u.content)
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Error al cargar datos')
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const openCount = elections.filter((e) => e.status === 'OPEN').length
  const recentElections = elections.slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Panel de administración
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-mute)' }}>
            Gestiona elecciones y usuarios de ESCOM.
          </p>
        </div>
        <Link
          to="/admin/elections/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: 'var(--cta-bg)', color: 'var(--cta-fg)', textDecoration: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cta-bg-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--cta-bg)')}
        >
          <Plus size={14} strokeWidth={2.5} />
          Nueva elección
        </Link>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm" style={{ color: 'var(--accent-red)' }}>
          {error}
        </p>
      )}

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Elecciones totales"  value={elections.length} icon={Vote}         accent="var(--accent-blue)"   accentSoft="var(--accent-blue-soft)"   delay={0} />
          <StatCard label="En curso ahora"       value={openCount}        icon={Clock}        accent="var(--accent-green)"  accentSoft="var(--accent-green-soft)"  delay={0.05} />
          <StatCard label="Usuarios registrados" value={users.length}     icon={Users}        accent="var(--accent-red)"    accentSoft="var(--accent-red-soft)"    delay={0.1} />
          <StatCard label="Grupos electorales"   value={3}                icon={CheckCircle2} accent="var(--accent-yellow)" accentSoft="var(--accent-yellow-soft)" delay={0.15} />
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent elections table */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
          className="lg:col-span-2 rounded-xl overflow-hidden"
          style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
        >
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid var(--hairline)' }}
          >
            <h2
              className="text-sm font-semibold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Elecciones recientes
            </h2>
            <Link
              to="/admin/elections"
              className="text-xs font-medium flex items-center gap-1 transition-colors"
              style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}
            >
              Ver todas <ArrowRight size={11} strokeWidth={2} />
            </Link>
          </div>

          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          ) : recentElections.length === 0 ? (
            <p className="px-5 py-8 text-sm text-center" style={{ color: 'var(--text-ash)' }}>
              No hay elecciones todavía.{' '}
              <Link to="/admin/elections/new" style={{ color: 'var(--accent-blue)' }}>
                Crear la primera
              </Link>
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
                    {['Título', 'Grupos', 'Estado', 'Cierre'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wide"
                        style={{ color: 'var(--text-ash)' }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentElections.map((el, i) => (
                    <tr
                      key={el.id}
                      style={
                        i < recentElections.length - 1
                          ? { borderBottom: '1px solid var(--hairline)' }
                          : {}
                      }
                    >
                      <td className="px-5 py-3.5">
                        <span
                          className="text-sm font-medium block max-w-[200px] truncate"
                          style={{ color: 'var(--text-primary)' }}
                          title={el.title}
                        >
                          {el.title}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs" style={{ color: 'var(--text-mute)' }}>
                          {el.allowedRoles.length === 3
                            ? 'Todos'
                            : el.allowedRoles.join(', ')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={el.status} />
                      </td>
                      <td
                        className="px-5 py-3.5 text-xs"
                        style={{ color: 'var(--text-mute)' }}
                      >
                        {new Date(el.endDate).toLocaleDateString('es-MX', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25, ease: 'easeOut' }}
          className="space-y-3"
        >
          {[
            {
              to: '/admin/elections/new',
              icon: Plus,
              accent: 'var(--accent-blue)',
              accentSoft: 'var(--accent-blue-soft)',
              title: 'Nueva elección',
              desc: 'Configura candidatos, grupos y fechas.',
            },
            {
              to: '/admin/users/import',
              icon: Upload,
              accent: 'var(--accent-green)',
              accentSoft: 'var(--accent-green-soft)',
              title: 'Importar usuarios',
              desc: 'Carga el padrón electoral desde CSV.',
            },
            {
              to: '/admin/users',
              icon: Users,
              accent: 'var(--accent-yellow)',
              accentSoft: 'var(--accent-yellow-soft)',
              title: 'Gestionar usuarios',
              desc: 'Consulta y administra el padrón.',
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-start gap-4 p-5 rounded-xl transition-colors"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--hairline)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = 'var(--hairline-strong)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = 'var(--hairline)')
                }
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: item.accentSoft, color: item.accent }}
                >
                  <Icon size={16} strokeWidth={2} />
                </div>
                <div>
                  <p
                    className="text-sm font-semibold tracking-tight"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.title}
                  </p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--text-mute)' }}>
                    {item.desc}
                  </p>
                </div>
              </Link>
            )
          })}

          {/* Crypto info */}
          <div
            className="p-5 rounded-xl"
            style={{ background: 'var(--surface-elevated)', border: '1px solid var(--hairline)' }}
          >
            <p
              className="text-xs font-medium uppercase tracking-widest mb-3"
              style={{ color: 'var(--text-ash)' }}
            >
              Protocolo activo
            </p>
            <div className="space-y-1.5 font-mono text-xs" style={{ color: 'var(--text-mute)' }}>
              {[
                'secp256k1 · Schnorr ciego',
                'Clave por rol de votante',
                'Nullifier SHA-256',
              ].map((line) => (
                <div key={line} className="flex items-center gap-2">
                  <span style={{ color: 'var(--accent-green)' }}>●</span>
                  {line}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
