import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Vote,
  Calendar,
  ChevronRight,
  Clock,
  Lock,
  BarChart2,
  CheckCircle2,
  ShieldCheck,
  Users,
  ArrowUpRight,
  FileX,
} from 'lucide-react'
import { electionService } from '../../services/election.service'
import { Pagination } from '../../components/shared/Pagination'
import type { ElectionDTO } from '../../model/response/ElectionDTO'
import type { PageResponse } from '../../model/response/PageResponse'

// ── Design tokens (DESIGN.md v2.0 oceanic) ────────────────────────────────

const NAVY         = '#050C9C'
const BLUE         = '#3572EF'
const CYAN         = '#3ABEF9'
const ICE          = '#A7E6FF'
const WHITE        = '#ffffff'
const BODY         = '#3a4a6b'
const MUTE         = '#6b7a99'
const HAIRLINE     = 'rgba(58,190,249,0.27)'
const ICE_SOFT     = 'rgba(167,230,255,0.33)'
const CYAN_SOFT    = 'rgba(58,190,249,0.13)'
const BLUE_SOFT    = 'rgba(53,114,239,0.13)'

// ── Status config ──────────────────────────────────────────────────────────

const STATUS: Record<string, { label: string; dot: string; bg: string; icon: React.ElementType }> = {
  OPEN:    { label: 'En curso',    dot: CYAN, bg: CYAN_SOFT,  icon: Vote     },
  CLOSED:  { label: 'Cerrada',     dot: CYAN, bg: ICE_SOFT,   icon: Lock     },
  TALLIED: { label: 'Resultados',  dot: BLUE, bg: BLUE_SOFT,  icon: BarChart2 },
  DRAFT:   { label: 'Borrador',    dot: MUTE, bg: ICE_SOFT,   icon: Clock    },
}

function StatusPill({ status }: { status: string }) {
  const cfg = STATUS[status] ?? STATUS.DRAFT
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: NAVY, letterSpacing: '0.03em' }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  )
}

