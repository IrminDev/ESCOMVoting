import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck, Trophy, Vote, Users, GraduationCap, BookOpen, Briefcase } from 'lucide-react'
import { electionService } from '../../services/election.service'
import type { ElectionResultDTO } from '../../model/response/ElectionResultDTO'

// ── Design tokens (DESIGN.md v2.0 oceanic) ────────────────────────────────

const NAVY       = '#050C9C'
const BLUE       = '#3572EF'
const CYAN       = '#3ABEF9'
const ICE        = '#A7E6FF'
const WHITE      = '#ffffff'
const BODY       = '#3a4a6b'
const MUTE       = '#6b7a99'
const HAIRLINE   = 'rgba(58,190,249,0.27)'
const ICE_SOFT   = 'rgba(167,230,255,0.33)'
const CYAN_SOFT  = 'rgba(58,190,249,0.13)'
const ELEVATED   = 'rgba(167,230,255,0.15)'
const STEP_BG    = 'linear-gradient(135deg, #050C9C 0%, #3572EF 100%)'

// Semantic functional colors
const GREEN      = '#16a34a'
const GREEN_SOFT = 'rgba(22,163,74,0.10)'
const RED        = '#dc2626'
const RED_SOFT   = 'rgba(220,38,38,0.08)'

// Group identity colors (functional, not brand)
const GROUP_COLOR = {
  student:   { color: BLUE,  bg: CYAN_SOFT,  label: 'Estudiantes',  icon: GraduationCap },
  professor: { color: GREEN, bg: GREEN_SOFT,  label: 'Profesores',   icon: BookOpen },
  paae:      { color: NAVY,  bg: ICE_SOFT,    label: 'PAAE',         icon: Briefcase },
}

// ── Helpers ────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div
      className="h-14 rounded-lg animate-pulse"
      style={{ background: ICE_SOFT, border: `1px solid ${HAIRLINE}` }}
    />
  )
}

function formatWeightedScore(score: number) {
  const value = Number(score)
  if (!Number.isFinite(value)) return '0.0000'
  return value.toFixed(4)
}

function formatPercent(value: number) {
  if (!Number.isFinite(value) || value < 0) return '0.0%'
  return value.toFixed(1) + '%'
}

// ── GroupBar — mini participation bar for a voter group ───────────────────

function GroupBar({
  count,
  total,
  color,
  bg,
  label,
  Icon,
}: {
  count: number
  total: number
  color: string
  bg: string
  label: string
  Icon: React.ElementType
}) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium shrink-0 w-24"
        style={{ background: bg, color }}
      >
        <Icon size={10} strokeWidth={2} />
        {label}
      </span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: ELEVATED }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="text-xs font-medium shrink-0 tabular-nums" style={{ color: MUTE, minWidth: '28px' }}>
        {count}
      </span>
    </div>
  )
}

// ── GroupSummaryCard ───────────────────────────────────────────────────────

function GroupSummaryCard({
  total,
  color,
  bg,
  label,
  Icon,
}: {
  total: number
  color: string
  bg: string
  label: string
  Icon: React.ElementType
}) {
  return (
    <div
      className="p-4 rounded-xl flex items-center gap-3"
      style={{ background: WHITE, border: `1px solid ${HAIRLINE}` }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ background: bg, color }}
      >
        <Icon size={16} strokeWidth={2} />
      </div>
      <div>
        <p className="text-xs font-medium" style={{ color: MUTE }}>{label}</p>
        <p className="text-xl font-bold tabular-nums" style={{ color: NAVY }}>{total}</p>
      </div>
    </div>
  )
}

// ── ElectionResultsPage ────────────────────────────────────────────────────

