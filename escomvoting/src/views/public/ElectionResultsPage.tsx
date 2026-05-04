import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck, Trophy, Vote } from 'lucide-react'
import { electionService } from '../../services/election.service'
import { Pagination } from '../../components/shared/Pagination'
import type { ElectionResultDTO } from '../../model/response/ElectionResultDTO'
import type { PageResponse } from '../../model/response/PageResponse'

const PAGE_SIZE = 20

function SkeletonRow() {
  return (
    <div
      className="h-14 rounded-lg animate-pulse"
      style={{ background: 'var(--surface-elevated)' }}
    />
  )
}

function formatWeightedScore(score: number) {
  const value = Number(score)
  if (!Number.isFinite(value)) return '0.0000'
  return value.toFixed(4)
}

export function ElectionResultsPage() {
  const { id } = useParams<{ id: string }>()

  const [data, setData] = useState<PageResponse<ElectionResultDTO> | null>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError('Elección inválida')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    electionService
      .listResults(id, page, PAGE_SIZE)
      .then(setData)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los resultados')
      })
      .finally(() => setLoading(false))
  }, [id, page])

  return (
    <div
      style={{
        maxWidth: '880px',
        margin: '0 auto',
        padding: '2.5rem 1rem',
      }}
      className="space-y-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Resultados de la elección
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-mute)' }}>
            Ranking paginado por puntaje ponderado.
          </p>
        </div>

        {id && (
          <div className="flex items-center gap-2">
            <Link
              to="/past-elections"
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
              style={{
                background: 'var(--surface-elevated)',
                color: 'var(--text-mute)',
                border: '1px solid var(--hairline)',
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={12} strokeWidth={2} />
              Volver
            </Link>
            <Link
              to={`/elections/${id}/urn`}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
              style={{
                background: 'var(--accent-green-soft)',
                color: 'var(--accent-green)',
                border: '1px solid var(--accent-green)',
                textDecoration: 'none',
              }}
            >
              <ShieldCheck size={12} strokeWidth={2.2} />
              Ver urna
            </Link>
          </div>
        )}
      </div>

      {error && (
        <p
          className="text-sm px-4 py-3 rounded-lg"
          style={{ background: 'var(--accent-red-soft)', color: 'var(--accent-red)' }}
        >
          {error}
        </p>
      )}

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
      >
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(8)].map((_, idx) => (
              <SkeletonRow key={idx} />
            ))}
          </div>
        ) : data && data.content.length > 0 ? (
          <>
            <div className="grid grid-cols-[96px_1fr_140px_140px] gap-3 px-5 py-3 text-xs uppercase tracking-wide"
              style={{ color: 'var(--text-ash)', borderBottom: '1px solid var(--hairline)' }}
            >
              <span>Posición</span>
              <span>Candidato</span>
              <span>Votos</span>
              <span>Puntaje</span>
            </div>

            <div>
              {data.content.map((result, idx) => {
                const rank = page * data.size + idx + 1
                const isTop = rank === 1

                return (
                  <div
                    key={result.candidateId}
                    className="grid grid-cols-[96px_1fr_140px_140px] gap-3 px-5 py-3.5 items-center"
                    style={{ borderBottom: idx < data.content.length - 1 ? '1px solid var(--hairline)' : 'none' }}
                  >
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium"
                      style={{ color: isTop ? 'var(--accent-yellow)' : 'var(--text-mute)' }}
                    >
                      {isTop && <Trophy size={13} strokeWidth={2.25} />}
                      #{rank}
                    </span>
                    <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }} title={result.candidateName}>
                      {result.candidateName}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-body)' }}>
                      <Vote size={13} strokeWidth={2} />
                      {result.voteCount}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--accent-blue)' }}>
                      {formatWeightedScore(result.weightedScore)}
                    </span>
                  </div>
                )
              })}
            </div>
          </>
        ) : !error ? (
          <div className="p-10 text-center">
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              No hay resultados disponibles.
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-ash)' }}>
              Esta elección podría no estar en estado de resultados todavía.
            </p>
          </div>
        ) : null}
      </motion.section>

      {data && !loading && data.content.length > 0 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          size={data.size}
          onPage={setPage}
        />
      )}
    </div>
  )
}
