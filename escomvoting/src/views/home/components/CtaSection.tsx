import { motion } from 'framer-motion'

export function CtaSection() {
  return (
    <section
      id="access"
      style={{ padding: '96px 0', background: 'var(--canvas)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          style={{
            fontSize: '1.75rem',
            fontWeight: 600,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            maxWidth: '36rem',
            margin: 0,
          }}
        >
          Participa en las elecciones de tu comunidad
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.1, ease: 'easeOut' }}
          className="text-base"
          style={{ color: 'var(--text-mute)', maxWidth: '32rem', margin: 0 }}
        >
          Inicia sesión con tu correo institucional. Si eres administrador, gestiona elecciones desde el panel de control.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: 0.2, ease: 'easeOut' }}
        >
          <a
            href="#access"
            className="inline-flex items-center text-sm font-medium px-6 py-3 rounded-lg transition-colors duration-150"
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
            Comenzar →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
