import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Trash2, ChevronLeft, AlertCircle, CheckCircle2 } from 'lucide-react'
import { electionService } from '../../../services/election.service'
import type { CandidateInput } from '../../../model/request/CreateElectionRequest'

// ── Field wrapper ──────────────────────────────────────────────────────────

function FieldGroup({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
        {label}
        {hint && <span className="ml-1.5 text-xs font-normal" style={{ color: 'var(--text-ash)' }}>{hint}</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 text-sm rounded-lg outline-none transition-all'
const inputStyle: React.CSSProperties = {
  background: 'var(--surface-elevated)',
  border: '1px solid var(--hairline)',
  color: 'var(--text-primary)',
}
const focusHandlers = {
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = 'var(--accent-blue)'),
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    (e.currentTarget.style.borderColor = 'var(--hairline)'),
}

// ── NewElectionPage ────────────────────────────────────────────────────────

const ROLES = [
  { value: 'STUDENT',   label: 'Estudiantes' },
  { value: 'PROFESSOR', label: 'Profesores' },
  { value: 'PAAE',      label: 'PAAE' },
]

export function NewElectionPage() {
  const navigate = useNavigate()

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [allowedRoles, setAllowedRoles] = useState<string[]>(['STUDENT', 'PROFESSOR', 'PAAE'])
  const [candidates, setCandidates] = useState<CandidateInput[]>([
    { name: '', description: '' },
    { name: '', description: '' },
  ])

  // Submission state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function toggleRole(role: string) {
    setAllowedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    )
  }

  function updateCandidate(index: number, field: keyof CandidateInput, value: string) {
    setCandidates((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)))
  }

  function addCandidate() {
    setCandidates((prev) => [...prev, { name: '', description: '' }])
  }

  function removeCandidate(index: number) {
    if (candidates.length <= 2) return
    setCandidates((prev) => prev.filter((_, i) => i !== index))
  }

  // Convert datetime-local value ("2025-06-01T09:00") to ISO instant
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

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/admin/elections"
          className="inline-flex items-center gap-1 text-xs font-medium mb-4"
          style={{ color: 'var(--text-mute)', textDecoration: 'none' }}
        >
          <ChevronLeft size={13} strokeWidth={2} />
          Volver a elecciones
        </Link>
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Nueva elección
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-mute)' }}>
          Completa todos los campos. Se generarán pares de claves EC por grupo automáticamente.
        </p>
      </div>

      {/* Feedback */}
      {error && (
        <div
          className="flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm"
          style={{ background: 'var(--accent-red-soft)', color: 'var(--accent-red)' }}
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
          style={{ background: 'var(--accent-green-soft)', color: 'var(--accent-green)' }}
        >
          <CheckCircle2 size={15} strokeWidth={2} />
          Elección creada. Redirigiendo…
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 rounded-xl space-y-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
        >
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Información general
          </h2>

          <FieldGroup label="Título" hint="requerido">
            <input
              className={inputCls}
              style={inputStyle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Elección de Director General 2025"
              required
              disabled={loading || success}
              {...focusHandlers}
            />
          </FieldGroup>

          <FieldGroup label="Descripción" hint="opcional">
            <textarea
              className={inputCls}
              style={{ ...inputStyle, resize: 'none', minHeight: '80px' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe brevemente el propósito de esta elección."
              rows={3}
              disabled={loading || success}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-blue)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--hairline)')}
            />
          </FieldGroup>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldGroup label="Fecha y hora de inicio" hint="requerido">
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
            <FieldGroup label="Fecha y hora de cierre" hint="requerido">
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
        </motion.div>

        {/* Allowed roles */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="p-6 rounded-xl space-y-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
        >
          <div>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Grupos habilitados para votar
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-mute)' }}>
              Cada grupo seleccionado recibirá un par de claves EC independiente.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {ROLES.map((r) => {
              const checked = allowedRoles.includes(r.value)
              return (
                <label
                  key={r.value}
                  className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg cursor-pointer text-sm font-medium transition-all select-none"
                  style={{
                    background: checked ? 'var(--accent-blue-soft)' : 'var(--surface-elevated)',
                    border: `1px solid ${checked ? 'color-mix(in srgb, var(--accent-blue) 35%, transparent)' : 'var(--hairline)'}`,
                    color: checked ? 'var(--accent-blue)' : 'var(--text-mute)',
                  }}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleRole(r.value)}
                    disabled={loading || success}
                  />
                  {r.label}
                </label>
              )
            })}
          </div>
          {allowedRoles.length > 0 && (
            <p className="text-xs" style={{ color: 'var(--text-ash)' }}>
              Peso por grupo: {(100 / allowedRoles.length).toFixed(1)}%
            </p>
          )}
        </motion.div>

        {/* Candidates */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-6 rounded-xl space-y-4"
          style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Candidatos
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-mute)' }}>
                Mínimo 2 candidatos requeridos.
              </p>
            </div>
            <button
              type="button"
              onClick={addCandidate}
              disabled={loading || success}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
              style={{
                background: 'var(--surface-elevated)',
                color: 'var(--text-body)',
                border: '1px solid var(--hairline)',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--hairline-strong)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--hairline)')}
            >
              <Plus size={12} strokeWidth={2.5} />
              Agregar
            </button>
          </div>

          <div className="space-y-3">
            {candidates.map((c, i) => (
              <div
                key={i}
                className="flex gap-3 items-start p-4 rounded-lg"
                style={{ background: 'var(--surface-elevated)', border: '1px solid var(--hairline)' }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5"
                  style={{ background: 'var(--surface-card)', color: 'var(--text-mute)' }}
                >
                  {i + 1}
                </span>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    className={inputCls}
                    style={{ ...inputStyle, background: 'var(--surface)' }}
                    placeholder="Nombre completo *"
                    value={c.name}
                    onChange={(e) => updateCandidate(i, 'name', e.target.value)}
                    disabled={loading || success}
                    {...focusHandlers}
                  />
                  <input
                    className={inputCls}
                    style={{ ...inputStyle, background: 'var(--surface)' }}
                    placeholder="Descripción (opcional)"
                    value={c.description}
                    onChange={(e) => updateCandidate(i, 'description', e.target.value)}
                    disabled={loading || success}
                    {...focusHandlers}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCandidate(i)}
                  disabled={candidates.length <= 2 || loading || success}
                  className="p-1.5 rounded-md transition-colors shrink-0"
                  style={{
                    color: candidates.length <= 2 ? 'var(--text-ash)' : 'var(--text-mute)',
                    background: 'transparent',
                    border: 'none',
                    cursor: candidates.length <= 2 ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (candidates.length > 2)
                      e.currentTarget.style.color = 'var(--accent-red)'
                  }}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-mute)')}
                  aria-label="Eliminar candidato"
                >
                  <Trash2 size={14} strokeWidth={2} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Submit */}
        <div className="flex items-center gap-3 pb-4">
          <button
            type="submit"
            disabled={loading || success || !title || !startDate || !endDate}
            className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: 'var(--cta-bg)',
              color: 'var(--cta-fg)',
              border: 'none',
              cursor: loading || success || !title || !startDate || !endDate ? 'not-allowed' : 'pointer',
              opacity: loading || success || !title || !startDate || !endDate ? 0.6 : 1,
            }}
          >
            {loading ? 'Creando…' : 'Crear elección'}
          </button>
          <Link
            to="/admin/elections"
            className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
            style={{
              background: 'var(--surface-elevated)',
              color: 'var(--text-body)',
              border: '1px solid var(--hairline)',
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
