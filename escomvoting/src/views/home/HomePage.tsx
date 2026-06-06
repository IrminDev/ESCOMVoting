import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  ShieldCheck,
  Lock,
  Vote,
  Eye,
  Fingerprint,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  KeyRound,
  BarChart3,
  Users,
  ChevronRight,
  Calendar,
  Award,
} from 'lucide-react'
import { electionService } from '../../services/election.service'
import type { ElectionDTO } from '../../model/response/ElectionDTO'

const PALETTE = {
  navy: '#050C9C',
  blue: '#3572EF',
  cyan: '#3ABEF9',
  ice: '#A7E6FF',
} as const

const FEATURES = [
  {
    icon: Lock,
    title: 'Cifrado de extremo a extremo',
    body: 'Cada voto se cifra en el cliente con curvas elípticas antes de salir de tu dispositivo. Nadie, ni siquiera el servidor, conoce tu elección.',
  },
  {
    icon: Fingerprint,
    title: 'Identidad verificable',
    body: 'Autenticación institucional con tokens JWT firmados y validación criptográfica por rol antes de habilitar la boleta.',
  },
  {
    icon: Eye,
    title: 'Auditoría pública',
    body: 'Resultados publicados con totales ponderados, padrón total y porcentajes verificables tras el cierre de cada urna.',
  },
  {
    icon: ShieldCheck,
    title: 'Resistente a manipulación',
    body: 'Las boletas se firman con claves públicas por rol. Cualquier alteración invalida la urna y se detecta al instante.',
  },
] as const

const STEPS = [
  { icon: KeyRound, title: 'Autenticación', body: 'Ingresa con credenciales institucionales y se valida tu rol.' },
  { icon: Vote, title: 'Voto cifrado', body: 'Elige a tu candidato y el voto se cifra localmente antes de enviarse.' },
  { icon: BarChart3, title: 'Conteo ponderado', body: 'Al cierre, los votos se descifran y agregan con pesos por rol.' },
  { icon: Award, title: 'Resultados públicos', body: 'La elección publica ganador, padrón total y porcentajes auditables.' },
] as const

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })
}

function GridDots() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.35]" aria-hidden>
      <defs>
        <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.18)" />
        </pattern>
        <radialGradient id="fade" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="dotsMask"><rect width="100%" height="100%" fill="url(#fade)" /></mask>
      </defs>
      <rect width="100%" height="100%" fill="url(#dots)" mask="url(#dotsMask)" />
    </svg>
  )
}

