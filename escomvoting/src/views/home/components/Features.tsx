import { motion } from 'framer-motion'
import { Lock, Scale, Key } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../../lib/utils'

interface FeatureCardProps {
  icon: LucideIcon
  iconBg: string
  iconColor: string
  title: string
  body: string
  badgeText: string
  badgeBg: string
  badgeFg: string
  index: number
}

function FeatureCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  body,
  badgeText,
  badgeBg,
  badgeFg,
  index,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.1, ease: 'easeOut' }}
      className={cn('flex flex-col gap-4 p-6 rounded-xl transition-colors duration-200')}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: '10px',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--hairline-strong)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--hairline)'
      }}
    >
      {/* Icon */}
      <div
        className="flex items-center justify-center w-9 h-9 rounded-full shrink-0"
        style={{ background: iconBg, color: iconColor }}
      >
        <Icon size={18} strokeWidth={2} />
      </div>

      {/* Text */}
      <div className="flex flex-col gap-2 flex-1">
        <h3
          className="text-sm font-semibold"
          style={{ color: 'var(--text-primary)', margin: 0 }}
        >
          {title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--text-body)', margin: 0 }}
        >
          {body}
        </p>
      </div>

      {/* Footer badge */}
      <div>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-sm"
          style={{ background: badgeBg, color: badgeFg }}
        >
          {badgeText}
        </span>
      </div>
    </motion.div>
  )
}

const cards: Omit<FeatureCardProps, 'index'>[] = [
  {
    icon: Lock,
    iconBg: 'var(--accent-blue-soft)',
    iconColor: 'var(--accent-blue)',
    title: 'Anonimato real',
    body: 'El servidor firma tu desafío cegado sin ver el candidato. Ningún JOIN puede vincular ballots con issuances.',
    badgeText: 'secp256k1',
    badgeBg: 'var(--accent-blue-soft)',
    badgeFg: 'var(--accent-blue)',
  },
  {
    icon: Scale,
    iconBg: 'var(--accent-red-soft)',
    iconColor: 'var(--accent-red)',
    title: 'Peso ponderado',
    body: 'Estudiantes, profesores y administrativos pesan 33.3% cada uno. Si un grupo no participa, su peso se redistribuye.',
    badgeText: '33.3% / grupo',
    badgeBg: 'var(--accent-red-soft)',
    badgeFg: 'var(--accent-red)',
  },
  {
    icon: Key,
    iconBg: 'var(--accent-green-soft)',
    iconColor: 'var(--accent-green)',
    title: 'Curva secp256k1',
    body: 'La misma curva de Bitcoin y Ethereum. Implementación con Bouncy Castle en backend y @noble/curves en frontend.',
    badgeText: '128-bit security',
    badgeBg: 'var(--accent-green-soft)',
    badgeFg: 'var(--accent-green)',
  },
]

export function Features() {
  return (
    <section
      id="features"
      style={{ padding: '96px 0', background: 'var(--canvas)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              margin: '0 0 12px',
            }}
          >
            Construido sobre criptografía real
          </h2>
          <p
            className="text-base"
            style={{ color: 'var(--text-mute)', margin: 0 }}
          >
            No ciframos el canal — garantizamos anonimato matemático.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <FeatureCard key={card.title} {...card} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
