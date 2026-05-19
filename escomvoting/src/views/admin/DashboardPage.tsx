import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Vote,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  Upload,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'
import { electionService } from '../../services/election.service'
import { userService } from '../../services/user.service'
import type { ElectionDTO } from '../../model/response/ElectionDTO'
import type { UserDTO } from '../../model/response/UserDTO'
import {
  NAVY,
  BLUE,
  CYAN,
  ICE,
  WHITE,
  BODY,
  MUTE,
  HAIRLINE_CYAN,
  FEATURE_CARD_BG,
  STATUS_PILL,
  STATUS_LABEL,
} from './theme'

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_PILL[status] ?? STATUS_PILL.DRAFT
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color, letterSpacing: '0.02em' }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: cfg.dot }}
      />
      {STATUS_LABEL[status] ?? status}
    </span>
  )
}

function StatCard({
  label,
  value,
  icon: Icon,
  delay,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="relative p-6 rounded-2xl overflow-hidden group"
      style={{
        background: FEATURE_CARD_BG,
        border: `1px solid ${HAIRLINE_CYAN}`,
      }}
    >
      <div
        aria-hidden
        className="absolute -bottom-16 -right-16 w-40 h-40 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(circle, rgba(58,190,249,0.4) 0%, transparent 70%)',
          filter: 'blur(20px)',
          opacity: 0.4,
        }}
      />
      <div className="relative flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
          style={{ background: NAVY, color: ICE }}
        >
          <Icon size={22} strokeWidth={2} />
        </div>
        <div>
          <p
            className="font-semibold tracking-tight"
            style={{
              color: NAVY,
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '-0.03em',
            }}
          >
            {value}
          </p>
          <p className="text-xs mt-2 font-medium" style={{ color: MUTE }}>
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className ?? ''}`}
      style={{ background: 'rgba(167,230,255,0.33)' }}
    />
  )
}

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
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const openCount = elections.filter((e) => e.status === 'OPEN').length
  const recentElections = elections.slice(0, 5)

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <span
            className="inline-flex items-center gap-1.5 mb-3 text-xs font-semibold uppercase"
            style={{ color: BLUE, letterSpacing: '0.18em' }}
          >
            <Sparkles size={12} strokeWidth={2.5} />
            Panel de control
          </span>
          <h1
            className="font-semibold tracking-tight"
            style={{
              color: NAVY,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
            }}
          >
            Administración
          </h1>
          <p className="text-sm mt-2 max-w-md" style={{ color: BODY, lineHeight: 1.6 }}>
            Gestiona elecciones y el padrón electoral de ESCOM.
          </p>
        </div>
        <Link
          to="/admin/elections/new"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all"
          style={{
            background: NAVY,
            color: WHITE,
            textDecoration: 'none',
            boxShadow: '0 10px 30px -10px rgba(5,12,156,0.5)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = BLUE
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = NAVY
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Nueva elección
          <ArrowRight
            size={16}
            strokeWidth={2}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      {error && (
        <p
          className="text-sm px-4 py-3 rounded-lg"
          style={{ background: '#fee', color: '#c00' }}
        >
          {error}
        </p>
      )}

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Elecciones totales" value={elections.length} icon={Vote} delay={0} />
          <StatCard label="En curso ahora" value={openCount} icon={Clock} delay={0.08} />
          <StatCard label="Usuarios registrados" value={users.length} icon={Users} delay={0.16} />
          <StatCard label="Grupos electorales" value={3} icon={CheckCircle2} delay={0.24} />
        </div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent elections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
          className="lg:col-span-2 rounded-2xl overflow-hidden"
          style={{ background: WHITE, border: `1px solid ${HAIRLINE_CYAN}` }}
        >
          <div
            className="px-6 py-5 flex items-center justify-between"
            style={{ borderBottom: `1px solid ${HAIRLINE_CYAN}` }}
          >
            <div>
              <span
                className="text-xs font-semibold uppercase"
                style={{ color: BLUE, letterSpacing: '0.18em' }}
              >
                Archivo
              </span>
              <h2
                className="text-lg font-semibold tracking-tight mt-1"
                style={{ color: NAVY, letterSpacing: '-0.02em' }}
              >
                Elecciones recientes
              </h2>
            </div>
            <Link
              to="/admin/elections"
              className="group inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: BLUE, textDecoration: 'none' }}
            >
              Ver todas
              <ArrowUpRight
                size={14}
                strokeWidth={2}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10" />
              ))}
            </div>
          ) : recentElections.length === 0 ? (
            <p className="px-6 py-12 text-sm text-center" style={{ color: MUTE }}>
              Aún no hay elecciones.{' '}
              <Link
                to="/admin/elections/new"
                style={{ color: BLUE, fontWeight: 500 }}
              >
                Crear la primera →
              </Link>
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${HAIRLINE_CYAN}` }}>
                    {['Título', 'Grupos', 'Estado', 'Cierre'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-3 text-xs font-semibold uppercase"
                        style={{ color: MUTE, letterSpacing: '0.1em' }}
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
                          ? { borderBottom: `1px solid ${HAIRLINE_CYAN}` }
                          : {}
                      }
                    >
                      <td className="px-6 py-4">
                        <span
                          className="text-sm font-semibold block max-w-[220px] truncate"
                          style={{ color: NAVY }}
                          title={el.title}
                        >
                          {el.title}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs" style={{ color: BODY }}>
                          {el.allowedRoles.length === 3
                            ? 'Todos'
                            : el.allowedRoles.join(', ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={el.status} />
                      </td>
                      <td
                        className="px-6 py-4 text-xs font-medium"
                        style={{ color: MUTE }}
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38, ease: 'easeOut' }}
          className="space-y-4"
        >
          {[
            {
              to: '/admin/elections/new',
              icon: Plus,
              title: 'Nueva elección',
              desc: 'Configura candidatos, grupos y fechas.',
            },
            {
              to: '/admin/users/import',
              icon: Upload,
              title: 'Importar usuarios',
              desc: 'Carga el padrón desde CSV.',
            },
            {
              to: '/admin/users',
              icon: Users,
              title: 'Gestionar usuarios',
              desc: 'Consulta y administra el padrón.',
            },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-start gap-4 p-5 rounded-2xl transition-all"
                style={{
                  background: WHITE,
                  border: `1px solid ${HAIRLINE_CYAN}`,
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow =
                    '0 14px 40px -16px rgba(5,12,156,0.25)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: NAVY, color: ICE }}
                >
                  <Icon size={18} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold tracking-tight"
                    style={{ color: NAVY }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="text-xs mt-1 leading-relaxed"
                    style={{ color: BODY }}
                  >
                    {item.desc}
                  </p>
                </div>
                <ArrowUpRight
                  size={14}
                  strokeWidth={2}
                  style={{ color: BLUE }}
                  className="mt-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            )
          })}

          {/* Crypto info */}
          <div
            className="p-5 rounded-2xl"
            style={{
              background: FEATURE_CARD_BG,
              border: `1px solid ${HAIRLINE_CYAN}`,
            }}
          >
            <p
              className="text-xs font-semibold uppercase mb-3"
              style={{ color: BLUE, letterSpacing: '0.18em' }}
            >
              Protocolo activo
            </p>
            <div
              className="space-y-2 font-mono text-xs"
              style={{ color: BODY }}
            >
              {[
                'secp256k1 · Schnorr ciego',
                'Clave por rol de votante',
                'Nullifier SHA-256',
              ].map((line) => (
                <div key={line} className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: CYAN }}
                  />
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