function Orbs() {
  return (
    <>
      <motion.div
        aria-hidden
        className="absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${PALETTE.cyan}66 0%, transparent 70%)` }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute -bottom-40 -right-24 w-[600px] h-[600px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${PALETTE.blue}66 0%, transparent 70%)` }}
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden
        className="absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(circle, ${PALETTE.ice}55 0%, transparent 70%)` }}
        animate={{ x: [-20, 20, -20], y: [10, -10, 10] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
    </>
  )
}

function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 400], [0, 80])
  const opacity = useTransform(scrollY, [0, 300], [1, 0.4])

  return (
    <section
      className="relative overflow-hidden"
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${PALETTE.navy} 0%, #0a1ab3 45%, ${PALETTE.blue} 100%)`,
      }}
    >
      <Orbs />
      <GridDots />

      <motion.div
        style={{ y, opacity }}
        className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 flex flex-col items-center text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-md mb-8"
          style={{
            background: 'rgba(167, 230, 255, 0.12)',
            border: `1px solid ${PALETTE.ice}55`,
            color: PALETTE.ice,
          }}
        >
          <Sparkles size={14} />
          <span className="text-xs font-medium tracking-wide uppercase">ESCOM · Voto digital seguro</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-semibold tracking-tight"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
            lineHeight: 1.02,
            color: '#ffffff',
            letterSpacing: '-0.04em',
            maxWidth: '20ch',
          }}
        >
          Democracia{' '}
          <span
            style={{
              background: `linear-gradient(120deg, ${PALETTE.cyan} 0%, ${PALETTE.ice} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            criptográfica
          </span>{' '}
          para la comunidad ESCOM.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-7 max-w-2xl"
          style={{ color: PALETTE.ice, fontSize: '1.15rem', lineHeight: 1.6 }}
        >
          Una plataforma de voto electrónico extremo a extremo: tu boleta se cifra en tu propio
          dispositivo y se audita en público. Sin intermediarios, sin sorpresas.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            style={{ background: '#ffffff', color: PALETTE.navy }}
          >
            Emitir mi voto
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/past-elections"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium transition-all backdrop-blur-md"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: '#ffffff',
              border: `1px solid ${PALETTE.ice}44`,
            }}
          >
            Ver resultados públicos
            <ArrowUpRight size={18} />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm"
          style={{ color: `${PALETTE.ice}cc` }}
        >
          {[
            { icon: CheckCircle2, text: 'Cifrado por curva elíptica' },
            { icon: CheckCircle2, text: 'Padrón ponderado por rol' },
            { icon: CheckCircle2, text: 'Resultados auditables' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="inline-flex items-center gap-2">
              <Icon size={16} style={{ color: PALETTE.cyan }} />
              {text}
            </div>
          ))}
        </motion.div>
      </motion.div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: `linear-gradient(180deg, transparent 0%, ${PALETTE.navy}00 0%, #ffffff 100%)` }}
      />
    </section>
  )
}

function FeaturesGrid() {
  return (
    <section className="relative py-32 px-6" style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs font-semibold tracking-widest uppercase"
            style={{ color: PALETTE.blue }}
          >
            Por qué ESCOM Voting
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-3 font-semibold tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: PALETTE.navy, lineHeight: 1.05, letterSpacing: '-0.03em' }}
          >
            Seguridad sin compromisos, transparencia por diseño.
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative p-8 rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
              style={{
                background: `linear-gradient(135deg, ${PALETTE.ice}22 0%, ${PALETTE.cyan}11 100%)`,
                border: `1px solid ${PALETTE.cyan}33`,
              }}
            >
              <div
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 transition-transform group-hover:scale-110"
                style={{ background: PALETTE.navy, color: PALETTE.ice }}
              >
                <f.icon size={22} />
              </div>
              <h3 className="font-semibold text-xl mb-2" style={{ color: PALETTE.navy, letterSpacing: '-0.02em' }}>
                {f.title}
              </h3>
              <p style={{ color: '#3a4a6b', lineHeight: 1.65 }}>{f.body}</p>
              <div
                className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-40 transition-opacity group-hover:opacity-70"
                style={{ background: PALETTE.cyan }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: `linear-gradient(180deg, ${PALETTE.ice}33 0%, #ffffff 100%)` }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: PALETTE.blue }}>
            Cómo funciona
          </span>
          <h2
            className="mt-3 font-semibold tracking-tight"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)', color: PALETTE.navy, letterSpacing: '-0.03em' }}
          >
            Cuatro pasos. Cero confianza ciega.
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6 relative">
          <div
            className="hidden md:block absolute top-7 left-[12%] right-[12%] h-[2px]"
            style={{
              background: `linear-gradient(90deg, ${PALETTE.navy}, ${PALETTE.blue}, ${PALETTE.cyan}, ${PALETTE.ice})`,
            }}
          />
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative flex flex-col items-center text-center"
            >
              <div
                className="relative z-10 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${PALETTE.navy} 0%, ${PALETTE.blue} 100%)`,
                  color: '#ffffff',
                }}
              >
                <s.icon size={22} />
              </div>
              <div
                className="mt-4 text-xs font-mono font-semibold"
                style={{ color: PALETTE.blue, letterSpacing: '0.1em' }}
              >
                PASO 0{i + 1}
              </div>
              <h3 className="mt-2 font-semibold text-lg" style={{ color: PALETTE.navy }}>
                {s.title}
              </h3>
              <p className="mt-2 text-sm max-w-[18ch]" style={{ color: '#3a4a6b', lineHeight: 1.55 }}>
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatsBand() {
  const stats = [
    { value: '256', unit: 'bit', label: 'curva elíptica secp256k1' },
    { value: '100', unit: '%', label: 'votos cifrados en cliente' },
    { value: '0', unit: '', label: 'metadatos compartidos' },
    { value: '24/7', unit: '', label: 'resultados públicos' },
  ]

  return (
    <section
      className="relative py-24 px-6 overflow-hidden"
      style={{ background: PALETTE.navy }}
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 30%, ${PALETTE.blue}55 0%, transparent 50%), radial-gradient(circle at 80% 70%, ${PALETTE.cyan}44 0%, transparent 50%)`,
        }}
      />
      <div className="relative max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="text-center md:text-left"
          >
            <div
              className="font-semibold tracking-tight tabular-nums"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                color: '#ffffff',
                lineHeight: 1,
                letterSpacing: '-0.04em',
              }}
            >
              {s.value}
              <span style={{ color: PALETTE.cyan, fontSize: '0.5em', marginLeft: '0.15em' }}>{s.unit}</span>
            </div>
            <div className="mt-3 text-sm" style={{ color: PALETTE.ice }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function ClosedElections() {
  const [elections, setElections] = useState<ElectionDTO[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    electionService
      .listPublicFinished(0, 3)
      .then((page) => setElections(page.content))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Error'))
  }, [])

  const skeleton = useMemo(() => Array.from({ length: 3 }), [])

  return (
    <section className="py-32 px-6" style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: PALETTE.blue }}>
              Archivo público
            </span>
            <h2
              className="mt-3 font-semibold tracking-tight"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', color: PALETTE.navy, letterSpacing: '-0.03em' }}
            >
              Elecciones cerradas
            </h2>
          </div>
          <Link
            to="/past-elections"
            className="inline-flex items-center gap-1.5 font-medium text-sm hover:gap-2.5 transition-all"
            style={{ color: PALETTE.blue }}
          >
            Ver todas <ChevronRight size={16} />
          </Link>
        </div>

        {error && (
          <div className="p-4 rounded-xl text-sm" style={{ background: '#fee', color: '#c00' }}>
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-5">
          {(elections ?? skeleton).map((e, i) => {
            const isLoading = !elections
            return (
              <motion.div
                key={isLoading ? i : (e as ElectionDTO).id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                {isLoading ? (
                  <div
                    className="h-52 rounded-2xl animate-pulse"
                    style={{ background: `${PALETTE.ice}33`, border: `1px solid ${PALETTE.cyan}22` }}
                  />
                ) : (
                  <Link
                    to={`/elections/${(e as ElectionDTO).id}/results`}
                    className="group block p-7 rounded-2xl h-full transition-all hover:-translate-y-1 hover:shadow-xl"
                    style={{ background: '#ffffff', border: `1px solid ${PALETTE.cyan}44` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: (e as ElectionDTO).status === 'TALLIED' ? `${PALETTE.cyan}22` : `${PALETTE.ice}55`,
                          color: PALETTE.navy,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: (e as ElectionDTO).status === 'TALLIED' ? PALETTE.blue : PALETTE.cyan }}
                        />
                        {(e as ElectionDTO).status === 'TALLIED' ? 'Resultados' : 'Cerrada'}
                      </span>
                      <Users size={16} style={{ color: PALETTE.blue }} />
                    </div>
                    <h3
                      className="font-semibold text-lg mb-2 line-clamp-2"
                      style={{ color: PALETTE.navy, letterSpacing: '-0.02em' }}
                    >
                      {(e as ElectionDTO).title}
                    </h3>
                    <p className="text-sm line-clamp-2 mb-5" style={{ color: '#3a4a6b' }}>
                      {(e as ElectionDTO).description}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5" style={{ color: '#6b7a99' }}>
                        <Calendar size={13} />
                        {formatDate((e as ElectionDTO).endDate)}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 font-medium group-hover:gap-1.5 transition-all"
                        style={{ color: PALETTE.blue }}
                      >
                        Ver detalle <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </Link>
                )}
              </motion.div>
            )
          })}
        </div>

        {elections && elections.length === 0 && (
          <div className="text-center py-12" style={{ color: '#6b7a99' }}>
            Aún no hay elecciones cerradas.
          </div>
        )}
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="relative py-32 px-6 overflow-hidden" style={{ background: '#ffffff' }}>
      <div
        className="relative max-w-6xl mx-auto rounded-[2rem] overflow-hidden p-12 md:p-20"
        style={{
          background: `linear-gradient(135deg, ${PALETTE.navy} 0%, ${PALETTE.blue} 60%, ${PALETTE.cyan} 100%)`,
        }}
      >
        <motion.div
          aria-hidden
          className="absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full blur-3xl"
          style={{ background: PALETTE.ice, opacity: 0.35 }}
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <GridDots />

        <div className="relative text-center flex flex-col items-center">
          <Vote size={42} style={{ color: PALETTE.ice }} className="mb-6" />
          <h2
            className="font-semibold tracking-tight"
            style={{
              fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              maxWidth: '22ch',
            }}
          >
            Tu voto importa. Hazlo seguro.
          </h2>
          <p className="mt-5 max-w-xl" style={{ color: PALETTE.ice, fontSize: '1.05rem', lineHeight: 1.6 }}>
            Únete a la comunidad ESCOM y participa en las elecciones activas con la certeza de un sistema
            criptográficamente verificable.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              style={{ background: '#ffffff', color: PALETTE.navy }}
            >
              Acceder al sistema
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/past-elections"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-medium backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#ffffff', border: `1px solid ${PALETTE.ice}55` }}
            >
              Explorar resultados
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  return (
    <main style={{ background: '#ffffff' }}>
      <Hero />
      <FeaturesGrid />
      <Process />
      <StatsBand />
      <ClosedElections />
      <FinalCta />
    </main>
  )
}
