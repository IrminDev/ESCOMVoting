import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Vote, Calendar, BarChart2, Lock, ShieldCheck, ChevronRight } from 'lucide-react'
import { electionService } from '../../services/election.service'
import { Pagination } from '../../components/shared/Pagination'
import type { ElectionDTO } from '../../model/response/ElectionDTO'
import type { PageResponse } from '../../model/response/PageResponse'

// ── Design tokens (DESIGN.md v2.0 oceanic) ────────────────────────────────

const NAVY      = '#050C9C'
const BLUE      = '#3572EF'
const CYAN      = '#3ABEF9'
const WHITE     = '#ffffff'
const BODY      = '#3a4a6b'
const MUTE      = '#6b7a99'
const HAIRLINE  = 'rgba(58,190,249,0.27)'
const ICE_SOFT  = 'rgba(167,230,255,0.33)'
const CYAN_SOFT = 'rgba(58,190,249,0.13)'
const ELEVATED  = 'rgba(167,230,255,0.15)'

// Semantic functional colors
const RED      = '#dc2626'
const RED_SOFT = 'rgba(220,38,38,0.08)'

// ── Helpers ────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className ?? ''}`}
      style={{ background: ICE_SOFT, border: `1px solid ${HAIRLINE}` }}
    />
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

// ── ElectionCard ───────────────────────────────────────────────────────────

function ElectionCard({ election, index }: { election: ElectionDTO; index: number }) {
  const isTallied = election.status === 'TALLIED'

  // Status pill colors per DESIGN.md election-card spec
  // TALLIED → blue dot; CLOSED → cyan dot
  const pillBg    = isTallied ? CYAN_SOFT : ICE_SOFT
  const pillColor = isTallied ? BLUE      : CYAN
  const pillDot   = isTallied ? BLUE      : CYAN

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.5) }}
      className="group rounded-xl p-7 flex flex-col gap-4 transition-all duration-200"
      style={{ background: WHITE, border: `1px solid ${HAIRLINE}` }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(-1px)'
        el.style.boxShadow = '0 8px 24px rgba(5,12,156,0.08)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.transform = 'translateY(0)'
        el.style.boxShadow = 'none'
      }}
    >
      {/* Top row: title + status pill */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2
            className="text-base font-semibold tracking-tight leading-snug line-clamp-2"
            style={{ color: NAVY, letterSpacing: '-0.02em' }}
          >
            {election.title}
          </h2>
          {election.description && (
            <p className="text-sm mt-1 line-clamp-2" style={{ color: BODY }}>
              {election.description}
            </p>
          )}
        </div>
        {/* Status pill per DESIGN.md: rounded-full with leading dot */}
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium shrink-0"
          style={{ background: pillBg, color: NAVY }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: pillDot }}
          />
          {isTallied
            ? <><BarChart2 size={10} strokeWidth={2.5} style={{ color: pillColor }} /> Resultados</>
            : <><Lock size={10} strokeWidth={2.5} style={{ color: pillColor }} /> Cerrada</>
          }
        </span>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <span className="flex items-center gap-1.5 text-xs" style={{ color: MUTE }}>
          <Calendar size={11} strokeWidth={2} />
          Cerró {formatDate(election.endDate)}
        </span>
        <span className="flex items-center gap-1.5 text-xs" style={{ color: MUTE }}>
          <Vote size={11} strokeWidth={2} />
          {election.candidates.length} candidato{election.candidates.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Candidate chips */}
      {election.candidates.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {election.candidates.slice(0, 3).map((c) => (
            <span
              key={c.id}
              className="text-xs px-2 py-0.5 rounded-md font-medium"
              style={{ background: ELEVATED, color: BODY, border: `1px solid ${HAIRLINE}` }}
            >
              {c.name}
            </span>
          ))}
          {election.candidates.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-md" style={{ color: MUTE }}>
              +{election.candidates.length - 3} más
            </span>
          )}
        </div>
      )}

      {/* CTAs */}
      <div className="pt-1 flex flex-wrap items-center gap-2">
        {isTallied && (
          <Link
            to={`/elections/${election.id}/results`}
            className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-full transition-all duration-150"
            style={{ background: NAVY, color: WHITE, textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = BLUE }}
            onMouseLeave={(e) => { e.currentTarget.style.background = NAVY }}
          >
            Ver resultados
            <ChevronRight size={14} strokeWidth={2.5} />
          </Link>
        )}
        <Link
          to={`/elections/${election.id}/urn`}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-full transition-all duration-150"
          style={{
            background:     'transparent',
            color:          BLUE,
            border:         `1px solid ${HAIRLINE}`,
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = CYAN_SOFT
            e.currentTarget.style.borderColor = BLUE
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background  = 'transparent'
            e.currentTarget.style.borderColor = HAIRLINE
          }}
        >
          <ShieldCheck size={12} strokeWidth={2} />
          Ver urna
        </Link>
      </div>
    </motion.div>
  )
}

// ── PastElectionsPage ──────────────────────────────────────────────────────

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
    <div style={{ background: '#f8f8f8', minHeight: '100%' }}>
    <div
      style={{ maxWidth: '720px', margin: '0 auto', padding: '2.5rem 1rem' }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <p
          className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: BLUE, letterSpacing: '0.18em' }}
        >
          Archivo público
        </p>
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: NAVY, letterSpacing: '-0.03em' }}
        >
          Historial de Elecciones
        </h1>
        <p className="text-sm mt-1" style={{ color: MUTE }}>
          Elecciones pasadas con resultados y urnas verificables.
        </p>
      </div>

      {error && (
        <p
          className="text-sm px-4 py-3 rounded-lg"
          style={{ background: RED_SOFT, color: RED, border: `1px solid rgba(220,38,38,0.2)` }}
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
          style={{ background: WHITE, border: `1px solid ${HAIRLINE}` }}
        >
          <Vote size={28} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: MUTE }} />
          <p className="text-sm font-semibold" style={{ color: NAVY }}>
            Sin elecciones pasadas
          </p>
          <p className="text-xs mt-1" style={{ color: MUTE }}>
            Las elecciones finalizadas aparecerán aquí.
          </p>
        </div>
      )}
    </div>
    </div>
  )
}
