import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  Calendar,
  Users,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Vote,
  ArrowLeft,
} from 'lucide-react'
import { electionService } from '../../services/election.service'
import { ballotService } from '../../services/ballot.service'
import { blind, unblind, computeNullifier, bigIntToHex64 } from '../../utils/crypto'
import { useAuth } from '../../contexts/AuthContext'
import type { ElectionDTO } from '../../model/response/ElectionDTO'
import type { CandidateDTO } from '../../model/response/CandidateDTO'
import type { VoteRequest } from '../../model/request/VoteRequest'

// ── Types ──────────────────────────────────────────────────────────────────

type Phase = 'loading' | 'error-load' | 'select' | 'confirm' | 'processing' | 'done' | 'error-vote'

interface ProcessStep {
  label: string
  status: 'pending' | 'running' | 'done' | 'error'
}

const INITIAL_STEPS: ProcessStep[] = [
  { label: 'Solicitando punto de compromiso al servidor',  status: 'pending' },
  { label: 'Generando token criptográfico anónimo',        status: 'pending' },
  { label: 'Firmando token con el servidor',               status: 'pending' },
  { label: 'Finalizando firma anónima',                    status: 'pending' },
  { label: 'Enviando voto (sin identidad)',                 status: 'pending' },
]

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

const ROLE_LABEL: Record<string, string> = {
  STUDENT:   'Estudiantes',
  PROFESSOR: 'Profesores',
  ADMIN:     'Administradores',
}

// ── Sub-components ─────────────────────────────────────────────────────────

function StepRow({ step }: { step: ProcessStep }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-5 shrink-0 flex justify-center">
        {step.status === 'done' && (
          <CheckCircle2 size={16} strokeWidth={2} style={{ color: 'var(--accent-green)' }} />
        )}
        {step.status === 'running' && (
          <Loader2 size={16} strokeWidth={2} className="animate-spin" style={{ color: 'var(--accent-blue)' }} />
        )}
        {step.status === 'error' && (
          <AlertCircle size={16} strokeWidth={2} style={{ color: 'var(--accent-red)' }} />
        )}
        {step.status === 'pending' && (
          <Circle size={16} strokeWidth={1.5} style={{ color: 'var(--text-ash)' }} />
        )}
      </div>
      <span
        className="text-sm"
        style={{
          color: step.status === 'done'
            ? 'var(--accent-green)'
            : step.status === 'running'
              ? 'var(--text-primary)'
              : step.status === 'error'
                ? 'var(--accent-red)'
                : 'var(--text-ash)',
        }}
      >
        {step.label}
      </span>
    </div>
  )
}

