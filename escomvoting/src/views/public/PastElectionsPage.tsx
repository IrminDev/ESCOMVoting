import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Vote, Calendar, BarChart2, Lock, ShieldCheck, ChevronRight } from 'lucide-react'
import { electionService } from '../../services/election.service'
import { Pagination } from '../../components/shared/Pagination'
import type { ElectionDTO } from '../../model/response/ElectionDTO'
import type { PageResponse } from '../../model/response/PageResponse'

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

function ElectionCard({ election, index }: { election: ElectionDTO; index: number }) {
  const isTallied = election.status === 'TALLIED'

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.5) }}
      className="rounded-xl p-5 flex flex-col gap-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2
            className="text-base font-semibold tracking-tight leading-snug"
            style={{ color: 'var(--text-primary)' }}
          >
            {election.title}
          </h2>
          {election.description && (
            <p className="text-sm mt-1 line-clamp-2" style={{ color: 'var(--text-mute)' }}>
              {election.description}
            </p>
          )}
        </div>
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium shrink-0"
          style={{
            background: isTallied ? 'var(--accent-blue-soft)' : 'var(--accent-yellow-soft)',
            color:      isTallied ? 'var(--accent-blue)'      : 'var(--accent-yellow)',
          }}
        >
          {isTallied ? <BarChart2 size={10} strokeWidth={2.5} /> : <Lock size={10} strokeWidth={2.5} />}
          {isTallied ? 'Resultados' : 'Cerrada'}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-ash)' }}>
          <Calendar size={11} strokeWidth={2} />
          Cerró {formatDate(election.endDate)}
        </span>
        <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-ash)' }}>
          <Vote size={11} strokeWidth={2} />
          {election.candidates.length} candidato{election.candidates.length !== 1 ? 's' : ''}
        </span>
      </div>

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

      <div className="pt-1 flex flex-wrap items-center gap-2">
        {isTallied && (
          <Link
            to={`/elections/${election.id}/results`}
            className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            style={{ background: 'var(--cta-bg)', color: 'var(--cta-fg)', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cta-bg-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--cta-bg)')}
          >
            Ver resultados
            <ChevronRight size={14} strokeWidth={2.5} />
          </Link>
        )}
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
      </div>
    </motion.div>
  )
}

export function PastElectionsPage() {
  const [data, setData] = useState<PageResponse<ElectionDTO> | null>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    electionService
      .listPublicFinished(page, 10)
      .then(setData)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Error al cargar elecciones'),
      )
      .finally(() => setLoading(false))
  }, [page])

  return (
    <div
      style={{
        maxWidth: '720px',
        margin: '0 auto',
        padding: '2.5rem 1rem',
      }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Historial de Elecciones
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-mute)' }}>
          Elecciones pasadas con resultados y urnas verificables.
        </p>
      </div>

      {error && (
        <p
          className="text-sm px-4 py-3 rounded-lg"
          style={{ background: 'var(--accent-red-soft)', color: 'var(--accent-red)' }}
        >
          {error}
        </p>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-44" />)}
        </div>
      ) : data && data.content.length > 0 ? (
        <>
          <div className="space-y-4">
            {data.content.map((e, i) => (
              <ElectionCard key={e.id} election={e} index={i} />
            ))}
          </div>
          <Pagination
            page={data.page}
            totalPages={data.totalPages}
            totalElements={data.totalElements}
            size={data.size}
            onPage={setPage}
          />
        </>
      ) : !loading && (
        <div
          className="rounded-xl p-12 text-center"
          style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
        >
          <Vote size={28} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: 'var(--text-ash)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Sin elecciones pasadas
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-ash)' }}>
            Las elecciones finalizadas aparecerán aquí.
          </p>
        </div>
      )}
    </div>
  )
}
