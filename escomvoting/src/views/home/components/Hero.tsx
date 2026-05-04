import { motion } from 'framer-motion'
import { CommandPaletteCard } from './CommandPaletteCard'

const words = ['Elecciones', 'digitales.', 'Votos', 'invisibles.']

export function Hero() {
  return (
    <section
      style={{
        minHeight: 'calc(100vh - 56px)',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background layers */}
      {/* Dot grid */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, var(--hairline-strong) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none',
        }}
      />
      {/* Hero stripe */}
      <div className="hero-stripe" aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
      {/* Radial vignette */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 70% at 50% 0%, var(--accent-red-soft), transparent)',
          pointerEvents: 'none',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 w-full py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0 }}
              className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--hairline-strong)',
                color: 'var(--text-mute)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--accent-red)' }}
              />
              secp256k1 · Firmas ciegas de Schnorr
            </motion.div>

            {/* Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              {words.map((word, i) => (
                <motion.span
                  key={word + i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
                  style={{ display: 'inline-block', marginRight: '0.25em' }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="text-lg"
              style={{
                color: 'var(--text-body)',
                lineHeight: 1.7,
                maxWidth: '32rem',
                margin: 0,
              }}
            >
              El servidor firma tu voto sin conocer su contenido. Ningún JOIN puede vincular tu boleta con tu identidad — ni siquiera el administrador.
            </motion.p>

            {/* CTA row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="flex flex-wrap items-center gap-3"
            >
              <a
                href="#access"
                className="inline-flex items-center text-sm font-medium px-5 py-2.5 rounded-lg transition-colors duration-150"
                style={{
                  background: 'var(--cta-bg)',
                  color: 'var(--cta-fg)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'var(--cta-bg-hover)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'var(--cta-bg)'
                }}
              >
                Iniciar sesión →
              </a>
              <a
                href="#protocol"
                className="inline-flex items-center text-sm font-medium px-5 py-2.5 rounded-lg transition-colors duration-150"
                style={{
                  background: 'transparent',
                  color: 'var(--text-body)',
                  border: '1px solid var(--hairline-strong)',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'var(--surface-elevated)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'
                }}
              >
                Cómo funciona
              </a>
            </motion.div>

            {/* Trust row */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.75 }}
              className="text-xs"
              style={{ color: 'var(--text-mute)', margin: 0 }}
            >
              Basado en el protocolo de Bitcoin · ESCOM / IPN
            </motion.p>
          </div>

          {/* Right column */}
          <div className="flex justify-center lg:justify-end lg:pl-8">
            <CommandPaletteCard />
          </div>
        </div>
      </div>
    </section>
  )
}
