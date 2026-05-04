import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, ChevronRight, ShieldCheck } from 'lucide-react'
import { electionService } from '../../../services/election.service'
import { Pagination } from '../../../components/shared/Pagination'
import type { ElectionDTO } from '../../../model/response/ElectionDTO'
import type { ElectionStatus } from '../../../model/request/UpdateStatusRequest'
import type { PageResponse } from '../../../model/response/PageResponse'

// ── Status config ──────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; next?: ElectionStatus; nextLabel?: string }
> = {
  DRAFT:   { label: 'Borrador',   color: 'var(--text-ash)',     bg: 'var(--surface-card)',        next: 'OPEN',    nextLabel: 'Abrir' },
  OPEN:    { label: 'En curso',   color: 'var(--accent-green)', bg: 'var(--accent-green-soft)',   next: 'CLOSED',  nextLabel: 'Cerrar' },
  CLOSED:  { label: 'Cerrada',    color: 'var(--accent-yellow)',bg: 'var(--accent-yellow-soft)',  next: 'TALLIED', nextLabel: 'Calcular resultados' },
  TALLIED: { label: 'Resultados', color: 'var(--accent-blue)',  bg: 'var(--accent-blue-soft)' },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.DRAFT
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded animate-pulse ${className ?? ''}`}
      style={{ background: 'var(--surface-elevated)' }}
    />
  )
}

// ── ElectionsPage ──────────────────────────────────────────────────────────

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

  useEffect(() => { load() }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleStatusChange(el: ElectionDTO) {
    const cfg = STATUS_CONFIG[el.status]
    if (!cfg?.next) return
    setActionLoading(el.id)
    setSuccessMsg(null)
    try {
      const updated = await electionService.updateStatus(el.id, { status: cfg.next })
      setData((prev) => prev
        ? { ...prev, content: prev.content.map((e) => (e.id === el.id ? updated : e)) }
        : prev
      )
      setSuccessMsg(`"${el.title}" ahora está ${STATUS_CONFIG[updated.status]?.label ?? updated.status}.`)
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Elecciones
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-mute)' }}>
            Gestiona el ciclo de vida de cada elección.
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

      {/* Feedback */}
      {error && (
        <p className="text-sm px-4 py-3 rounded-lg"
          style={{ background: 'var(--accent-red-soft)', color: 'var(--accent-red)' }}>
          {error}
        </p>
      )}
      {successMsg && (
        <p className="text-sm px-4 py-3 rounded-lg"
          style={{ background: 'var(--accent-green-soft)', color: 'var(--accent-green)' }}>
          {successMsg}
        </p>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
      >
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-12" />)}
          </div>
        ) : !data || data.content.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm" style={{ color: 'var(--text-ash)' }}>
              No hay elecciones todavía.
            </p>
            <Link
              to="/admin/elections/new"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium"
              style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}
            >
              Crear la primera <ChevronRight size={13} strokeWidth={2} />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
                  {['Título', 'Grupos', 'Inicio', 'Cierre', 'Estado', 'Acción', ''].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wide whitespace-nowrap"
                      style={{ color: 'var(--text-ash)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.content.map((el, i) => {
                  const cfg = STATUS_CONFIG[el.status]
                  const isLast = i === data.content.length - 1
                  return (
                    <tr
                      key={el.id}
                      style={!isLast ? { borderBottom: '1px solid var(--hairline)' } : {}}
                    >
                      <td className="px-5 py-4">
                        <span
                          className="font-medium block max-w-[220px] truncate"
                          style={{ color: 'var(--text-primary)' }}
                          title={el.title}
                        >
                          {el.title}
                        </span>
                        {el.description && (
                          <span
                            className="text-xs block max-w-[220px] truncate mt-0.5"
                            style={{ color: 'var(--text-ash)' }}
                            title={el.description}
                          >
                            {el.description}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs" style={{ color: 'var(--text-mute)' }}>
                          {el.allowedRoles.length === 3
                            ? 'Todos'
                            : el.allowedRoles
                                .map((r) =>
                                  r === 'STUDENT' ? 'Est.' : r === 'PROFESSOR' ? 'Prof.' : 'Adm.',
                                )
                                .join(', ')}
                        </span>
                      </td>
                      <td
                        className="px-5 py-4 text-xs whitespace-nowrap"
                        style={{ color: 'var(--text-mute)' }}
                      >
                        {formatDate(el.startDate)}
                      </td>
                      <td
                        className="px-5 py-4 text-xs whitespace-nowrap"
                        style={{ color: 'var(--text-mute)' }}
                      >
                        {formatDate(el.endDate)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={el.status} />
                      </td>
                      <td className="px-5 py-4">
                        {cfg?.next ? (
                          <button
                            onClick={() => void handleStatusChange(el)}
                            disabled={actionLoading === el.id}
                            className="text-xs font-medium px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
                            style={{
                              background: 'var(--surface-elevated)',
                              color: 'var(--text-body)',
                              border: '1px solid var(--hairline)',
                              cursor: actionLoading === el.id ? 'not-allowed' : 'pointer',
                              opacity: actionLoading === el.id ? 0.6 : 1,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--hairline-strong)')}
                            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--hairline)')}
                          >
                            {actionLoading === el.id ? '…' : cfg.nextLabel}
                          </button>
                        ) : (
                          <span className="text-xs" style={{ color: 'var(--text-ash)' }}>—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {(el.status === 'CLOSED' || el.status === 'TALLIED') && (
                          <Link
                            to={`/elections/${el.id}/urn`}
                            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
                            style={{
                              background: 'var(--accent-green-soft)',
                              color: 'var(--accent-green)',
                              border: '1px solid var(--accent-green)',
                              textDecoration: 'none',
                            }}
                          >
                            <ShieldCheck size={11} strokeWidth={2.5} />
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
