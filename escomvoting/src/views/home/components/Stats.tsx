import { motion } from 'framer-motion'

interface StatItemProps {
  value: string
  label: string
  mono?: boolean
  index: number
  isLast: boolean
}

function StatItem({ value, label, mono, index, isLast }: StatItemProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1, ease: 'easeOut' }}
        className="flex flex-col items-center gap-2 py-4"
      >
        <span
          className={mono ? 'font-mono' : ''}
          style={{
            fontSize: '2.25rem',
            fontWeight: 600,
            letterSpacing: '-0.04em',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
          }}
        >
          {value}
        </span>
        <span
          className="text-sm text-center"
          style={{ color: 'var(--text-mute)' }}
        >
          {label}
        </span>
      </motion.div>
      {!isLast && (
        <div
          className="hidden md:block w-px self-stretch"
          style={{ background: 'var(--hairline)' }}
        />
      )}
    </>
  )
}

const stats = [
  { value: '~3,000', label: 'Usuarios ESCOM', mono: false },
  { value: 'secp256k1', label: 'Curva elíptica · 128-bit', mono: true },
  { value: '3 grupos', label: 'Peso igual por grupo', mono: false },
]

export function Stats() {
  return (
    <section
      style={{
        borderTop: '1px solid var(--hairline)',
        borderBottom: '1px solid var(--hairline)',
        padding: '64px 0',
        background: 'var(--surface)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-0 items-center">
          {stats.map((stat, i) => (
            <StatItem
              key={stat.value}
              value={stat.value}
              label={stat.label}
              mono={stat.mono}
              index={i}
              isLast={i === stats.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