function Skeleton() {
  return (
    <div
      className="rounded-2xl animate-pulse"
      style={{ height: 208, background: ICE_SOFT, border: `1px solid rgba(58,190,249,0.13)` }}
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
  const isOpen     = election.status === 'OPEN'
  const isTallied  = election.status === 'TALLIED'
  const isFinished = election.status === 'CLOSED' || isTallied

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -2 }}
      className="group rounded-2xl p-7 flex flex-col gap-5 transition-shadow duration-200"
      style={{
        background: WHITE,
        border: `1px solid ${HAIRLINE}`,
      }}
    >
      {/* Top row: status + voted badge */}
      <div className="flex items-start justify-between gap-3">
        <StatusPill status={election.status} />
        <div className="flex items-center gap-1.5">
          {hasVoted && isOpen && (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
              style={{ background: CYAN_SOFT, color: NAVY }}
            >
              <CheckCircle2 size={11} strokeWidth={2.5} />
              Votado
            </span>
          )}
          <Users size={18} strokeWidth={1.5} style={{ color: MUTE }} />
        </div>
      </div>

      {/* Title + description */}
      <div className="flex-1">
        <h2
          className="text-xl font-semibold leading-snug line-clamp-2"
          style={{ color: NAVY, letterSpacing: '-0.02em' }}
        >
          {election.title}
        </h2>
        <p
          className="text-sm mt-2 line-clamp-2 leading-relaxed"
          style={{ color: BODY }}
        >
          {election.description}
        </p>
      </div>

      {/* Candidates preview */}
      {election.candidates.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {election.candidates.slice(0, 3).map((c) => (
            <span
              key={c.id}
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: ICE_SOFT, color: BODY, border: `1px solid ${HAIRLINE}` }}
            >
              {c.name}
            </span>
          ))}
          {election.candidates.length > 3 && (
            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: ICE_SOFT, color: MUTE }}
            >
              +{election.candidates.length - 3} más
            </span>
          )}
        </div>
      )}

      {/* Footer: date + CTA */}
      <div className="flex items-center justify-between gap-3 pt-1 border-t" style={{ borderColor: HAIRLINE }}>
        <span className="flex items-center gap-1.5 text-xs" style={{ color: MUTE }}>
          <Calendar size={13} strokeWidth={1.75} />
          {formatDate(election.endDate)}
        </span>

        {isOpen && hasVoted ? (
          <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: CYAN }}>
            <CheckCircle2 size={12} strokeWidth={2.5} />
            Ya votaste
          </span>
        ) : isOpen ? (
          <Link
            to={`/elections/${election.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all duration-150"
            style={{ background: NAVY, color: WHITE, textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
          >
            <Vote size={11} strokeWidth={2.5} />
            Votar ahora
          </Link>
        ) : isTallied ? (
          <Link
            to={`/elections/${election.id}`}
            className="group/link inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-150"
            style={{ color: BLUE, textDecoration: 'none' }}
          >
            Ver resultados
            <ArrowUpRight
              size={13}
              strokeWidth={2}
              className="transition-transform duration-150 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            />
          </Link>
        ) : isFinished ? (
          <Link
            to={`/elections/${election.id}/urn`}
            className="group/link inline-flex items-center gap-1.5 text-xs font-semibold transition-all duration-150"
            style={{ color: BLUE, textDecoration: 'none' }}
          >
            <ShieldCheck size={12} strokeWidth={2} />
            Ver urna
            <ArrowUpRight
              size={13}
              strokeWidth={2}
              className="transition-transform duration-150 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            />
          </Link>
        ) : null}
      </div>
    </motion.div>
  )
}

// ── Section eyebrow ────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs font-semibold uppercase"
      style={{ color: BLUE, letterSpacing: '0.18em' }}
    >
      {children}
    </p>
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
    <div className="max-w-3xl mx-auto space-y-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Eyebrow>Portal de votación</Eyebrow>
        <h1
          className="text-4xl font-semibold mt-2"
          style={{ color: NAVY, letterSpacing: '-0.03em', lineHeight: 1.05 }}
        >
          Elecciones
        </h1>
        <p className="text-sm mt-2" style={{ color: MUTE }}>
          {loading
            ? 'Cargando elecciones…'
            : elections.length === 0
              ? 'No hay elecciones disponibles.'
              : `${open.length} elección${open.length !== 1 ? 'es' : ''} abierta${open.length !== 1 ? 's' : ''}`}
          {!loading && data && data.totalElements > 0 && (
            <span> · {data.totalElements} en total</span>
          )}
        </p>
      </motion.div>

      {/* Error */}
      {error && (
        <div
          className="px-4 py-3 rounded-xl text-sm"
          style={{ background: '#fee', color: '#c00' }}
        >
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} />)}
        </div>
      )}

      {/* Open elections */}
      {!loading && open.length > 0 && (
        <section className="space-y-4">
          <Eyebrow>Disponibles para votar</Eyebrow>
          <div className="space-y-4">
            {open.map((e, i) => (
              <ElectionCard key={e.id} election={e} index={i} hasVoted={votedIds.has(e.id)} />
            ))}
          </div>
        </section>
      )}

      {/* Other elections */}
      {!loading && other.length > 0 && (
        <section className="space-y-4">
          <Eyebrow>Otras elecciones</Eyebrow>
          <div className="space-y-4">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl p-16 text-center"
          style={{ background: WHITE, border: `1px solid ${HAIRLINE}` }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: ICE_SOFT }}
          >
            <FileX size={24} strokeWidth={1.5} style={{ color: MUTE }} />
          </div>
          <p className="text-base font-semibold" style={{ color: NAVY }}>
            Aún no hay elecciones activas
          </p>
          <p className="text-sm mt-1.5" style={{ color: MUTE }}>
            Cuando una elección esté abierta aparecerá aquí.
          </p>
        </motion.div>
      )}
    </div>
  )
}