export function ElectionResultsPage() {
  const { id } = useParams<{ id: string }>()

  const [results, setResults] = useState<ElectionResultDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('Elección inválida')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    electionService
      .listResults(id, 0, 200)
      .then((page) => {
        const sorted = [...page.content].sort(
          (a, b) => Number(b.weightedScore) - Number(a.weightedScore),
        )
        setResults(sorted)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los resultados')
      })
      .finally(() => setLoading(false))
  }, [id])

  const totalVotes        = results.reduce((s, r) => s + r.voteCount, 0)
  const totalStudents     = results.reduce((s, r) => s + r.studentVotes, 0)
  const totalProfessors   = results.reduce((s, r) => s + r.professorVotes, 0)
  const totalPaae         = results.reduce((s, r) => s + r.paaeVotes, 0)
  const winner            = results[0] ?? null

  return (
    <div
      style={{ maxWidth: '880px', margin: '0 auto', padding: '2.5rem 1rem' }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: BLUE, letterSpacing: '0.18em' }}
          >
            Resultados
          </p>
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ color: NAVY, letterSpacing: '-0.03em' }}
          >
            Resultados de la elección
          </h1>
          <p className="text-sm" style={{ color: MUTE }}>
            Ranking por puntaje ponderado. Cada grupo electoral tiene peso igual.
          </p>
        </div>

        {id && (
          <div className="flex items-center gap-2">
            <Link
              to="/past-elections"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all duration-150"
              style={{
                background:     ELEVATED,
                color:          MUTE,
                border:         `1px solid ${HAIRLINE}`,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = ICE_SOFT
                e.currentTarget.style.color      = NAVY
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = ELEVATED
                e.currentTarget.style.color      = MUTE
              }}
            >
              <ArrowLeft size={12} strokeWidth={2} />
              Volver
            </Link>
            <Link
              to={`/elections/${id}/urn`}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-all duration-150"
              style={{
                background:     GREEN_SOFT,
                color:          GREEN,
                border:         `1px solid rgba(22,163,74,0.3)`,
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(22,163,74,0.18)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = GREEN_SOFT }}
            >
              <ShieldCheck size={12} strokeWidth={2.2} />
              Ver urna
            </Link>
          </div>
        )}
      </div>

      {error && (
        <p
          className="text-sm px-4 py-3 rounded-lg"
          style={{ background: RED_SOFT, color: RED, border: `1px solid rgba(220,38,38,0.2)` }}
        >
          {error}
        </p>
      )}

      {/* Summary cards */}
      {!loading && !error && results.length > 0 && winner && (
        <>
          {/* Winner + total */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              className="col-span-1 sm:col-span-2 p-5 rounded-xl flex items-start gap-4"
              style={{ background: STEP_BG }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'rgba(167,230,255,0.2)', color: ICE }}
              >
                <Trophy size={18} strokeWidth={2.25} />
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: ICE, letterSpacing: '0.18em' }}
                >
                  Ganador
                </p>
                <p className="text-lg font-semibold" style={{ color: WHITE }}>
                  {winner.candidateName}
                </p>
                <p className="text-sm mt-0.5" style={{ color: 'rgba(167,230,255,0.8)' }}>
                  {formatWeightedScore(winner.weightedScore)} pts
                  {totalVotes > 0 && ` · ${formatPercent((winner.voteCount / totalVotes) * 100)} del total`}
                </p>
              </div>
            </div>

            <div
              className="p-5 rounded-xl flex items-start gap-4"
              style={{ background: WHITE, border: `1px solid ${HAIRLINE}` }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: CYAN_SOFT, color: BLUE }}
              >
                <Users size={18} strokeWidth={2} />
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-1"
                  style={{ color: MUTE, letterSpacing: '0.18em' }}
                >
                  Total votos
                </p>
                <p className="text-2xl font-bold tabular-nums" style={{ color: NAVY }}>
                  {totalVotes}
                </p>
              </div>
            </div>
          </div>

          {/* Group participation summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <GroupSummaryCard
              total={totalStudents}
              color={GROUP_COLOR.student.color}
              bg={GROUP_COLOR.student.bg}
              label={GROUP_COLOR.student.label}
              Icon={GROUP_COLOR.student.icon}
            />
            <GroupSummaryCard
              total={totalProfessors}
              color={GROUP_COLOR.professor.color}
              bg={GROUP_COLOR.professor.bg}
              label={GROUP_COLOR.professor.label}
              Icon={GROUP_COLOR.professor.icon}
            />
            <GroupSummaryCard
              total={totalPaae}
              color={GROUP_COLOR.paae.color}
              bg={GROUP_COLOR.paae.bg}
              label={GROUP_COLOR.paae.label}
              Icon={GROUP_COLOR.paae.icon}
            />
          </div>
        </>
      )}

      {/* Results table */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-xl overflow-hidden"
        style={{ background: WHITE, border: `1px solid ${HAIRLINE}` }}
      >
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : results.length > 0 ? (
          <>
            {/* Table header */}
            <div
              className="grid gap-3 px-5 py-3 text-xs uppercase"
              style={{
                gridTemplateColumns: '48px 1fr 80px 100px 80px',
                color:         MUTE,
                borderBottom:  `1px solid ${HAIRLINE}`,
                letterSpacing: '0.10em',
              }}
            >
              <span>#</span>
              <span>Candidato</span>
              <span>Votos</span>
              <span>%</span>
              <span>Puntaje</span>
            </div>

            {/* Rows */}
            <div>
              {results.map((result, idx) => {
                const rank = idx + 1
                const isWinner = rank === 1
                const pct = totalVotes > 0 ? (result.voteCount / totalVotes) * 100 : 0

                return (
                  <div
                    key={result.candidateId}
                    style={{
                      borderBottom: idx < results.length - 1 ? `1px solid ${HAIRLINE}` : 'none',
                      background:   isWinner ? ICE_SOFT : 'transparent',
                    }}
                  >
                    {/* Main row */}
                    <div
                      className="grid gap-3 px-5 pt-3.5 pb-2 items-center"
                      style={{ gridTemplateColumns: '48px 1fr 80px 100px 80px' }}
                    >
                      <span
                        className="inline-flex items-center gap-1 text-sm font-semibold"
                        style={{ color: isWinner ? NAVY : MUTE }}
                      >
                        {isWinner && <Trophy size={13} strokeWidth={2.25} style={{ color: BLUE }} />}
                        #{rank}
                      </span>

                      <span
                        className="text-sm font-medium truncate"
                        style={{ color: NAVY }}
                        title={result.candidateName}
                      >
                        {result.candidateName}
                      </span>

                      <span
                        className="inline-flex items-center gap-1 text-sm tabular-nums"
                        style={{ color: BODY }}
                      >
                        <Vote size={12} strokeWidth={2} />
                        {result.voteCount}
                      </span>

                      <div className="flex items-center gap-2">
                        <div
                          className="flex-1 h-1.5 rounded-full overflow-hidden"
                          style={{ background: ELEVATED }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: isWinner ? STEP_BG : CYAN }}
                          />
                        </div>
                        <span
                          className="text-xs font-medium shrink-0 tabular-nums"
                          style={{ color: MUTE, minWidth: '36px' }}
                        >
                          {formatPercent(pct)}
                        </span>
                      </div>

                      <span className="text-sm font-semibold tabular-nums" style={{ color: BLUE }}>
                        {formatWeightedScore(result.weightedScore)}
                      </span>
                    </div>

                    {/* Group breakdown sub-row */}
                    <div className="px-5 pb-3 space-y-1.5 pl-16">
                      <GroupBar
                        count={result.studentVotes}
                        total={result.voteCount}
                        color={GROUP_COLOR.student.color}
                        bg={GROUP_COLOR.student.bg}
                        label={GROUP_COLOR.student.label}
                        Icon={GROUP_COLOR.student.icon}
                      />
                      <GroupBar
                        count={result.professorVotes}
                        total={result.voteCount}
                        color={GROUP_COLOR.professor.color}
                        bg={GROUP_COLOR.professor.bg}
                        label={GROUP_COLOR.professor.label}
                        Icon={GROUP_COLOR.professor.icon}
                      />
                      <GroupBar
                        count={result.paaeVotes}
                        total={result.voteCount}
                        color={GROUP_COLOR.paae.color}
                        bg={GROUP_COLOR.paae.bg}
                        label={GROUP_COLOR.paae.label}
                        Icon={GROUP_COLOR.paae.icon}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        ) : !error ? (
          <div className="p-10 text-center">
            <Vote size={28} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: MUTE }} />
            <p className="text-sm font-medium" style={{ color: NAVY }}>
              No hay resultados disponibles.
            </p>
            <p className="text-xs mt-1" style={{ color: MUTE }}>
              Esta elección podría no estar en estado de resultados todavía.
            </p>
          </div>
        ) : null}
      </motion.section>
    </div>
  )
}
