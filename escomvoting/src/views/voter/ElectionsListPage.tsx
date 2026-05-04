import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Vote, Calendar, ChevronRight, Clock, Lock, BarChart2, CheckCircle2, ShieldCheck } from 'lucide-react'
import { electionService } from '../../services/election.service'
import { Pagination } from '../../components/shared/Pagination'
import type { ElectionDTO } from '../../model/response/ElectionDTO'
import type { PageResponse } from '../../model/response/PageResponse'

// ── Status config ──────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  OPEN:    { label: 'Abierta',    color: 'var(--accent-green)',  bg: 'var(--accent-green-soft)',  icon: Vote },
  CLOSED:  { label: 'Cerrada',    color: 'var(--accent-yellow)', bg: 'var(--accent-yellow-soft)', icon: Lock },
  TALLIED: { label: 'Resultados', color: 'var(--accent-blue)',   bg: 'var(--accent-blue-soft)',   icon: BarChart2 },
  DRAFT:   { label: 'Borrador',   color: 'var(--text-ash)',      bg: 'var(--surface-card)',        icon: Clock },
} as const

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.DRAFT
  const Icon = cfg.icon
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      <Icon size={10} strokeWidth={2.5} />
      {cfg.label}
    </span>
  )
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className ?? ''}`}
      style={{ background: 'var(--surface-elevated)' }}
    />
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

// ── ElectionCard ───────────────────────────────────────────────────────────

function ElectionCard({
  election,
  index,
  hasVoted,
}: {
  election: ElectionDTO
  index: number
  hasVoted: boolean
}) {
  const isOpen    = election.status === 'OPEN'
  const isTallied = election.status === 'TALLIED'
  const canInteract = isOpen || isTallied

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2
            className="text-base font-semibold tracking-tight leading-snug"
            style={{ color: 'var(--text-primary)' }}
          >
            {election.title}
          </h2>
          <p
            className="text-sm mt-1 line-clamp-2"
            style={{ color: 'var(--text-mute)' }}
          >
            {election.description}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {hasVoted && isOpen && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
              style={{ background: 'var(--accent-green-soft)', color: 'var(--accent-green)' }}
            >
              <CheckCircle2 size={10} strokeWidth={2.5} />
              Votado
            </span>
          )}
          <StatusBadge status={election.status} />
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-ash)' }}>
          <Calendar size={11} strokeWidth={2} />
          Cierra {formatDate(election.endDate)}
        </span>
        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-ash)' }}>
          <Vote size={11} strokeWidth={2} />
          {election.candidates.length} candidato{election.candidates.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Candidates preview */}
      {election.candidates.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {election.candidates.slice(0, 3).map((c) => (
            <span
              key={c.id}
              className="text-xs px-2 py-0.5 rounded-md font-medium"
              style={{ background: 'var(--surface-elevated)', color: 'var(--text-body)', border: '1px solid var(--hairline)' }}
            >
              {c.name}
            </span>
          ))}
          {election.candidates.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-md" style={{ color: 'var(--text-ash)' }}>
              +{election.candidates.length - 3} más
            </span>
          )}
        </div>
      )}

      {/* CTA */}
      {canInteract && (
        <div className="pt-1 flex flex-wrap items-center gap-2">
          {isOpen && hasVoted ? (
            <p className="text-sm" style={{ color: 'var(--text-ash)' }}>
              Ya has votado en esta elección.
            </p>
          ) : (
            <Link
              to={`/elections/${election.id}`}
              className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150"
              style={{
                background: isOpen ? 'var(--cta-bg)' : 'var(--surface-elevated)',
                color: isOpen ? 'var(--cta-fg)' : 'var(--text-body)',
                border: isOpen ? 'none' : '1px solid var(--hairline)',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                if (isOpen) e.currentTarget.style.background = 'var(--cta-bg-hover)'
              }}
              onMouseLeave={(e) => {
                if (isOpen) e.currentTarget.style.background = isOpen ? 'var(--cta-bg)' : 'var(--surface-elevated)'
              }}
            >
              {isOpen ? 'Votar ahora' : 'Ver resultados'}
              <ChevronRight size={14} strokeWidth={2.5} />
            </Link>
          )}

          {/* Urn link — only for finished elections */}
          {(election.status === 'CLOSED' || election.status === 'TALLIED') && (
            <Link
              to={`/elections/${election.id}/urn`}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
              style={{
                background: 'var(--surface-elevated)',
                color: 'var(--text-mute)',
                border: '1px solid var(--hairline)',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-mute)' }}
            >
              <ShieldCheck size={12} strokeWidth={2} />
              Ver urna
            </Link>
          )}
        </div>
      )}
    </motion.div>
  )
}

// ── ElectionsListPage ──────────────────────────────────────────────────────

export function ElectionsListPage() {
  const [data, setData] = useState<PageResponse<ElectionDTO> | null>(null)
  const [page, setPage] = useState(0)
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      electionService.listForVoter(page, 20),
      electionService.getMyVotedElectionIds(),
    ])
      .then(([pageData, voted]) => {
        setData(pageData)
        setVotedIds(new Set(voted))
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Error al cargar elecciones'),
      )
      .finally(() => setLoading(false))
  }, [page])

  const elections = data?.content ?? []
  const open  = elections.filter((e) => e.status === 'OPEN')
  const other = elections.filter((e) => e.status !== 'OPEN')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Elecciones
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-mute)' }}>
          {loading
            ? 'Cargando…'
            : elections.length === 0
              ? 'No hay elecciones disponibles.'
              : `${open.length} elección${open.length !== 1 ? 'es' : ''} abierta${open.length !== 1 ? 's' : ''}`}
        </p>
        {data && data.totalElements > 0 && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-ash)' }}>
            {data.totalElements} en total
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <p
          className="text-sm px-4 py-3 rounded-lg"
          style={{ background: 'var(--accent-red-soft)', color: 'var(--accent-red)' }}
        >
          {error}
        </p>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-44" />)}
        </div>
      )}

      {/* Open elections */}
      {!loading && open.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-ash)' }}>
            Disponibles para votar
          </h2>
          <div className="space-y-3">
            {open.map((e, i) => (
              <ElectionCard key={e.id} election={e} index={i} hasVoted={votedIds.has(e.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Other elections */}
      {!loading && other.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-ash)' }}>
            Otras elecciones
          </h2>
          <div className="space-y-3">
            {other.map((e, i) => (
              <ElectionCard key={e.id} election={e} index={i} hasVoted={votedIds.has(e.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Pagination */}
      {!loading && data && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          size={data.size}
          onPage={setPage}
        />
      )}

      {/* Empty state */}
      {!loading && elections.length === 0 && !error && (
        <div
          className="rounded-xl p-12 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
        >
          <Vote size={28} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: 'var(--text-ash)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Sin elecciones activas
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-ash)' }}>
            Cuando una elección esté abierta aparecerá aquí.
          </p>
        </div>
      )}
    </div>
  )
}
