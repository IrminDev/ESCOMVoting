import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Plus,
  Trash2,
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { electionService } from '../../../services/election.service'
import type { CandidateInput } from '../../../model/request/CreateElectionRequest'
import {
  NAVY,
  BLUE,
  CYAN,
  ICE,
  WHITE,
  BODY,
  MUTE,
  HAIRLINE_CYAN,
  BLUE_SOFT,
} from '../theme'

const inputCls =
  'w-full px-4 py-2.5 text-sm rounded-lg outline-none transition-all'
const inputStyle: React.CSSProperties = {
  background: WHITE,
  border: `1px solid ${HAIRLINE_CYAN}`,
  color: NAVY,
}
const focusHandlers = {
  onFocus: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    e.currentTarget.style.borderColor = BLUE
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(53,114,239,0.12)'
  },
  onBlur: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    e.currentTarget.style.borderColor = HAIRLINE_CYAN
    e.currentTarget.style.boxShadow = 'none'
  },
}

function FieldGroup({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label
        className="block text-xs font-semibold uppercase"
        style={{ color: BLUE, letterSpacing: '0.1em' }}
      >
        {label}
        {hint && (
          <span
            className="ml-1.5 text-xs font-normal normal-case"
            style={{ color: MUTE, letterSpacing: 0 }}
          >
            · {hint}
          </span>
        )}
      </label>
      {children}
    </div>
  )
}

