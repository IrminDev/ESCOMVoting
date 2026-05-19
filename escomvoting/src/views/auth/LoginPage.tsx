import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { ApiError } from '../../model/ApiError'

const NAVY = '#050C9C'
const BLUE = '#3572EF'
const CYAN = '#3ABEF9'
const ICE = '#A7E6FF'
const WHITE = '#ffffff'
const BODY = '#3a4a6b'
const MUTE = '#6b7a99'
const HAIRLINE_CYAN = 'rgba(58,190,249,0.27)'
const HAIRLINE_ICE = 'rgba(167,230,255,0.33)'
const ICE_SOFT = 'rgba(167,230,255,0.33)'
const OVERLAY_ICE = 'rgba(167,230,255,0.07)'
const HERO_GRADIENT =
  'linear-gradient(135deg, #050C9C 0%, #0a1ab3 45%, #3572EF 100%)'

function Field({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  disabled,
  right,
}: {
  id: string
  label: string
  type: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoComplete?: string
  disabled?: boolean
  right?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase"
        style={{ color: BLUE, letterSpacing: '0.1em' }}
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required
          className="w-full px-4 py-3 text-sm rounded-lg outline-none transition-all"
          style={{
            background: WHITE,
            border: `1px solid ${HAIRLINE_CYAN}`,
            color: NAVY,
            paddingRight: right ? '2.75rem' : undefined,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = BLUE
            e.currentTarget.style.boxShadow = `0 0 0 3px rgba(53,114,239,0.12)`
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = HAIRLINE_CYAN
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
        {right && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>
        )}
      </div>
    </div>
  )
}

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      const session = JSON.parse(sessionStorage.getItem('ev-session') ?? '{}') as {
        role?: string
      }
      navigate(session.role === 'PAAE' ? '/admin' : '/elections', { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.status === 401
            ? 'Correo o contraseña incorrectos.'
            : err.message,
        )
      } else {
        setError('No se pudo conectar al servidor. Intenta más tarde.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: HERO_GRADIENT }}
    >
      {/* Ambient drifting orbs */}
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          left: '-10%',
          width: '40rem',
          height: '40rem',
          background:
            'radial-gradient(circle, rgba(58,190,249,0.4) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute pointer-events-none"
        style={{
          bottom: '-15%',
          right: '-10%',
          width: '36rem',
          height: '36rem',
          background:
            'radial-gradient(circle, rgba(167,230,255,0.33) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Dotted grid mask */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(167,230,255,0.18) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 40%, black 0%, transparent 80%)',
        }}
      />

      {/* Top bar */}
      <header
        className="relative h-16 flex items-center justify-between px-6 shrink-0 z-10"
        style={{ borderBottom: `1px solid ${HAIRLINE_ICE}` }}
      >
        <Link
          to="/"
          className="flex items-center gap-2"
          style={{ textDecoration: 'none' }}
        >
          <Shield size={20} style={{ color: ICE }} strokeWidth={2} />
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: WHITE }}
          >
            ESCOMVoting
          </span>
        </Link>
      </header>

      {/* Card */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Eyebrow badge */}
          <div className="flex justify-center mb-8">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
              style={{
                background: OVERLAY_ICE,
                color: ICE,
                border: `1px solid ${HAIRLINE_ICE}`,
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
              }}
            >
              <Sparkles size={14} strokeWidth={2} />
              Acceso institucional
            </span>
          </div>

          {/* Card body */}
          <div
            className="rounded-2xl p-8 md:p-10"
            style={{
              background: WHITE,
              border: `1px solid ${HAIRLINE_CYAN}`,
              boxShadow: '0 20px 60px -20px rgba(5,12,156,0.35)',
            }}
          >
            <div className="mb-8">
              <h1
                className="font-semibold tracking-tight mb-2"
                style={{
                  color: NAVY,
                  fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                }}
              >
                Iniciar sesión
              </h1>
              <p
                style={{
                  color: BODY,
                  fontSize: '0.95rem',
                  lineHeight: 1.6,
                }}
              >
                Ingresa con tu correo institucional ESCOM / IPN para acceder al
                sistema.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 px-4 py-3 rounded-lg mb-5 text-sm"
                style={{
                  background: '#fee',
                  color: '#c00',
                  border: '1px solid rgba(204,0,0,0.2)',
                }}
              >
                <AlertCircle size={15} strokeWidth={2} className="shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Field
                id="email"
                label="Correo institucional"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="usuario@escom.ipn.mx"
                autoComplete="email"
                disabled={loading}
              />

              <Field
                id="password"
                label="Contraseña"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={loading}
                right={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    style={{
                      color: MUTE,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 4,
                      display: 'flex',
                    }}
                    tabIndex={-1}
                    aria-label={
                      showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={16} strokeWidth={2} />
                    ) : (
                      <Eye size={16} strokeWidth={2} />
                    )}
                  </button>
                }
              />

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="group w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-sm font-medium transition-all mt-2"
                style={{
                  background: NAVY,
                  color: WHITE,
                  border: 'none',
                  cursor:
                    loading || !email || !password ? 'not-allowed' : 'pointer',
                  opacity: loading || !email || !password ? 0.6 : 1,
                  boxShadow: '0 10px 30px -10px rgba(5,12,156,0.6)',
                }}
                onMouseEnter={(e) => {
                  if (!loading && email && password) {
                    e.currentTarget.style.background = BLUE
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = NAVY
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {loading ? 'Verificando…' : 'Iniciar sesión'}
                <ArrowRight
                  size={16}
                  strokeWidth={2}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            {/* Trust row */}
            <div
              className="flex flex-wrap gap-x-5 gap-y-2 mt-7 pt-6"
              style={{ borderTop: `1px solid ${HAIRLINE_CYAN}` }}
            >
              {['Cifrado extremo a extremo', 'Voto anónimo', 'Verificable'].map(
                (t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 text-xs"
                    style={{ color: MUTE }}
                  >
                    <CheckCircle2 size={13} strokeWidth={2} style={{ color: CYAN }} />
                    {t}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Footer note */}
          <p
            className="text-center text-xs mt-6 leading-relaxed"
            style={{ color: ICE_SOFT.replace('0.33', '0.85') }}
          >
            Tus credenciales se verifican contra el directorio institucional.
            <br />
            Los votos son anónimos e indescifrables para el servidor.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
