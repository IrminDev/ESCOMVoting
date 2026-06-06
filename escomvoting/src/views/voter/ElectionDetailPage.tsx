import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  Calendar,
  Users,
  CheckCircle2,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Vote,
  ArrowLeft,
  Lock,
  KeyRound,
  Fingerprint,
  ArrowRight,
} from 'lucide-react'
import { electionService } from '../../services/election.service'
import { ballotService } from '../../services/ballot.service'
import { blind, unblind, computeNullifier, bigIntToHex64 } from '../../utils/crypto'
import { useAuth } from '../../contexts/AuthContext'
import type { ElectionDTO } from '../../model/response/ElectionDTO'
import type { CandidateDTO } from '../../model/response/CandidateDTO'
import type { VoteRequest } from '../../model/request/VoteRequest'

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
const STEP_BUBBLE  = 'linear-gradient(135deg, #050C9C 0%, #3572EF 100%)'

// ── Types ──────────────────────────────────────────────────────────────────

type Phase = 'loading' | 'error-load' | 'select' | 'confirm' | 'processing' | 'done' | 'error-vote'

interface ProcessStep {
  label: string
  status: 'pending' | 'running' | 'done' | 'error'
  icon: React.ElementType
}

const INITIAL_STEPS: ProcessStep[] = [
  { label: 'Solicitando punto de compromiso al servidor',  status: 'pending', icon: ArrowRight  },
  { label: 'Generando token criptográfico anónimo',        status: 'pending', icon: KeyRound    },
  { label: 'Firmando token con el servidor',               status: 'pending', icon: ShieldCheck },
  { label: 'Finalizando firma anónima',                    status: 'pending', icon: Fingerprint },
  { label: 'Enviando voto (sin identidad)',                 status: 'pending', icon: Vote        },
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
  PAAE:      'PAAE',
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase" style={{ color: BLUE, letterSpacing: '0.18em' }}>
      {children}
    </p>
  )
}

function StepRow({ step }: { step: ProcessStep }) {
  const StepIcon = step.icon
  const isDone    = step.status === 'done'
  const isRunning = step.status === 'running'
  const isError   = step.status === 'error'
  const isPending = step.status === 'pending'

  return (
    <div className="flex items-center gap-4">
      {/* Bubble */}
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm"
        style={{
          background: isDone    ? CYAN_SOFT  :
                      isRunning ? STEP_BUBBLE :
                      isError   ? '#fee'      :
                                  ICE_SOFT,
        }}
      >
        {isDone && <CheckCircle2 size={16} strokeWidth={2.5} style={{ color: CYAN }} />}
        {isRunning && <Loader2 size={16} strokeWidth={2.5} className="animate-spin" style={{ color: WHITE }} />}
        {isError && <AlertCircle size={16} strokeWidth={2.5} style={{ color: '#c00' }} />}
        {isPending && <StepIcon size={15} strokeWidth={1.75} style={{ color: MUTE }} />}
      </div>

      {/* Label */}
      <div>
        <p
          className="text-sm"
          style={{
            color: isDone    ? NAVY  :
                   isRunning ? NAVY  :
                   isError   ? '#c00' :
                               MUTE,
            fontWeight: isRunning ? 600 : 400,
          }}
        >
          {step.label}
        </p>
        {isRunning && (
          <p className="text-xs mt-0.5" style={{ color: BLUE }}>Procesando…</p>
        )}
      </div>
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
      className="w-full text-left rounded-2xl p-5 transition-all duration-150"
      style={{
        background: selected ? BLUE_SOFT : WHITE,
        border: `2px solid ${selected ? BLUE : HAIRLINE}`,
        cursor: 'pointer',
        boxShadow: selected ? `0 0 0 3px ${BLUE_SOFT}` : 'none',
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = `rgba(58,190,249,0.55)`
          e.currentTarget.style.background = ICE_SOFT
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = HAIRLINE
          e.currentTarget.style.background = WHITE
        }
      }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
          style={{
            background: selected ? STEP_BUBBLE : ICE_SOFT,
            color: selected ? WHITE : NAVY,
          }}
        >
          {candidate.name.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold" style={{ color: NAVY, letterSpacing: '-0.01em' }}>
            {candidate.name}
          </p>
          {candidate.description && (
            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: BODY }}>
              {candidate.description}
            </p>
          )}
        </div>

        {/* Radio indicator */}
        <div
          className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center border-2 transition-all duration-150 mt-0.5"
          style={{
            borderColor: selected ? BLUE : `rgba(58,190,249,0.4)`,
            background: selected ? BLUE : 'transparent',
          }}
        >
          {selected && <div className="w-2 h-2 rounded-full" style={{ background: WHITE }} />}
        </div>
      </div>
    </button>
  )
}

