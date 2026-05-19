import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { electionService } from '../../../services/election.service'
import { Pagination } from '../../../components/shared/Pagination'
import type { ElectionDTO } from '../../../model/response/ElectionDTO'
import type { ElectionStatus } from '../../../model/request/UpdateStatusRequest'
import type { PageResponse } from '../../../model/response/PageResponse'
import {
  NAVY,
  BLUE,
  CYAN,
  WHITE,
  BODY,
  MUTE,
  HAIRLINE_CYAN,
  STATUS_PILL,
  STATUS_LABEL,
} from '../theme'

const NEXT_ACTION: Record<
  string,
  { next: ElectionStatus; nextLabel: string }
> = {
  DRAFT:  { next: 'OPEN',    nextLabel: 'Abrir' },
  OPEN:   { next: 'CLOSED',  nextLabel: 'Cerrar' },
  CLOSED: { next: 'TALLIED', nextLabel: 'Calcular resultados' },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_PILL[status] ?? STATUS_PILL.DRAFT
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
      {STATUS_LABEL[status] ?? status}
    </span>
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

export function ElectionsPage() {
  const PAGE_SIZE = 10
  const [data, setData] = useState<PageResponse<ElectionDTO> | null>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  function load(p = page) {
    setLoading(true)
    setError(null)
    electionService
      .listAll(p, PAGE_SIZE)
      .then(setData)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Error al cargar'),
      )
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  async function handleStatusChange(el: ElectionDTO) {
    const action = NEXT_ACTION[el.status]
    if (!action) return
    setActionLoading(el.id)
    setSuccessMsg(null)
    try {
      const updated = await electionService.updateStatus(el.id, {
        status: action.next,
      })
      setData((prev) =>
        prev
          ? {
              ...prev,
              content: prev.content.map((e) => (e.id === el.id ? updated : e)),
            }
          : prev,
      )
      setSuccessMsg(
        `"${el.title}" ahora está ${STATUS_LABEL[updated.status] ?? updated.status}.`,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <span
            className="inline-flex items-center gap-1.5 mb-3 text-xs font-semibold uppercase"
            style={{ color: BLUE, letterSpacing: '0.18em' }}
          >
            <Sparkles size={12} strokeWidth={2.5} />
            Ciclo de vida
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
            Elecciones
          </h1>
          <p className="text-sm mt-2" style={{ color: BODY, lineHeight: 1.6 }}>
            Gestiona borradores, urnas abiertas y resultados publicados.
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

      {/* Feedback */}
      {error && (
        <div
          className="flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm"
          style={{ background: '#fee', color: '#c00' }}
        >
          <AlertCircle size={15} strokeWidth={2} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}
      {successMsg && (
        <div
          className="flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm"
          style={{
            background: 'rgba(58,190,249,0.13)',
            color: NAVY,
            border: `1px solid ${HAIRLINE_CYAN}`,
          }}
        >
          <CheckCircle2
            size={15}
            strokeWidth={2}
            style={{ color: CYAN }}
            className="shrink-0 mt-0.5"
          />
          {successMsg}
        </div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: WHITE, border: `1px solid ${HAIRLINE_CYAN}` }}
      >
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12" />
            ))}
          </div>
        ) : !data || data.content.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm" style={{ color: MUTE }}>
              Aún no hay elecciones.
            </p>
            <Link
              to="/admin/elections/new"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium"
              style={{ color: BLUE, textDecoration: 'none' }}
            >
              Crear la primera <ChevronRight size={13} strokeWidth={2} />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${HAIRLINE_CYAN}` }}>
                  {['Título', 'Grupos', 'Inicio', 'Cierre', 'Estado', 'Acción', ''].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-4 text-xs font-semibold uppercase whitespace-nowrap"
                        style={{ color: MUTE, letterSpacing: '0.1em' }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {data.content.map((el, i) => {
                  const action = NEXT_ACTION[el.status]
                  const isLast = i === data.content.length - 1
                  return (
                    <tr
                      key={el.id}
                      style={
                        !isLast
                          ? { borderBottom: `1px solid ${HAIRLINE_CYAN}` }
                          : {}
                      }
                    >
                      <td className="px-6 py-4">
                        <span
                          className="font-semibold block max-w-[240px] truncate"
                          style={{ color: NAVY }}
                          title={el.title}
                        >
                          {el.title}
                        </span>
                        {el.description && (
                          <span
                            className="text-xs block max-w-[240px] truncate mt-1"
                            style={{ color: MUTE }}
                            title={el.description}
                          >
                            {el.description}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs" style={{ color: BODY }}>
                          {el.allowedRoles.length === 3
                            ? 'Todos'
                            : el.allowedRoles
                                .map((r) =>
                                  r === 'STUDENT'
                                    ? 'Est.'
                                    : r === 'PROFESSOR'
                                    ? 'Prof.'
                                    : 'PAAE',
                                )
                                .join(', ')}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 text-xs font-medium whitespace-nowrap"
                        style={{ color: MUTE }}
                      >
                        {formatDate(el.startDate)}
                      </td>
                      <td
                        className="px-6 py-4 text-xs font-medium whitespace-nowrap"
                        style={{ color: MUTE }}
                      >
                        {formatDate(el.endDate)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={el.status} />
                      </td>
                      <td className="px-6 py-4">
                        {action ? (
                          <button
                            onClick={() => void handleStatusChange(el)}
                            disabled={actionLoading === el.id}
                            className="text-xs font-medium px-3 py-1.5 rounded-full transition-all whitespace-nowrap"
                            style={{
                              background: WHITE,
                              color: NAVY,
                              border: `1px solid ${HAIRLINE_CYAN}`,
                              cursor:
                                actionLoading === el.id
                                  ? 'not-allowed'
                                  : 'pointer',
                              opacity: actionLoading === el.id ? 0.6 : 1,
                            }}
                            onMouseEnter={(e) => {
                              if (actionLoading !== el.id) {
                                e.currentTarget.style.borderColor = BLUE
                                e.currentTarget.style.color = BLUE
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = HAIRLINE_CYAN
                              e.currentTarget.style.color = NAVY
                            }}
                          >
                            {actionLoading === el.id ? '…' : action.nextLabel}
                          </button>
                        ) : (
                          <span className="text-xs" style={{ color: MUTE }}>
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {(el.status === 'CLOSED' || el.status === 'TALLIED') && (
                          <Link
                            to={`/elections/${el.id}/urn`}
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                            style={{
                              background: NAVY,
                              color: WHITE,
                              textDecoration: 'none',
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.background = BLUE)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.background = NAVY)
                            }
                          >
                            <ShieldCheck size={12} strokeWidth={2.5} />
                            Ver urna
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {data && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          size={data.size}
          onPage={setPage}
        />
      )}
    </div>
  )
}
