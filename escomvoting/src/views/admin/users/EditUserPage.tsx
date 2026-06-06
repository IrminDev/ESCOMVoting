import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, Pencil, ArrowRight, AlertCircle, CheckCircle2, KeyRound, MailCheck } from 'lucide-react'
import { userService } from '../../../services/user.service'
import { ConfirmDialog } from '../../../components/shared/ConfirmDialog'
import {
  NAVY,
  BLUE,
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

export function EditUserPage() {
  const navigate = useNavigate()
  const { id = '' } = useParams()

  const [institutionalId, setInstitutionalId] = useState('')
  const [email, setEmail]                     = useState('')
  const [name, setName]                       = useState('')
  const [role, setRole]                       = useState<Role>('STUDENT')
  const [admin, setAdmin]                     = useState(false)
  const [active, setActive]                   = useState(true)

  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [resetting, setResetting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [savedMsg, setSavedMsg] = useState<string | null>(null)
  const [resetMsg, setResetMsg] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    userService
      .get(id)
      .then((u) => {
        setInstitutionalId(u.institutionalId)
        setEmail(u.email)
        setName(u.name)
        setRole(u.role)
        setAdmin(u.admin)
        setActive(u.active)
      })
      .catch((err: unknown) =>
        setErrorMsg(err instanceof Error ? err.message : 'Error al cargar el usuario'),
      )
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setErrorMsg(null)
    setSavedMsg(null)
    setResetMsg(null)
    try {
      await userService.update(id, { institutionalId, email, name, role, admin, active })
      setSavedMsg('Cambios guardados correctamente.')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al guardar los cambios')
    } finally {
      setSaving(false)
    }
  }

  async function handleResetCredentials() {
    setResetting(true)
    setErrorMsg(null)
    setSavedMsg(null)
    setResetMsg(null)
    try {
      await userService.resetCredentials(id)
      setResetMsg(`Se enviaron credenciales nuevas a ${email}. La contraseña anterior fue inhabilitada.`)
      setConfirmOpen(false)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al reenviar credenciales')
      setConfirmOpen(false)
    } finally {
      setResetting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-lg">
        <div
          className="rounded-2xl animate-pulse"
          style={{ background: 'rgba(167,230,255,0.33)', height: 420 }}
        />
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
          <Pencil size={12} strokeWidth={2.5} />
          Editar usuario
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
          {name || 'Usuario'}
        </h1>
        <p className="text-sm mt-2" style={{ color: BODY, lineHeight: 1.6 }}>
          Modifica los datos del usuario o reenvía un nuevo juego de credenciales.
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

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-4 h-4 rounded accent-blue-600"
          />
          <span className="text-sm" style={{ color: BODY }}>
            Cuenta activa
            <span className="block text-xs" style={{ color: MUTE }}>
              Al desactivarla, el usuario no podrá iniciar sesión y se cerrarán sus sesiones vigentes.
            </span>
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

        {savedMsg && (
          <div
            className="flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm"
            style={{ background: BLUE_SOFT, color: BLUE }}
          >
            <CheckCircle2 size={15} strokeWidth={2} className="shrink-0 mt-0.5" />
            {savedMsg}
          </div>
        )}

        <div className="pt-1">
          <button
            type="submit"
            disabled={saving}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all"
            style={{
              background: NAVY,
              color: WHITE,
              border: 'none',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.65 : 1,
              boxShadow: '0 10px 30px -10px rgba(5,12,156,0.5)',
            }}
            onMouseEnter={(e) => {
              if (!saving) {
                e.currentTarget.style.background = BLUE
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = NAVY
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {saving ? 'Guardando…' : 'Guardar cambios'}
            <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </motion.form>

      {/* Credentials section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="p-6 rounded-2xl space-y-4"
        style={{ background: WHITE, border: `1px solid ${HAIRLINE_CYAN}` }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: BLUE_SOFT }}
          >
            <KeyRound size={18} style={{ color: BLUE }} strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-sm font-semibold" style={{ color: NAVY }}>
              Reenviar credenciales
            </h2>
            <p className="text-xs mt-1" style={{ color: MUTE, lineHeight: 1.5 }}>
              Genera una contraseña temporal nueva, la envía por correo al usuario e
              inhabilita la anterior. Útil si el usuario olvidó o comprometió su contraseña.
            </p>
          </div>
        </div>

        {resetMsg && (
          <div
            className="flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm"
            style={{ background: BLUE_SOFT, color: BLUE }}
          >
            <MailCheck size={15} strokeWidth={2} className="shrink-0 mt-0.5" />
            {resetMsg}
          </div>
        )}

        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={resetting}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium"
          style={{
            background: BLUE_SOFT,
            color: BLUE,
            border: 'none',
            cursor: resetting ? 'not-allowed' : 'pointer',
            opacity: resetting ? 0.65 : 1,
          }}
        >
          <KeyRound size={15} strokeWidth={2} />
          {resetting ? 'Enviando…' : 'Generar y enviar nuevas credenciales'}
        </button>
      </motion.div>

      <ConfirmDialog
        open={confirmOpen}
        icon={<KeyRound size={20} strokeWidth={2} />}
        title="Reenviar credenciales"
        description={
          <>
            Se generará una contraseña temporal nueva para <strong style={{ color: NAVY }}>{name}</strong> y
            se enviará a <strong style={{ color: NAVY }}>{email}</strong>. La contraseña anterior quedará
            inhabilitada de inmediato.
          </>
        }
        confirmLabel="Generar y enviar"
        cancelLabel="Cancelar"
        loading={resetting}
        onConfirm={handleResetCredentials}
        onCancel={() => setConfirmOpen(false)}
      />

      <button
        type="button"
        onClick={() => navigate('/admin/users')}
        className="text-sm font-medium"
        style={{ color: MUTE, background: 'none', border: 'none', cursor: 'pointer' }}
      >
        ← Volver al listado
      </button>
    </div>
  )
}