function CandidateCard({
  candidate,
  selected,
  onSelect,
}: {
  candidate: CandidateDTO
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full text-left rounded-xl p-5 transition-all duration-150"
      style={{
        background: selected ? 'var(--accent-blue-soft)' : 'var(--surface)',
        border: `2px solid ${selected ? 'var(--accent-blue)' : 'var(--hairline)'}`,
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = 'var(--hairline-strong)'
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = 'var(--hairline)'
      }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
          style={{
            background: selected ? 'var(--accent-blue)' : 'var(--surface-elevated)',
            color: selected ? '#fff' : 'var(--text-mute)',
          }}
        >
          {candidate.name.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p
            className="text-sm font-semibold"
            style={{ color: 'var(--text-primary)' }}
          >
            {candidate.name}
          </p>
          {candidate.description && (
            <p
              className="text-xs mt-1 leading-relaxed"
              style={{ color: 'var(--text-mute)' }}
            >
              {candidate.description}
            </p>
          )}
        </div>

        {/* Selection indicator */}
        <div className="shrink-0 mt-0.5">
          {selected ? (
            <CheckCircle2 size={18} strokeWidth={2} style={{ color: 'var(--accent-blue)' }} />
          ) : (
            <Circle size={18} strokeWidth={1.5} style={{ color: 'var(--hairline-strong)' }} />
          )}
        </div>
      </div>
    </button>
  )
}

// ── ElectionDetailPage ─────────────────────────────────────────────────────

export function ElectionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { session } = useAuth()

  const [election, setElection] = useState<ElectionDTO | null>(null)
  const [phase, setPhase] = useState<Phase>('loading')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selected, setSelected] = useState<CandidateDTO | null>(null)
  const [steps, setSteps] = useState<ProcessStep[]>(INITIAL_STEPS)
  const [voteError, setVoteError] = useState<string | null>(null)
  const [alreadyVoted, setAlreadyVoted] = useState(false)

  // Load election + check if already voted
  useEffect(() => {
    if (!id) return
    Promise.all([
      electionService.getById(id),
      electionService.getMyVotedElectionIds(),
    ])
      .then(([data, votedIds]) => {
        setElection(data)
        if (data.status !== 'OPEN') {
          setLoadError('Esta elección no está abierta para votación.')
          setPhase('error-load')
        } else if (votedIds.includes(id)) {
          setAlreadyVoted(true)
          setPhase('done')
        } else {
          setPhase('select')
        }
      })
      .catch((err: unknown) => {
        setLoadError(err instanceof Error ? err.message : 'No se pudo cargar la elección.')
        setPhase('error-load')
      })
  }, [id])

  // ── Process steps helper ─────────────────────────────────────────────────

  function setStep(index: number, status: ProcessStep['status']) {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, status } : s)),
    )
  }

  // ── Run full blind-signature voting flow ─────────────────────────────────

  async function runVoteFlow() {
    if (!election || !selected || !session) return

    const voterGroup = session.role  // STUDENT | PROFESSOR
    const publicKey = election.publicKeys[voterGroup]

    if (!publicKey) {
      setVoteError(`Tu grupo (${voterGroup}) no está habilitado para esta elección.`)
      setPhase('error-vote')
      return
    }

    setPhase('processing')
    setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: 'pending' as const })))

    try {
      // ── Step 1: Request R point ─────────────────────────────────────────
      setStep(0, 'running')
      const { rPoint } = await ballotService.requestToken(election.id)
      setStep(0, 'done')

      // ── Step 2: Blind (client-side) ─────────────────────────────────────
      setStep(1, 'running')
      const blinding = blind(rPoint, publicKey, election.id, selected.id, voterGroup)
      setStep(1, 'done')

      // ── Step 3: Sign blinded challenge ──────────────────────────────────
      setStep(2, 'running')
      const c = bigIntToHex64(blinding.c)
      const { sResponse } = await ballotService.signToken(election.id, {
        blindedChallenge: c,
      })
      setStep(2, 'done')

      // ── Step 4: Unblind + compute nullifier (client-side) ───────────────
      setStep(3, 'running')
      const sPrime = unblind(sResponse, blinding.alpha)
      const nullifier = computeNullifier(blinding.alpha, blinding.beta, election.id)
      setStep(3, 'done')

      // ── Step 5: Submit anonymous ballot ────────────────────────────────
      setStep(4, 'running')
      const requestVote = {
        candidateId: selected.id,
        voterGroup,
        nullifier,
        rPrime:  blinding.rPrime,
        sPrime:  bigIntToHex64(sPrime),
        ePrime:  bigIntToHex64(blinding.ePrime),
      } as VoteRequest
      console.log('Submitting vote with request body:', requestVote)  // DEBUG
      await ballotService.submitVote(election.id, requestVote)
      setStep(4, 'done')

      setPhase('done')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      // Mark the currently running step as error
      setSteps((prev) =>
        prev.map((s) => (s.status === 'running' ? { ...s, status: 'error' as const } : s)),
      )
      setVoteError(msg)
      setPhase('error-vote')
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (phase === 'loading') {
    return (
      <div className="space-y-6">
        <div className="h-4 w-32 rounded animate-pulse" style={{ background: 'var(--surface-elevated)' }} />
        <div className="h-8 w-2/3 rounded animate-pulse" style={{ background: 'var(--surface-elevated)' }} />
        <div className="h-24 rounded-xl animate-pulse" style={{ background: 'var(--surface-elevated)' }} />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: 'var(--surface-elevated)' }} />
          ))}
        </div>
      </div>
    )
  }

  if (phase === 'error-load') {
    const isFinished = election?.status === 'CLOSED' || election?.status === 'TALLIED'
    return (
      <div className="space-y-5">
        <Link
          to="/elections"
          className="inline-flex items-center gap-1 text-xs font-medium"
          style={{ color: 'var(--text-mute)', textDecoration: 'none' }}
        >
          <ChevronLeft size={13} strokeWidth={2} />
          Volver a elecciones
        </Link>

        {isFinished ? (
          <div
            className="rounded-xl p-6 space-y-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
          >
            <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              {election?.title}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-mute)' }}>
              Esta elección ha finalizado. Puedes consultar la urna electoral para verificar los votos.
            </p>
            <Link
              to={`/elections/${id}/urn`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
              style={{ background: 'var(--cta-bg)', color: 'var(--cta-fg)', textDecoration: 'none' }}
            >
              <ShieldCheck size={14} strokeWidth={2} />
              Ver urna electoral
            </Link>
          </div>
        ) : (
          <div
            className="flex items-start gap-3 px-5 py-4 rounded-xl text-sm"
            style={{ background: 'var(--accent-red-soft)', color: 'var(--accent-red)' }}
          >
            <AlertCircle size={16} strokeWidth={2} className="shrink-0 mt-0.5" />
            {loadError}
          </div>
        )}
      </div>
    )
  }

  if (!election) return null

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        to="/elections"
        className="inline-flex items-center gap-1 text-xs font-medium"
        style={{ color: 'var(--text-mute)', textDecoration: 'none' }}
      >
        <ChevronLeft size={13} strokeWidth={2} />
        Volver a elecciones
      </Link>

      {/* Election header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl p-6 space-y-4"
        style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
      >
        <div>
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {election.title}
          </h1>
          <p
            className="text-sm mt-2 leading-relaxed"
            style={{ color: 'var(--text-body)' }}
          >
            {election.description}
          </p>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-ash)' }}>
            <Calendar size={12} strokeWidth={2} />
            Cierra el {formatDate(election.endDate)}
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-ash)' }}>
            <Users size={12} strokeWidth={2} />
            {election.allowedRoles.map((r) => ROLE_LABEL[r] ?? r).join(' · ')}
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-ash)' }}>
            <Vote size={12} strokeWidth={2} />
            {election.candidates.length} candidato{election.candidates.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Privacy notice */}
        <div
          className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-xs"
          style={{ background: 'var(--surface-elevated)', color: 'var(--text-mute)' }}
        >
          <ShieldCheck size={13} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: 'var(--accent-green)' }} />
          Tu voto es anónimo. El servidor firma una ficha criptográfica sin registrar tu identidad junto al candidato.
        </div>
      </motion.div>

      {/* ── Ballot area ─────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* SELECT phase */}
        {phase === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-ash)' }}>
              Selecciona un candidato
            </h2>
            <div className="space-y-3">
              {election.candidates.map((c) => (
                <CandidateCard
                  key={c.id}
                  candidate={c}
                  selected={selected?.id === c.id}
                  onSelect={() => setSelected(c)}
                />
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={!selected}
                onClick={() => setPhase('confirm')}
                className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
                style={{
                  background: 'var(--cta-bg)',
                  color: 'var(--cta-fg)',
                  border: 'none',
                  cursor: selected ? 'pointer' : 'not-allowed',
                  opacity: selected ? 1 : 0.4,
                }}
                onMouseEnter={(e) => {
                  if (selected) e.currentTarget.style.background = 'var(--cta-bg-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--cta-bg)'
                }}
              >
                Continuar
              </button>
            </div>
          </motion.div>
        )}

        {/* CONFIRM phase */}
        {phase === 'confirm' && selected && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-ash)' }}>
              Confirmar voto
            </h2>

            {/* Confirmation card */}
            <div
              className="rounded-xl p-5 space-y-3"
              style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
            >
              <p className="text-xs" style={{ color: 'var(--text-ash)' }}>Tu candidato seleccionado</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                  style={{ background: 'var(--accent-blue-soft)', color: 'var(--accent-blue)' }}
                >
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {selected.name}
                  </p>
                  {selected.description && (
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-mute)' }}>
                      {selected.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-mute)' }}>
              Al confirmar, se generará una firma anónima mediante el protocolo EC Schnorr.
              Una vez enviado, <strong style={{ color: 'var(--text-body)' }}>tu voto no puede modificarse</strong>.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={runVoteFlow}
                className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
                style={{
                  background: 'var(--cta-bg)',
                  color: 'var(--cta-fg)',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--cta-bg-hover)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--cta-bg)' }}
              >
                Confirmar y votar
              </button>
              <button
                type="button"
                onClick={() => setPhase('select')}
                className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150"
                style={{
                  background: 'transparent',
                  color: 'var(--text-mute)',
                  border: '1px solid var(--hairline)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-primary)'
                  e.currentTarget.style.background = 'var(--surface-elevated)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-mute)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <ArrowLeft size={13} strokeWidth={2} className="inline mr-1" />
                Cambiar
              </button>
            </div>
          </motion.div>
        )}

        {/* PROCESSING phase */}
        {phase === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-xl p-6 space-y-5"
            style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-ash)' }}>
              Procesando voto anónimo
            </h2>
            <div className="space-y-3">
              {steps.map((step, i) => (
                <StepRow key={i} step={step} />
              ))}
            </div>
          </motion.div>
        )}

        {/* DONE phase */}
        {phase === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="rounded-xl p-8 text-center space-y-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-14 h-14 rounded-full mx-auto"
              style={{ background: 'var(--accent-green-soft)' }}
            >
              <CheckCircle2 size={28} strokeWidth={2} style={{ color: 'var(--accent-green)' }} />
            </motion.div>

            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {alreadyVoted ? 'Ya has votado en esta elección' : '¡Voto registrado!'}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-mute)' }}>
                {alreadyVoted
                  ? 'Tu voto fue registrado anteriormente de forma anónima.'
                  : 'Tu voto fue enviado de forma anónima. No puede vincularse a tu identidad.'}
              </p>
            </div>

            <Link
              to="/elections"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium"
              style={{
                background: 'var(--surface-elevated)',
                color: 'var(--text-body)',
                border: '1px solid var(--hairline)',
                textDecoration: 'none',
              }}
            >
              <ChevronLeft size={14} strokeWidth={2.5} />
              Volver a elecciones
            </Link>
          </motion.div>
        )}

        {/* ERROR-VOTE phase */}
        {phase === 'error-vote' && (
          <motion.div
            key="error-vote"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {/* Steps with error state */}
            <div
              className="rounded-xl p-6 space-y-3"
              style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
            >
              <h2 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--text-ash)' }}>
                Proceso interrumpido
              </h2>
              {steps.map((step, i) => (
                <StepRow key={i} step={step} />
              ))}
            </div>

            {voteError && (
              <div
                className="flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm"
                style={{ background: 'var(--accent-red-soft)', color: 'var(--accent-red)' }}
              >
                <AlertCircle size={15} strokeWidth={2} className="shrink-0 mt-0.5" />
                {voteError}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setPhase('confirm')
                  setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: 'pending' as const })))
                  setVoteError(null)
                }}
                className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: 'var(--cta-bg)',
                  color: 'var(--cta-fg)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Reintentar
              </button>
              <button
                type="button"
                onClick={() => {
                  setPhase('select')
                  setSelected(null)
                  setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: 'pending' as const })))
                  setVoteError(null)
                }}
                className="px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  color: 'var(--text-mute)',
                  background: 'transparent',
                  border: '1px solid var(--hairline)',
                  cursor: 'pointer',
                }}
              >
                Cambiar candidato
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
