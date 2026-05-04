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
} from 'lucide-react'
import { urnService } from '../../services/urn.service'
import { Pagination } from '../../components/shared/Pagination'
import { verifySchnorr } from '../../utils/crypto'
import type { UrnResponse } from '../../model/response/UrnResponse'
import type { BallotDTO } from '../../model/response/BallotDTO'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { Sun, Moon } from 'lucide-react'

// ── Helpers ────────────────────────────────────────────────────────────────

type SortDir = 'asc' | 'desc'
type VerifyStatus = 'idle' | 'running' | 'valid' | 'invalid' | 'error'

const ROLE_LABEL: Record<string, string> = {
  STUDENT:   'Estudiante',
  PROFESSOR: 'Profesor',
  ADMIN:     'Administrador',
}

const ROLE_COLOR: Record<string, { color: string; bg: string }> = {
  STUDENT:   { color: 'var(--accent-blue)',   bg: 'var(--accent-blue-soft)' },
  PROFESSOR: { color: 'var(--accent-green)',  bg: 'var(--accent-green-soft)' },
  ADMIN:     { color: 'var(--accent-yellow)', bg: 'var(--accent-yellow-soft)' },
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
        color: copied ? 'var(--accent-green)' : 'var(--text-ash)',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
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
      <span className="text-xs shrink-0 w-28" style={{ color: 'var(--text-ash)' }}>
        {label}
      </span>
      <span
        className={`text-xs break-all flex-1 ${mono ? 'font-mono' : ''}`}
        style={{ color: 'var(--text-body)' }}
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
  const roleStyle = ROLE_COLOR[ballot.voterGroup] ?? { color: 'var(--text-mute)', bg: 'var(--surface-card)' }

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
      style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
    >
      <div
        className="flex items-center justify-between gap-3 px-5 py-3.5"
        style={{ borderBottom: '1px solid var(--hairline)' }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium shrink-0"
            style={{ background: roleStyle.bg, color: roleStyle.color }}
          >
            {ROLE_LABEL[ballot.voterGroup] ?? ballot.voterGroup}
          </span>
          <span className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {ballot.candidateName}
          </span>
        </div>
        <span className="text-xs shrink-0" style={{ color: 'var(--text-ash)' }}>
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
        style={{ borderTop: '1px solid var(--hairline)', background: 'var(--surface-elevated)' }}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck size={13} strokeWidth={2} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
          <span className="text-xs font-medium" style={{ color: 'var(--text-mute)' }}>
            Verificación Schnorr:
          </span>
          <code
            className="text-xs font-mono px-2 py-0.5 rounded-md"
            style={{ background: 'var(--surface-card)', color: 'var(--text-body)' }}
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
              background: 'var(--cta-bg)',
              color: 'var(--cta-fg)',
              border: 'none',
              cursor: verifyStatus === 'idle' ? 'pointer' : 'not-allowed',
              opacity: verifyStatus !== 'idle' ? 0.6 : 1,
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
                style={{ color: 'var(--accent-green)' }}
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
                style={{ color: 'var(--accent-red)' }}
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
                style={{ color: 'var(--accent-yellow)' }}
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
      style={{ background: 'var(--surface-elevated)' }}
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

  // Filters + pagination state
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

  // Reset to page 0 when filters/sort change
  function applyFilter(fn: () => void) {
    fn()
    setPage(0)
  }

  const groups = urn
    ? Array.from(new Set(urn.ballots.content.map((b) => b.voterGroup))).sort()
    : []

  const backToElectionLink = isAuthenticated && id ? `/elections/${id}` : '/past-elections'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--canvas)' }}>
      {/* Minimal top bar */}
      <header
        className="sticky top-0 z-30 h-14 flex items-center gap-3 px-4 sm:px-6"
        style={{ background: 'var(--surface)', borderBottom: '1px solid var(--hairline)' }}
      >
        <Link to="/" className="flex items-center gap-2 shrink-0" style={{ textDecoration: 'none' }}>
          <Vote size={18} style={{ color: 'var(--accent-red)' }} strokeWidth={2} />
          <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            ESCOMVoting
          </span>
        </Link>

        <span
          className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-md font-medium ml-1"
          style={{ background: 'var(--surface-elevated)', color: 'var(--text-ash)', border: '1px solid var(--hairline)' }}
        >
          Urna Electoral
        </span>

        <div className="ml-auto">
          <button
            onClick={toggle}
            aria-label="Cambiar tema"
            className="p-2 rounded-md transition-colors"
            style={{ color: 'var(--text-mute)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--surface-elevated)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-mute)'; e.currentTarget.style.background = 'transparent' }}
          >
            {isDark ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Back link */}
        <Link
          to={backToElectionLink}
          className="inline-flex items-center gap-1 text-xs font-medium"
          style={{ color: 'var(--text-mute)', textDecoration: 'none' }}
        >
          <ChevronLeft size={13} strokeWidth={2} />
          Volver a la elección
        </Link>

        {/* Error */}
        {error && (
          <div
            className="px-4 py-3 rounded-lg text-sm"
            style={{ background: 'var(--accent-red-soft)', color: 'var(--accent-red)' }}
          >
            {error}
          </div>
        )}

        {/* Page header */}
        {!loading && urn && (
          <>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {urn.electionTitle}
              </h1>
              <p className="text-sm mt-1" style={{ color: 'var(--text-mute)' }}>
                Urna Electoral · {urn.ballots.totalElements} voto{urn.ballots.totalElements !== 1 ? 's' : ''} registrado{urn.ballots.totalElements !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Privacy notice */}
            <div
              className="flex items-start gap-2.5 px-4 py-3 rounded-lg text-xs leading-relaxed"
              style={{ background: 'var(--surface)', border: '1px solid var(--hairline)', color: 'var(--text-mute)' }}
            >
              <ShieldCheck size={14} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: 'var(--accent-green)' }} />
              <span>
                Cada voto incluye una <strong style={{ color: 'var(--text-body)' }}>firma ciega EC Schnorr</strong> verificable
                mediante la ecuación <code className="font-mono">s′·G + e′·P = R′</code>.
                El nullifier garantiza que cada firma es única. Ningún campo revela la identidad del votante.
              </span>
            </div>

            {/* Filter + sort bar */}
            <div
              className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl"
              style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
            >
              {/* Candidate filter */}
              <div className="flex items-center gap-2 flex-1 min-w-40">
                <label className="text-xs font-medium shrink-0" style={{ color: 'var(--text-ash)' }}>
                  Candidato
                </label>
                <select
                  value={filterCandidate}
                  onChange={(e) => applyFilter(() => setFilterCandidate(e.target.value))}
                  className="flex-1 text-xs rounded-lg px-2 py-1.5 outline-none"
                  style={{
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--hairline)',
                    color: 'var(--text-primary)',
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
                        background: active ? (style?.bg ?? 'var(--cta-bg)') : 'var(--surface-elevated)',
                        color:      active ? (style?.color ?? 'var(--cta-fg)') : 'var(--text-mute)',
                        border: `1px solid ${active ? (style?.color ?? 'var(--cta-bg)') : 'var(--hairline)'}`,
                        cursor: 'pointer',
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
                  background: 'var(--surface-elevated)',
                  color: 'var(--text-mute)',
                  border: '1px solid var(--hairline)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-mute)' }}
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
            style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
          >
            <p className="text-sm" style={{ color: 'var(--text-ash)' }}>
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
