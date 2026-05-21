import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, UserPlus, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'
import { userService } from '../../../services/user.service'
import {
  NAVY,
  BLUE,
  CYAN,
  WHITE,
  BODY,
  MUTE,
  HAIRLINE_CYAN,
  BLUE_SOFT,
  ERROR_BG,
  ERROR_FG,
} from '../theme'

const ROLES = [
  { value: 'STUDENT',   label: 'Estudiante (STUDENT)' },
  { value: 'PROFESSOR', label: 'Profesor (PROFESSOR)' },
  { value: 'PAAE',      label: 'PAAE' },
] as const

type Role = 'STUDENT' | 'PROFESSOR' | 'PAAE'

const fieldStyle = {
  width: '100%',
  padding: '0.625rem 0.875rem',
  borderRadius: '0.5rem',
  border: `1px solid ${HAIRLINE_CYAN}`,
  background: 'rgba(167,230,255,0.07)',
  color: NAVY,
  fontSize: '0.875rem',
  outline: 'none',
}

export function CreateUserPage() {
  const navigate = useNavigate()

  const [institutionalId, setInstitutionalId] = useState('')
  const [email, setEmail]                     = useState('')
  const [name, setName]                       = useState('')
  const [role, setRole]                       = useState<Role>('STUDENT')
  const [password, setPassword]               = useState('')
  const [admin, setAdmin]                     = useState(false)
  const [loading, setLoading]                 = useState(false)
  const [errorMsg, setErrorMsg]               = useState<string | null>(null)
  const [success, setSuccess]                 = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)
    try {
      await userService.create({ institutionalId, email, name, role, password, admin })
      setSuccess(true)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al crear usuario')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-8 rounded-2xl text-center space-y-4"
          style={{ background: WHITE, border: `1px solid ${HAIRLINE_CYAN}` }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto"
            style={{ background: BLUE_SOFT }}
          >
            <CheckCircle2 size={28} style={{ color: BLUE }} strokeWidth={2} />
          </div>
          <h2 className="text-lg font-semibold" style={{ color: NAVY }}>
            Usuario creado
          </h2>
          <p className="text-sm" style={{ color: MUTE }}>
            <strong style={{ color: NAVY }}>{name}</strong> fue registrado correctamente.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setInstitutionalId(''); setEmail(''); setName('')
                setRole('STUDENT'); setPassword(''); setAdmin(false)
                setSuccess(false)
              }}
              className="px-5 py-2.5 rounded-full text-sm font-medium"
              style={{ background: BLUE_SOFT, color: BLUE, border: 'none', cursor: 'pointer' }}
            >
              Registrar otro
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="px-5 py-2.5 rounded-full text-sm font-medium"
              style={{ background: NAVY, color: WHITE, border: 'none', cursor: 'pointer' }}
            >
              Ver usuarios
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-lg space-y-8">
      {/* Header */}
      <div>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-1 text-xs font-semibold mb-5"
          style={{ color: BLUE, textDecoration: 'none' }}
        >
          <ChevronLeft size={13} strokeWidth={2.5} />
          Volver a usuarios
        </Link>
        <span
          className="inline-flex items-center gap-1.5 mb-3 text-xs font-semibold uppercase"
          style={{ color: BLUE, letterSpacing: '0.18em' }}
        >
          <UserPlus size={12} strokeWidth={2.5} />
          Registro individual
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
          Nuevo usuario
        </h1>
        <p className="text-sm mt-2" style={{ color: BODY, lineHeight: 1.6 }}>
          Registra un solo usuario manualmente. Para cargas masivas usa la importación CSV.
        </p>
      </div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        onSubmit={handleSubmit}
        className="p-6 rounded-2xl space-y-5"
        style={{ background: WHITE, border: `1px solid ${HAIRLINE_CYAN}` }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase" style={{ color: MUTE, letterSpacing: '0.1em' }}>
              Boleta / No. empleado
            </span>
            <input
              required
              value={institutionalId}
              onChange={(e) => setInstitutionalId(e.target.value)}
              placeholder="B220234"
              style={fieldStyle}
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase" style={{ color: MUTE, letterSpacing: '0.1em' }}>
              Correo institucional
            </span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@escom.ipn.mx"
              style={fieldStyle}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase" style={{ color: MUTE, letterSpacing: '0.1em' }}>
            Nombre completo
          </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Juan Pérez García"
            style={fieldStyle}
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase" style={{ color: MUTE, letterSpacing: '0.1em' }}>
              Rol
            </span>
            <select
              required
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              style={{ ...fieldStyle, cursor: 'pointer' }}
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold uppercase" style={{ color: MUTE, letterSpacing: '0.1em' }}>
              Contraseña temporal
            </span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={fieldStyle}
            />
          </label>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={admin}
            onChange={(e) => setAdmin(e.target.checked)}
            className="w-4 h-4 rounded accent-blue-600"
          />
          <span className="text-sm" style={{ color: BODY }}>
            Otorgar acceso al panel administrativo{' '}
            <code
              className="font-mono px-1.5 py-0.5 rounded text-xs"
              style={{ background: BLUE_SOFT, color: NAVY }}
            >
              SCOPE_ADMIN
            </code>
          </span>
        </label>

        {errorMsg && (
          <div
            className="flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm"
            style={{ background: ERROR_BG, color: ERROR_FG }}
          >
            <AlertCircle size={15} strokeWidth={2} className="shrink-0 mt-0.5" />
            {errorMsg}
          </div>
        )}

        <div className="pt-1">
          <button
            type="submit"
            disabled={loading}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all"
            style={{
              background: NAVY,
              color: WHITE,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.65 : 1,
              boxShadow: '0 10px 30px -10px rgba(5,12,156,0.5)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = BLUE
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = NAVY
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {loading ? 'Creando…' : 'Crear usuario'}
            <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.form>
    </div>
  )
}
