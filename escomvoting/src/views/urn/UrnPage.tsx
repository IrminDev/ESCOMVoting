import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Loader2,
  Copy,
  Check,
  ShieldCheck,
  Vote,
  Sun,
  Moon,
  BarChart2,
} from 'lucide-react'
import { urnService } from '../../services/urn.service'
import { Pagination } from '../../components/shared/Pagination'
import { verifySchnorr } from '../../utils/crypto'
import type { UrnResponse } from '../../model/response/UrnResponse'
import type { BallotDTO } from '../../model/response/BallotDTO'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'

// ── Design tokens (DESIGN.md v2.0 oceanic) ────────────────────────────────

const NAVY         = '#050C9C'
const BLUE         = '#3572EF'
const ICE          = '#A7E6FF'
const WHITE        = '#ffffff'
const BODY         = '#3a4a6b'
const MUTE         = '#6b7a99'
const HAIRLINE     = 'rgba(58,190,249,0.27)'
const ICE_SOFT     = 'rgba(167,230,255,0.33)'
const CYAN_SOFT    = 'rgba(58,190,249,0.13)'
const ELEVATED     = 'rgba(167,230,255,0.15)'
const STEP_BG      = 'linear-gradient(135deg, #050C9C 0%, #3572EF 100%)'

// Semantic functional colors (not brand)
const GREEN        = '#16a34a'
const GREEN_SOFT   = 'rgba(22,163,74,0.10)'
const RED          = '#dc2626'
const RED_SOFT     = 'rgba(220,38,38,0.08)'
const YELLOW       = '#d97706'

// ── Helpers ────────────────────────────────────────────────────────────────

type SortDir = 'asc' | 'desc'
type VerifyStatus = 'idle' | 'running' | 'valid' | 'invalid' | 'error'

const ROLE_LABEL: Record<string, string> = {
  STUDENT:   'Estudiante',
  PROFESSOR: 'Profesor',
  PAAE:      'PAAE',
}

const ROLE_COLOR: Record<string, { color: string; bg: string }> = {
  STUDENT:   { color: BLUE,   bg: CYAN_SOFT },
  PROFESSOR: { color: GREEN,  bg: GREEN_SOFT },
  PAAE:      { color: NAVY,   bg: ICE_SOFT },
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('es-MX', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function truncHex(hex: string, head = 10, tail = 6) {
  if (hex.length <= head + tail + 3) return hex
  return `${hex.slice(0, head)}…${hex.slice(-tail)}`
}

// ── CopyButton ─────────────────────────────────────────────────────────────

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? 'Copiado' : 'Copiar'}
      className="inline-flex items-center justify-center w-5 h-5 rounded transition-colors shrink-0"
      style={{
        color:      copied ? GREEN : MUTE,
        background: 'transparent',
        border:     'none',
        cursor:     'pointer',
      }}
    >
      {copied ? <Check size={11} strokeWidth={2.5} /> : <Copy size={11} strokeWidth={2} />}
    </button>
  )
}

// ── HexRow ─────────────────────────────────────────────────────────────────

function HexRow({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start gap-2 min-w-0">
      <span className="text-xs shrink-0 w-28" style={{ color: MUTE }}>
        {label}
      </span>
      <span
        className={`text-xs break-all flex-1 ${mono ? 'font-mono' : ''}`}
        style={{ color: BODY }}
        title={value}
      >
        {truncHex(value)}
      </span>
      <CopyButton value={value} />
    </div>
  )
}

// ── BallotCard ─────────────────────────────────────────────────────────────