// ── Loading skeleton ───────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-pulse">
      <div className="h-4 w-32 rounded-full" style={{ background: ICE_SOFT }} />
      <div
        className="rounded-2xl p-7 space-y-5"
        style={{ background: WHITE, border: `1px solid ${HAIRLINE}` }}
      >
        <div className="h-8 w-2/3 rounded-xl" style={{ background: ICE_SOFT }} />
        <div className="h-4 w-full rounded-lg" style={{ background: ICE_SOFT }} />
        <div className="h-4 w-3/4 rounded-lg" style={{ background: ICE_SOFT }} />
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-20 rounded-2xl" style={{ background: ICE_SOFT, border: `1px solid rgba(58,190,249,0.13)` }} />
      ))}
    </div>
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

  function setStep(index: number, status: ProcessStep['status']) {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, status } : s)),
    )
  }

  async function runVoteFlow() {
    if (!election || !selected || !session) return

    const voterGroup = session.role
    const publicKey  = election.publicKeys[voterGroup]

    if (!publicKey) {
      setVoteError(`Tu grupo (${voterGroup}) no está habilitado para esta elección.`)
      setPhase('error-vote')
      return
    }

    setPhase('processing')
    setSteps(INITIAL_STEPS.map((s) => ({ ...s, status: 'pending' as const })))

    try {
      setStep(0, 'running')
      const { rPoint } = await ballotService.requestToken(election.id)
      setStep(0, 'done')

      setStep(1, 'running')
      const blinding = blind(rPoint, publicKey, election.id, selected.id, voterGroup)
      setStep(1, 'done')

      setStep(2, 'running')
      const c = bigIntToHex64(blinding.c)
      const { sResponse } = await ballotService.signToken(election.id, { blindedChallenge: c })
      setStep(2, 'done')

      setStep(3, 'running')
      const sPrime   = unblind(sResponse, blinding.alpha)
      const nullifier = computeNullifier(blinding.alpha, blinding.beta, election.id)
      setStep(3, 'done')

      setStep(4, 'running')
      const requestVote = {
        candidateId: selected.id,
        voterGroup,
        nullifier,
        rPrime: blinding.rPrime,
        sPrime: bigIntToHex64(sPrime),
        ePrime: bigIntToHex64(blinding.ePrime),
      } as VoteRequest
      console.log('Submitting vote with request body:', requestVote)
      await ballotService.submitVote(election.id, requestVote)
      setStep(4, 'done')

      setPhase('done')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido'
      setSteps((prev) =>
        prev.map((s) => (s.status === 'running' ? { ...s, status: 'error' as const } : s)),
      )
      setVoteError(msg)
      setPhase('error-vote')
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (phase === 'loading') return <LoadingSkeleton />

  if (phase === 'error-load') {
    const isFinished = election?.status === 'CLOSED' || election?.status === 'TALLIED'
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <BackLink />

        {isFinished ? (
          <div
            className="rounded-2xl p-7 space-y-5"
            style={{ background: WHITE, border: `1px solid ${HAIRLINE}` }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: ICE_SOFT }}
            >
              <Lock size={20} strokeWidth={1.5} style={{ color: NAVY }} />
            </div>
            <div>
              <Eyebrow>Elección finalizada</Eyebrow>
              <h1
                className="text-2xl font-semibold mt-2"
                style={{ color: NAVY, letterSpacing: '-0.02em' }}
              >
                {election?.title}
              </h1>
              <p className="text-sm mt-1.5" style={{ color: BODY }}>
                Esta elección ha finalizado. Consulta la urna para verificar los votos registrados.
              </p>
            </div>
            <Link
              to={`/elections/${id}/urn`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-150 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              style={{ background: WHITE, color: NAVY, textDecoration: 'none', border: `1px solid ${HAIRLINE}` }}
            >
              <ShieldCheck size={14} strokeWidth={2} />
              Ver urna electoral
              <ArrowRight size={14} strokeWidth={2} />
            </Link>
          </div>
        ) : (
          <div
            className="flex items-start gap-3 px-5 py-4 rounded-xl text-sm"
            style={{ background: '#fee', color: '#c00' }}
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
    <div className="max-w-2xl mx-auto space-y-6">
      <BackLink />

      {/* Election header card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl p-7 space-y-5"
        style={{ background: WHITE, border: `1px solid ${HAIRLINE}` }}
      >
        <div>
          <Eyebrow>Votación activa</Eyebrow>
          <h1
            className="text-2xl font-semibold mt-2 leading-snug"
            style={{ color: NAVY, letterSpacing: '-0.02em' }}
          >
            {election.title}
          </h1>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: BODY }}>
            {election.description}
          </p>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: MUTE }}>
            <Calendar size={13} strokeWidth={1.75} />
            Cierra el {formatDate(election.endDate)}
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: MUTE }}>
            <Users size={13} strokeWidth={1.75} />
            {election.allowedRoles.map((r) => ROLE_LABEL[r] ?? r).join(' · ')}
          </span>
          <span className="flex items-center gap-1.5 text-xs" style={{ color: MUTE }}>
            <Vote size={13} strokeWidth={1.75} />
            {election.candidates.length} candidato{election.candidates.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Privacy notice */}
        <div
          className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-xs"
          style={{ background: ICE_SOFT, color: NAVY }}
        >
          <ShieldCheck size={13} strokeWidth={2} className="shrink-0 mt-0.5" style={{ color: CYAN }} />
          <span style={{ color: BODY }}>
            <strong style={{ color: NAVY }}>Voto anónimo.</strong>{' '}
            El servidor firma una ficha criptográfica sin registrar tu identidad junto al candidato.
          </span>
        </div>
      </motion.div>

      {/* ── Ballot area ─────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* SELECT */}
        {phase === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <Eyebrow>Selecciona un candidato</Eyebrow>
            <div className="space-y-3">
              {election.candidates.map((c, i) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                >
                  <CandidateCard
                    candidate={c}
                    selected={selected?.id === c.id}
                    onSelect={() => setSelected(c)}
                  />
                </motion.div>
              ))}
            </div>

            <div className="pt-1">
              <button
                type="button"
                disabled={!selected}
                onClick={() => setPhase('confirm')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-150"
                style={{
                  background: selected ? NAVY : ICE_SOFT,
                  color: selected ? WHITE : MUTE,
                  border: 'none',
                  cursor: selected ? 'pointer' : 'not-allowed',
                  boxShadow: selected ? '0 4px 12px rgba(5,12,156,0.25)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (selected) e.currentTarget.style.opacity = '0.9'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1'
                }}
              >
                Continuar
                <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </div>
          </motion.div>
        )}

        {/* CONFIRM */}
        {phase === 'confirm' && selected && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <Eyebrow>Confirmar voto</Eyebrow>

            {/* Selected candidate card */}
            <div
              className="rounded-2xl p-6 space-y-4"
              style={{ background: WHITE, border: `1px solid ${HAIRLINE}` }}
            >
              <p className="text-xs font-semibold uppercase" style={{ color: MUTE, letterSpacing: '0.1em' }}>
                Tu candidato seleccionado
              </p>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-base font-bold shrink-0"
                  style={{ background: STEP_BUBBLE, color: WHITE }}
                >
                  {selected.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-base font-semibold" style={{ color: NAVY, letterSpacing: '-0.01em' }}>
                    {selected.name}
                  </p>
                  {selected.description && (
                    <p className="text-sm mt-0.5" style={{ color: BODY }}>
                      {selected.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: MUTE }}>
              Al confirmar se generará una firma anónima mediante el protocolo EC Schnorr.
              Una vez enviado,{' '}
              <strong style={{ color: BODY }}>tu voto no puede modificarse</strong>.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={runVoteFlow}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-150"
                style={{ background: NAVY, color: WHITE, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(5,12,156,0.25)' }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
              >
                <Vote size={14} strokeWidth={2.5} />
                Confirmar y votar
              </button>
              <button
                type="button"
                onClick={() => setPhase('select')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-150"
                style={{
                  background: 'transparent',
                  color: MUTE,
                  border: `1px solid ${HAIRLINE}`,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = NAVY
                  e.currentTarget.style.borderColor = CYAN
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = MUTE
                  e.currentTarget.style.borderColor = HAIRLINE
                }}
              >
                <ArrowLeft size={13} strokeWidth={2} />
                Cambiar
              </button>
            </div>
          </motion.div>
        )}

        {/* PROCESSING */}
        {phase === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl p-7 space-y-6"
            style={{ background: WHITE, border: `1px solid ${HAIRLINE}` }}
          >
            <div>
              <Eyebrow>Procesando voto anónimo</Eyebrow>
              <p className="text-sm mt-1" style={{ color: MUTE }}>
                No cierres esta ventana hasta que el proceso finalice.
              </p>
            </div>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <StepRow key={i} step={step} />
              ))}
            </div>
          </motion.div>
        )}

        {/* DONE */}
        {phase === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl p-12 text-center space-y-6"
            style={{ background: WHITE, border: `1px solid ${HAIRLINE}` }}
          >
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 18 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mx-auto"
              style={{ background: STEP_BUBBLE, boxShadow: `0 8px 32px rgba(5,12,156,0.30)` }}
            >
              <CheckCircle2 size={36} strokeWidth={1.75} style={{ color: ICE }} />
            </motion.div>

            <div>
              <Eyebrow>
                {alreadyVoted ? 'Voto anterior' : 'Voto registrado'}
              </Eyebrow>
              <h2
                className="text-2xl font-semibold mt-2"
                style={{ color: NAVY, letterSpacing: '-0.02em' }}
              >
                {alreadyVoted ? 'Ya has votado en esta elección' : '¡Voto registrado con éxito!'}
              </h2>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: BODY }}>
                {alreadyVoted
                  ? 'Tu voto fue registrado anteriormente de forma anónima.'
                  : 'Tu voto fue enviado de forma anónima y no puede vincularse a tu identidad.'}
              </p>
            </div>

            <Link
              to="/elections"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-150 shadow-md hover:shadow-lg hover:-translate-y-0.5"
              style={{
                background: WHITE,
                color: NAVY,
                border: `1px solid ${HAIRLINE}`,
                textDecoration: 'none',
              }}
            >
              <ChevronLeft size={14} strokeWidth={2.5} />
              Volver a elecciones
            </Link>
          </motion.div>
        )}

        {/* ERROR-VOTE */}
        {phase === 'error-vote' && (
          <motion.div
            key="error-vote"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            <div
              className="rounded-2xl p-7 space-y-5"
              style={{ background: WHITE, border: `1px solid ${HAIRLINE}` }}
            >
              <Eyebrow>Proceso interrumpido</Eyebrow>
              <div className="space-y-4">
                {steps.map((step, i) => (
                  <StepRow key={i} step={step} />
                ))}
              </div>
            </div>

            {voteError && (
              <div
                className="flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm"
                style={{ background: '#fee', color: '#c00' }}
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-150"
                style={{ background: NAVY, color: WHITE, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(5,12,156,0.25)' }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.9' }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
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
                className="px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-150"
                style={{ color: MUTE, background: 'transparent', border: `1px solid ${HAIRLINE}`, cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = NAVY
                  e.currentTarget.style.borderColor = CYAN
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = MUTE
                  e.currentTarget.style.borderColor = HAIRLINE
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

// ── Shared back link ───────────────────────────────────────────────────────

function BackLink() {
  return (
    <Link
      to="/elections"
      className="inline-flex items-center gap-1.5 text-xs font-medium transition-colors duration-150"
      style={{ color: MUTE, textDecoration: 'none' }}
      onMouseEnter={(e) => { e.currentTarget.style.color = NAVY }}
      onMouseLeave={(e) => { e.currentTarget.style.color = MUTE }}
    >
      <ChevronLeft size={13} strokeWidth={2.5} />
      Volver a elecciones
    </Link>
  )
}