function SectionCard({
  eyebrow,
  title,
  subtitle,
  children,
  delay = 0,
}: {
  eyebrow: string
  title: string
  subtitle?: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="p-7 rounded-2xl"
      style={{ background: WHITE, border: `1px solid ${HAIRLINE_CYAN}` }}
    >
      <div className="mb-6">
        <span
          className="text-xs font-semibold uppercase"
          style={{ color: BLUE, letterSpacing: '0.18em' }}
        >
          {eyebrow}
        </span>
        <h2
          className="text-lg font-semibold tracking-tight mt-1"
          style={{ color: NAVY, letterSpacing: '-0.02em' }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm mt-1.5" style={{ color: BODY }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </motion.div>
  )
}

const ROLES = [
  { value: 'STUDENT', label: 'Estudiantes' },
  { value: 'PROFESSOR', label: 'Profesores' },
  { value: 'PAAE', label: 'PAAE' },
]

export function NewElectionPage() {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [allowedRoles, setAllowedRoles] = useState<string[]>([
    'STUDENT',
    'PROFESSOR',
    'PAAE',
  ])
  const [candidates, setCandidates] = useState<CandidateInput[]>([
    { name: '', description: '' },
    { name: '', description: '' },
  ])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function toggleRole(role: string) {
    setAllowedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    )
  }

  function updateCandidate(
    index: number,
    field: keyof CandidateInput,
    value: string,
  ) {
    setCandidates((prev) =>
      prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)),
    )
  }

  function addCandidate() {
    setCandidates((prev) => [...prev, { name: '', description: '' }])
  }

  function removeCandidate(index: number) {
    if (candidates.length <= 2) return
    setCandidates((prev) => prev.filter((_, i) => i !== index))
  }

  function toInstant(local: string): string {
    return new Date(local).toISOString()
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)

    if (allowedRoles.length === 0) {
      setError('Selecciona al menos un grupo de votantes.')
      return
    }
    const validCandidates = candidates.filter((c) => c.name.trim())
    if (validCandidates.length < 2) {
      setError('Agrega al menos 2 candidatos con nombre.')
      return
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError('La fecha de cierre debe ser posterior al inicio.')
      return
    }

    setLoading(true)
    try {
      await electionService.create({
        title: title.trim(),
        description: description.trim(),
        startDate: toInstant(startDate),
        endDate: toInstant(endDate),
        allowedRoles,
        candidates: validCandidates,
      })
      setSuccess(true)
      setTimeout(() => navigate('/admin/elections'), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la elección.')
    } finally {
      setLoading(false)
    }
  }

  const formIncomplete = !title || !startDate || !endDate

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/admin/elections"
          className="inline-flex items-center gap-1 text-xs font-semibold mb-5"
          style={{ color: BLUE, textDecoration: 'none' }}
        >
          <ChevronLeft size={13} strokeWidth={2.5} />
          Volver a elecciones
        </Link>
        <span
          className="inline-flex items-center gap-1.5 mb-3 text-xs font-semibold uppercase"
          style={{ color: BLUE, letterSpacing: '0.18em' }}
        >
          <Sparkles size={12} strokeWidth={2.5} />
          Nuevo proceso
        </span>
        <h1
          className="font-semibold tracking-tight"
          style={{
            color: NAVY,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
          }}
        >
          Crear elección
        </h1>
        <p
          className="text-sm mt-2 max-w-xl"
          style={{ color: BODY, lineHeight: 1.6 }}
        >
          Completa todos los campos. Se generarán pares de claves EC por grupo
          automáticamente.
        </p>
      </div>

      {/* Feedback */}
      {error && (
        <div
          className="flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm"
          style={{ background: '#fee', color: '#c00' }}
        >
          <AlertCircle size={15} strokeWidth={2} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}
      {success && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm"
          style={{
            background: 'rgba(58,190,249,0.13)',
            color: NAVY,
            border: `1px solid ${HAIRLINE_CYAN}`,
          }}
        >
          <CheckCircle2 size={15} strokeWidth={2} style={{ color: CYAN }} />
          Elección creada. Redirigiendo…
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard eyebrow="Paso 01" title="Información general">
          <div className="space-y-5">
            <FieldGroup label="Título" hint="requerido">
              <input
                className={inputCls}
                style={inputStyle}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Elección de Director General 2026"
                required
                disabled={loading || success}
                {...focusHandlers}
              />
            </FieldGroup>

            <FieldGroup label="Descripción" hint="opcional">
              <textarea
                className={inputCls}
                style={{ ...inputStyle, resize: 'none', minHeight: '88px' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente el propósito de esta elección."
                rows={3}
                disabled={loading || success}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = BLUE
                  e.currentTarget.style.boxShadow =
                    '0 0 0 3px rgba(53,114,239,0.12)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = HAIRLINE_CYAN
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </FieldGroup>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldGroup label="Inicio" hint="requerido">
                <input
                  type="datetime-local"
                  className={inputCls}
                  style={inputStyle}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  disabled={loading || success}
                  {...focusHandlers}
                />
              </FieldGroup>
              <FieldGroup label="Cierre" hint="requerido">
                <input
                  type="datetime-local"
                  className={inputCls}
                  style={inputStyle}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  disabled={loading || success}
                  {...focusHandlers}
                />
              </FieldGroup>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          eyebrow="Paso 02"
          title="Grupos habilitados"
          subtitle="Cada grupo seleccionado recibirá un par de claves EC independiente."
          delay={0.05}
        >
          <div className="flex flex-wrap gap-3">
            {ROLES.map((r) => {
              const checked = allowedRoles.includes(r.value)
              return (
                <label
                  key={r.value}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-full cursor-pointer text-sm font-medium transition-all select-none"
                  style={{
                    background: checked ? BLUE_SOFT : WHITE,
                    border: `1px solid ${checked ? BLUE : HAIRLINE_CYAN}`,
                    color: checked ? NAVY : MUTE,
                  }}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleRole(r.value)}
                    disabled={loading || success}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: checked ? BLUE : MUTE }}
                  />
                  {r.label}
                </label>
              )
            })}
          </div>
          {allowedRoles.length > 0 && (
            <p
              className="text-xs mt-4 font-mono"
              style={{ color: MUTE }}
            >
              Peso por grupo: {(100 / allowedRoles.length).toFixed(1)}%
            </p>
          )}
        </SectionCard>

        <SectionCard
          eyebrow="Paso 03"
          title="Candidatos"
          subtitle="Mínimo 2 candidatos requeridos."
          delay={0.1}
        >
          <div className="flex justify-end -mt-4 mb-4">
            <button
              type="button"
              onClick={addCandidate}
              disabled={loading || success}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-all"
              style={{
                background: WHITE,
                color: NAVY,
                border: `1px solid ${HAIRLINE_CYAN}`,
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = BLUE
                e.currentTarget.style.color = BLUE
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = HAIRLINE_CYAN
                e.currentTarget.style.color = NAVY
              }}
            >
              <Plus size={12} strokeWidth={2.5} />
              Agregar candidato
            </button>
          </div>

          <div className="space-y-3">
            {candidates.map((c, i) => (
              <div
                key={i}
                className="flex gap-3 items-start p-4 rounded-xl"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(167,230,255,0.13) 0%, rgba(58,190,249,0.07) 100%)',
                  border: `1px solid ${HAIRLINE_CYAN}`,
                }}
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5"
                  style={{ background: NAVY, color: ICE }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    className={inputCls}
                    style={inputStyle}
                    placeholder="Nombre completo *"
                    value={c.name}
                    onChange={(e) => updateCandidate(i, 'name', e.target.value)}
                    disabled={loading || success}
                    {...focusHandlers}
                  />
                  <input
                    className={inputCls}
                    style={inputStyle}
                    placeholder="Descripción (opcional)"
                    value={c.description}
                    onChange={(e) =>
                      updateCandidate(i, 'description', e.target.value)
                    }
                    disabled={loading || success}
                    {...focusHandlers}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCandidate(i)}
                  disabled={candidates.length <= 2 || loading || success}
                  className="p-2 rounded-md transition-colors shrink-0 mt-1"
                  style={{
                    color: candidates.length <= 2 ? MUTE : NAVY,
                    background: 'transparent',
                    border: 'none',
                    cursor: candidates.length <= 2 ? 'not-allowed' : 'pointer',
                    opacity: candidates.length <= 2 ? 0.4 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (candidates.length > 2)
                      e.currentTarget.style.color = '#c00'
                  }}
                  onMouseLeave={(e) => {
                    if (candidates.length > 2)
                      e.currentTarget.style.color = NAVY
                  }}
                  aria-label="Eliminar candidato"
                >
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Submit */}
        <div className="flex items-center gap-3 pb-4">
          <button
            type="submit"
            disabled={loading || success || formIncomplete}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all"
            style={{
              background: NAVY,
              color: WHITE,
              border: 'none',
              cursor:
                loading || success || formIncomplete
                  ? 'not-allowed'
                  : 'pointer',
              opacity: loading || success || formIncomplete ? 0.6 : 1,
              boxShadow: '0 10px 30px -10px rgba(5,12,156,0.5)',
            }}
            onMouseEnter={(e) => {
              if (!(loading || success || formIncomplete)) {
                e.currentTarget.style.background = BLUE
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = NAVY
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {loading ? 'Creando…' : 'Crear elección'}
            <ArrowRight
              size={16}
              strokeWidth={2}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
          <Link
            to="/admin/elections"
            className="px-6 py-3 rounded-full text-sm font-medium transition-colors"
            style={{
              background: WHITE,
              color: NAVY,
              border: `1px solid ${HAIRLINE_CYAN}`,
              textDecoration: 'none',
            }}
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  )
}