function BallotCard({ ballot, index }: { ballot: BallotDTO; index: number }) {
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>('idle')
  const roleStyle = ROLE_COLOR[ballot.voterGroup] ?? { color: MUTE, bg: ELEVATED }

  async function handleVerify() {
    setVerifyStatus('running')
    await new Promise((r) => setTimeout(r, 20))
    try {
      const ok = verifySchnorr(ballot.rPrime, ballot.sPrime, ballot.ePrime, ballot.publicKeyForRole)
      setVerifyStatus(ok ? 'valid' : 'invalid')
    } catch {
      setVerifyStatus('error')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.6) }}
      className="rounded-xl overflow-hidden"
      style={{ background: WHITE, border: `1px solid ${HAIRLINE}` }}
    >
      <div
        className="flex items-center justify-between gap-3 px-5 py-3.5"
        style={{ borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium shrink-0"
            style={{ background: roleStyle.bg, color: roleStyle.color }}
          >
            {ROLE_LABEL[ballot.voterGroup] ?? ballot.voterGroup}
          </span>
          <span className="text-sm font-semibold truncate" style={{ color: NAVY }}>
            {ballot.candidateName}
          </span>
        </div>
        <span className="text-xs shrink-0" style={{ color: MUTE }}>
          {formatDateTime(ballot.submittedAt)}
        </span>
      </div>

      <div className="px-5 py-4 space-y-2.5">
        <HexRow label="Nullifier"            value={ballot.nullifier} />
        <HexRow label="R′ (punto ciego)"     value={ballot.rPrime} />
        <HexRow label="s′ (firma unblinded)" value={ballot.sPrime} />
        <HexRow label="e′ (desafío)"         value={ballot.ePrime} />
        <HexRow label="Clave pública (rol)"  value={ballot.publicKeyForRole} />
      </div>

      <div
        className="px-5 py-4 space-y-3"
        style={{ borderTop: `1px solid ${HAIRLINE}`, background: ELEVATED }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck size={13} strokeWidth={2} style={{ color: GREEN, flexShrink: 0 }} />
          <span className="text-xs font-medium" style={{ color: MUTE }}>
            Verificación Schnorr:
          </span>
          <code
            className="text-xs font-mono px-2 py-0.5 rounded-md"
            style={{ background: ICE_SOFT, color: BODY }}
          >
            s′·G + e′·P = R′
          </code>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleVerify}
            disabled={verifyStatus === 'running' || verifyStatus === 'valid' || verifyStatus === 'invalid'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: STEP_BG,
              color:      WHITE,
              border:     'none',
              cursor:     verifyStatus === 'idle' ? 'pointer' : 'not-allowed',
              opacity:    verifyStatus !== 'idle' ? 0.6 : 1,
            }}
          >
            {verifyStatus === 'running'
              ? <><Loader2 size={12} strokeWidth={2} className="animate-spin" /> Verificando…</>
              : 'Verificar firma'
            }
          </button>

          <AnimatePresence mode="wait">
            {verifyStatus === 'valid' && (
              <motion.span
                key="valid"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-1.5 text-xs font-medium"
                style={{ color: GREEN }}
              >
                <CheckCircle2 size={14} strokeWidth={2} />
                Firma válida — s′·G + e′·P = R′ ✓
              </motion.span>
            )}
            {verifyStatus === 'invalid' && (
              <motion.span
                key="invalid"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-1.5 text-xs font-medium"
                style={{ color: RED }}
              >
                <XCircle size={14} strokeWidth={2} />
                Firma inválida — s′·G + e′·P ≠ R′
              </motion.span>
            )}
            {verifyStatus === 'error' && (
              <motion.span
                key="error"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-1.5 text-xs font-medium"
                style={{ color: YELLOW }}
              >
                Error al verificar
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className ?? ''}`}
      style={{ background: ICE_SOFT, border: `1px solid ${HAIRLINE}` }}
    />
  )
}

// ── UrnPage ────────────────────────────────────────────────────────────────

export function UrnPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated } = useAuth()
  const { isDark, toggle } = useTheme()

  const [urn, setUrn] = useState<UrnResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filterCandidate, setFilterCandidate] = useState<string>('')
  const [filterGroup, setFilterGroup] = useState<string>('')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [page, setPage] = useState(0)

  const fetchUrn = useCallback(() => {
    if (!id) return
    setLoading(true)
    urnService
      .getUrn(id, {
        page,
        size: 20,
        sort: sortDir,
        candidateId: filterCandidate || undefined,
        voterGroup: filterGroup || undefined,
      })
      .then(setUrn)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'No se pudo cargar la urna'),
      )
      .finally(() => setLoading(false))
  }, [id, page, sortDir, filterCandidate, filterGroup])

  useEffect(() => { fetchUrn() }, [fetchUrn])

  function applyFilter(fn: () => void) {
    fn()
    setPage(0)
  }

  const groups = urn
    ? Array.from(new Set(urn.ballots.content.map((b) => b.voterGroup))).sort()
    : []

  const backToElectionLink = isAuthenticated && id ? `/elections/${id}` : '/past-elections'

  return (
    <div style={{ minHeight: '100vh', background: WHITE }}>
      {/* Top bar */}
      <header
        className="sticky top-0 z-30 h-14 flex items-center gap-3 px-4 sm:px-6"
        style={{ background: WHITE, borderBottom: `1px solid ${HAIRLINE}` }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 shrink-0"
          style={{ textDecoration: 'none' }}
        >
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background: STEP_BG }}
          >
            <ShieldCheck size={13} strokeWidth={2.5} style={{ color: ICE }} />
          </div>
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: NAVY, letterSpacing: '-0.02em' }}
          >
            ESCOM<span style={{ color: BLUE }}>Voting</span>
          </span>
        </Link>

        <span
          className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ml-1"
          style={{ background: CYAN_SOFT, color: BLUE, border: `1px solid ${HAIRLINE}` }}
        >
          Urna Electoral
        </span>

        <div className="ml-auto">
          <button
            onClick={toggle}
            aria-label="Cambiar tema"
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150"
            style={{ color: MUTE, background: 'transparent', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = ICE_SOFT
              e.currentTarget.style.color      = NAVY
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color      = MUTE
            }}
          >
            {isDark ? <Sun size={14} strokeWidth={2} /> : <Moon size={14} strokeWidth={2} />}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Back link + results button */}
        <div className="flex items-center justify-between gap-3">
          <Link
            to={backToElectionLink}
            className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
            style={{ color: MUTE, textDecoration: 'none' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = NAVY }}
            onMouseLeave={(e) => { e.currentTarget.style.color = MUTE }}
          >
            <ChevronLeft size={13} strokeWidth={2} />
            Volver a la elección
          </Link>

          {urn?.status === 'TALLIED' && (
            <Link
              to={`/elections/${id}/results`}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-150"
              style={{ background: STEP_BG, color: WHITE, textDecoration: 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85' }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
            >
              <BarChart2 size={12} strokeWidth={2} />
              Ver resultados
            </Link>
          )}
        </div>

        {/* Error */}
        {error && (
          <div
            className="px-4 py-3 rounded-lg text-sm"
            style={{ background: RED_SOFT, color: RED, border: `1px solid rgba(220,38,38,0.2)` }}
          >
            {error}
          </div>
        )}

        {/* Page header */}
        {!loading && urn && (
          <>
            <div>
              <h1
                className="text-2xl font-semibold tracking-tight"
                style={{ color: NAVY, letterSpacing: '-0.03em' }}
              >
                {urn.electionTitle}
              </h1>
              <p className="text-sm mt-1" style={{ color: MUTE }}>
                Urna Electoral · {urn.ballots.totalElements} voto{urn.ballots.totalElements !== 1 ? 's' : ''} registrado{urn.ballots.totalElements !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Privacy notice */}
            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs leading-relaxed"
              style={{ background: ICE_SOFT, border: `1px solid ${HAIRLINE}`, color: MUTE }}
            >
              <ShieldCheck size={14} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: GREEN }} />
              <span>
                Cada voto incluye una <strong style={{ color: BODY }}>firma ciega EC Schnorr</strong> verificable
                mediante la ecuación <code className="font-mono" style={{ color: NAVY }}>s′·G + e′·P = R′</code>.
                El nullifier garantiza que cada firma es única. Ningún campo revela la identidad del votante.
              </span>
            </div>

            {/* Filter + sort bar */}
            <div
              className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: WHITE, border: `1px solid ${HAIRLINE}` }}
            >
              {/* Candidate filter */}
              <div className="flex items-center gap-2 flex-1 min-w-40">
                <label className="text-xs font-medium shrink-0" style={{ color: MUTE }}>
                  Candidato
                </label>
                <select
                  value={filterCandidate}
                  onChange={(e) => applyFilter(() => setFilterCandidate(e.target.value))}
                  className="flex-1 text-xs rounded-lg px-2 py-1.5 outline-none"
                  style={{
                    background: ELEVATED,
                    border: `1px solid ${HAIRLINE}`,
                    color:  NAVY,
                    cursor: 'pointer',
                  }}
                >
                  <option value="">Todos</option>
                  {urn.candidates.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Group filter chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['', ...groups] as string[]).map((g) => {
                  const active = filterGroup === g
                  const style = g ? ROLE_COLOR[g] : null
                  return (
                    <button
                      key={g || 'ALL'}
                      type="button"
                      onClick={() => applyFilter(() => setFilterGroup(g))}
                      className="text-xs font-medium px-2.5 py-1 rounded-full transition-colors"
                      style={{
                        background: active ? (style?.bg ?? CYAN_SOFT) : ELEVATED,
                        color:      active ? (style?.color ?? BLUE) : MUTE,
                        border:     `1px solid ${active ? (style?.color ?? BLUE) : HAIRLINE}`,
                        cursor:     'pointer',
                      }}
                    >
                      {g === '' ? 'Todos los grupos' : (ROLE_LABEL[g] ?? g)}
                    </button>
                  )
                })}
              </div>

              {/* Sort direction */}
              <button
                type="button"
                onClick={() => applyFilter(() => setSortDir((d) => d === 'asc' ? 'desc' : 'asc'))}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors shrink-0"
                style={{
                  background: ELEVATED,
                  color:      MUTE,
                  border:     `1px solid ${HAIRLINE}`,
                  cursor:     'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = NAVY; e.currentTarget.style.background = ICE_SOFT }}
                onMouseLeave={(e) => { e.currentTarget.style.color = MUTE; e.currentTarget.style.background = ELEVATED }}
              >
                {sortDir === 'asc'
                  ? <><ArrowUp size={12} strokeWidth={2} /> Más antiguo primero</>
                  : <><ArrowDown size={12} strokeWidth={2} /> Más reciente primero</>
                }
                <ArrowUpDown size={11} strokeWidth={2} style={{ opacity: 0.4 }} />
              </button>
            </div>
          </>
        )}

        {/* Loading header skeleton */}
        {loading && !urn && (
          <div className="space-y-2">
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        )}

        {/* Ballot list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-64" />)}
          </div>
        ) : urn && urn.ballots.content.length === 0 ? (
          <div
            className="rounded-xl p-10 text-center"
            style={{ background: WHITE, border: `1px solid ${HAIRLINE}` }}
          >
            <Vote size={28} strokeWidth={1.5} className="mx-auto mb-3" style={{ color: MUTE }} />
            <p className="text-sm font-medium" style={{ color: NAVY }}>
              Sin votos registrados
            </p>
            <p className="text-xs mt-1" style={{ color: MUTE }}>
              No hay votos que coincidan con los filtros.
            </p>
          </div>
        ) : urn ? (
          <>
            <div className="space-y-3">
              {urn.ballots.content.map((ballot, i) => (
                <BallotCard key={ballot.id} ballot={ballot} index={i} />
              ))}
            </div>
            <Pagination
              page={urn.ballots.page}
              totalPages={urn.ballots.totalPages}
              totalElements={urn.ballots.totalElements}
              size={urn.ballots.size}
              onPage={setPage}
            />
          </>
        ) : null}
      </main>
    </div>
  )
}
