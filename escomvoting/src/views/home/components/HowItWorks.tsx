import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface CodeChipProps {
  children: string
}

function CodeChip({ children }: CodeChipProps) {
  return (
    <code
      className="font-mono text-xs px-1 rounded"
      style={{ background: 'var(--surface-card)', color: 'var(--text-body)' }}
    >
      {children}
    </code>
  )
}

interface StepProps {
  number: string
  accentBg: string
  accentFg: string
  label: string
  title: string
  body: React.ReactNode
  index: number
}

function Step({ number, accentBg, accentFg, label, title, body, index }: StepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.12, ease: 'easeOut' }}
      className="flex flex-col gap-3 p-6 rounded-xl"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--hairline)',
        borderRadius: '10px',
        flex: 1,
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="font-mono text-xs rounded-full px-2 py-0.5 font-medium"
          style={{ background: accentBg, color: accentFg }}
        >
          {number}
        </span>
        <span
          className="text-xs font-medium"
          style={{ color: accentFg }}
        >
          {label}
        </span>
      </div>
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
    </motion.div>
  )
}

export function HowItWorks() {
  return (
    <section
      id="protocol"
      style={{ padding: '96px 0', background: 'var(--surface)' }}
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
            El protocolo en 3 pasos
          </h2>
        </div>

        {/* Steps */}
        <div className="flex flex-col lg:flex-row items-stretch gap-4">
          {/* Step 1 */}
          <Step
            index={0}
            number="01"
            accentBg="var(--accent-blue-soft)"
            accentFg="var(--accent-blue)"
            label="Autenticación"
            title="Inicia sesión"
            body={
              <>
                El servidor verifica tu identidad, genera{' '}
                <CodeChip>r</CodeChip> y{' '}
                <CodeChip>R=r·G</CodeChip>. El punto{' '}
                <CodeChip>R</CodeChip> llega a tu navegador.
              </>
            }
          />

          {/* Arrow connector — desktop only */}
          <div className="hidden lg:flex items-center justify-center shrink-0 px-2">
            <ArrowRight size={20} style={{ color: 'var(--hairline-strong)' }} strokeWidth={2} />
          </div>

          {/* Step 2 */}
          <Step
            index={1}
            number="02"
            accentBg="var(--accent-red-soft)"
            accentFg="var(--accent-red)"
            label="Cegamiento"
            title="El navegador ciega"
            body={
              <>
                Elige <CodeChip>α,β ∈ secp256k1</CodeChip>, calcula{' '}
                <CodeChip>R&#x2019;=R+α·G+β·P</CodeChip>. El servidor firma sin ver el candidato.
              </>
            }
          />

          {/* Arrow connector — desktop only */}
          <div className="hidden lg:flex items-center justify-center shrink-0 px-2">
            <ArrowRight size={20} style={{ color: 'var(--hairline-strong)' }} strokeWidth={2} />
          </div>

          {/* Step 3 */}
          <Step
            index={2}
            number="03"
            accentBg="var(--accent-green-soft)"
            accentFg="var(--accent-green)"
            label="Voto anónimo"
            title="Boleta sin identidad"
            body={
              <>
                Envías <CodeChip>(R&#x2019;,s&#x2019;,e&#x2019;)</CodeChip> sin autenticación. El servidor verifica Schnorr y registra sin poder identificarte.
              </>
            }
          />
        </div>
      </div>
    </section>
  )
}
