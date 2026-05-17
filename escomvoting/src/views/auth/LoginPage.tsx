import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Sun, Moon, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { ApiError } from '../../model/ApiError'

// ── Reusable input style helper ────────────────────────────────────────────

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
        className="text-xs font-medium"
        style={{ color: 'var(--text-mute)' }}
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
          className="w-full px-3 py-2.5 text-sm rounded-lg outline-none transition-all"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--hairline)',
            color: 'var(--text-primary)',
            paddingRight: right ? '2.5rem' : undefined,
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-blue)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--hairline)')}
        />
        {right && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>
        )}
      </div>
    </div>
  )
}

// ── LoginPage ──────────────────────────────────────────────────────────────

export function LoginPage() {
  const { login } = useAuth()
  const { isDark, toggle } = useTheme()
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
      // Redirect based on role — AuthContext already saved the session
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
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--canvas)' }}
    >
      {/* Minimal top bar */}
      <header
        className="h-14 flex items-center justify-between px-6 shrink-0"
        style={{ borderBottom: '1px solid var(--hairline)' }}
      >
        <Link
          to="/"
          className="flex items-center gap-2"
          style={{ textDecoration: 'none' }}
        >
          <Shield size={18} style={{ color: 'var(--accent-red)' }} strokeWidth={2} />
          <span
            className="text-sm font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            ESCOMVoting
          </span>
        </Link>
        <button
          onClick={toggle}
          aria-label={isDark ? 'Modo claro' : 'Modo oscuro'}
          className="p-2 rounded-md transition-colors"
          style={{ color: 'var(--text-mute)', background: 'transparent', border: 'none', cursor: 'pointer' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--text-primary)'
            e.currentTarget.style.background = 'var(--surface-elevated)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-mute)'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          {isDark ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
        </button>
      </header>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, var(--hairline-strong) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.5,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 0%, var(--accent-red-soft), transparent)',
          }}
        />
      </div>

      {/* Card */}
      <div className="relative flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-sm"
        >
          {/* Badge */}
          <div className="flex justify-center mb-8">
            <span
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'var(--surface)',
                color: 'var(--text-mute)',
                border: '1px solid var(--hairline)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--accent-red)' }}
              />
              Acceso institucional · ESCOM / IPN
            </span>
          </div>

          {/* Card body */}
          <div
            className="rounded-xl p-8"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--hairline)',
            }}
          >
            {/* Header */}
            <div className="mb-7">
              <h1
                className="text-xl font-semibold tracking-tight mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                Iniciar sesión
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-mute)' }}>
                Ingresa con tu correo institucional para acceder al sistema.
              </p>
            </div>

            {/* Error alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 px-4 py-3 rounded-lg mb-5 text-sm"
                style={{
                  background: 'var(--accent-red-soft)',
                  color: 'var(--accent-red)',
                  border: '1px solid color-mix(in srgb, var(--accent-red) 20%, transparent)',
                }}
              >
                <AlertCircle size={15} strokeWidth={2} className="shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
                      color: 'var(--text-ash)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? (
                      <EyeOff size={14} strokeWidth={2} />
                    ) : (
                      <Eye size={14} strokeWidth={2} />
                    )}
                  </button>
                }
              />

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 mt-2"
                style={{
                  background: 'var(--cta-bg)',
                  color: 'var(--cta-fg)',
                  border: 'none',
                  cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
                  opacity: loading || !email || !password ? 0.6 : 1,
                }}
              >
                {loading ? 'Verificando…' : 'Iniciar sesión →'}
              </button>
            </form>
          </div>

          {/* Footer note */}
          <p
            className="text-center text-xs mt-6 leading-relaxed"
            style={{ color: 'var(--text-ash)' }}
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
