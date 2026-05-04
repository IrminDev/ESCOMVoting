import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ChevronRight, ShieldCheck } from 'lucide-react'
import { electionService } from '../../../services/election.service'
import type { ElectionDTO } from '../../../model/response/ElectionDTO'
import type { PageResponse } from '../../../model/response/PageResponse'

const PREVIEW_SIZE = 3

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function StatusBadge({ status }: { status: ElectionDTO['status'] }) {
  const isTallied = status === 'TALLIED'
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
      style={{
        background: isTallied ? 'var(--accent-blue-soft)' : 'var(--accent-yellow-soft)',
        color: isTallied ? 'var(--accent-blue)' : 'var(--accent-yellow)',
      }}
    >
      {isTallied ? 'Resultados' : 'Cerrada'}
    </span>
  )
}

export function ClosedElectionsSection() {
  const [data, setData] = useState<PageResponse<ElectionDTO> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    electionService
      .listPublicFinished(0, PREVIEW_SIZE)
      .then(setData)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error al cargar elecciones cerradas')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="closed-elections" style={{ padding: '96px 0', background: 'var(--canvas)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: 600,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              margin: '0 0 8px',
            }}
          >
            Elecciones cerradas
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-mute)', margin: 0 }}>
            Consulta elecciones finalizadas y accede a sus urnas verificables.
          </p>
        </div>

        {error && (
          <p
            className="text-sm px-4 py-3 rounded-lg"
            style={{ background: 'var(--accent-red-soft)', color: 'var(--accent-red)' }}
          >
            {error}
          </p>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl h-36 animate-pulse"
                style={{ background: 'var(--surface-elevated)' }}
              />
            ))}
          </div>
        ) : data && data.content.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.content.map((election, index) => (
                <motion.article
                  key={election.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.25, delay: Math.min(index * 0.05, 0.25) }}
                  className="rounded-xl p-5 space-y-4"
                  style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3
                        className="text-base font-semibold leading-snug truncate"
                        style={{ color: 'var(--text-primary)', margin: 0 }}
                        title={election.title}
                      >
                        {election.title}
                      </h3>
                      {election.description && (
                        <p
                          className="text-sm mt-1 line-clamp-2"
                          style={{ color: 'var(--text-mute)', marginBottom: 0 }}
                        >
                          {election.description}
                        </p>
                      )}
                    </div>
                    <StatusBadge status={election.status} />
                  </div>

                  <div className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-ash)' }}>
                    <Calendar size={12} strokeWidth={2} />
                    Cerró el {formatDate(election.endDate)}
                  </div>

                  <div className="pt-1 flex flex-wrap gap-2">
                    <Link
                      to={`/elections/${election.id}/urn`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                      style={{
                        background: 'var(--accent-green-soft)',
                        color: 'var(--accent-green)',
                        border: '1px solid var(--accent-green)',
                        textDecoration: 'none',
                      }}
                    >
                      <ShieldCheck size={12} strokeWidth={2.25} />
                      Ver urna
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="flex justify-center">
              <Link
                to="/past-elections"
                className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                style={{
                  background: 'var(--surface-elevated)',
                  color: 'var(--text-body)',
                  border: '1px solid var(--hairline)',
                  textDecoration: 'none',
                }}
              >
                Ver más
                <ChevronRight size={14} strokeWidth={2.3} />
              </Link>
            </div>
          </>
        ) : (
          <div
            className="rounded-xl p-10 text-center"
            style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
          >
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Aún no hay elecciones cerradas.
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-ash)' }}>
              Cuando finalicen elecciones, podrás revisar sus urnas aquí.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
