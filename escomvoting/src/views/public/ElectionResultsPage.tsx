import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck, Trophy, Vote, Users } from 'lucide-react'
import { electionService } from '../../services/election.service'
import type { ElectionResultDTO } from '../../model/response/ElectionResultDTO'

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

function formatPercent(value: number) {
  if (!Number.isFinite(value) || value < 0) return '0.0%'
  return value.toFixed(1) + '%'
}

export function ElectionResultsPage() {
  const { id } = useParams<{ id: string }>()

  const [results, setResults] = useState<ElectionResultDTO[]>([])
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

    // Fetch all results at once (elections typically have few candidates)
    electionService
      .listResults(id, 0, 200)
      .then((page) => {
        const sorted = [...page.content].sort(
          (a, b) => Number(b.weightedScore) - Number(a.weightedScore),
        )
        setResults(sorted)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'No se pudieron cargar los resultados')
      })
      .finally(() => setLoading(false))
  }, [id])

  const totalVotes = results.reduce((sum, r) => sum + r.voteCount, 0)
  const winner = results[0] ?? null

  return (
    <div
      style={{ maxWidth: '880px', margin: '0 auto', padding: '2.5rem 1rem' }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Resultados de la elección
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-mute)' }}>
            Ranking por puntaje ponderado. Cada grupo electoral tiene peso igual.
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

      {/* Summary cards */}
      {!loading && !error && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            className="col-span-1 sm:col-span-2 p-5 rounded-xl flex items-start gap-4"
            style={{ background: 'var(--accent-yellow-soft)', border: '1px solid var(--accent-yellow)' }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'var(--accent-yellow)', color: '#fff' }}
            >
              <Trophy size={18} strokeWidth={2.25} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--accent-yellow)' }}>
                Ganador
              </p>
              <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {winner.candidateName}
              </p>
              <p className="text-sm mt-0.5" style={{ color: 'var(--text-mute)' }}>
                {formatWeightedScore(winner.weightedScore)} pts
                {totalVotes > 0 && ` · ${formatPercent((winner.voteCount / totalVotes) * 100)} del total`}
              </p>
            </div>
          </div>

          <div
            className="p-5 rounded-xl flex items-start gap-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'var(--accent-blue-soft)', color: 'var(--accent-blue)' }}
            >
              <Users size={18} strokeWidth={2} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--text-ash)' }}>
                Total votos
              </p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {totalVotes}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results table */}
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
      >
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(6)].map((_, i) => <SkeletonRow key={i} />)}
          </div>
        ) : results.length > 0 ? (
          <>
            <div
              className="grid gap-3 px-5 py-3 text-xs uppercase tracking-wide"
              style={{
                gridTemplateColumns: '56px 1fr 90px 160px 100px',
                color: 'var(--text-ash)',
                borderBottom: '1px solid var(--hairline)',
              }}
            >
              <span>#</span>
              <span>Candidato</span>
              <span>Votos</span>
              <span>Porcentaje</span>
              <span>Puntaje</span>
            </div>

            <div>
              {results.map((result, idx) => {
                const rank = idx + 1
                const isWinner = rank === 1
                const pct = totalVotes > 0 ? (result.voteCount / totalVotes) * 100 : 0

                return (
                  <div
                    key={result.candidateId}
                    style={{
                      borderBottom: idx < results.length - 1 ? '1px solid var(--hairline)' : 'none',
                      background: isWinner ? 'var(--accent-yellow-soft)' : 'transparent',
                    }}
                  >
                    <div
                      className="grid gap-3 px-5 py-3.5 items-center"
                      style={{ gridTemplateColumns: '56px 1fr 90px 160px 100px' }}
                    >
                      <span
                        className="inline-flex items-center gap-1.5 text-sm font-medium"
                        style={{ color: isWinner ? 'var(--accent-yellow)' : 'var(--text-mute)' }}
                      >
                        {isWinner && <Trophy size={13} strokeWidth={2.25} />}
                        #{rank}
                      </span>

                      <span
                        className="text-sm font-medium truncate"
                        style={{ color: 'var(--text-primary)' }}
                        title={result.candidateName}
                      >
                        {result.candidateName}
                      </span>

                      <span
                        className="inline-flex items-center gap-1.5 text-sm"
                        style={{ color: 'var(--text-body)' }}
                      >
                        <Vote size={13} strokeWidth={2} />
                        {result.voteCount}
                      </span>

                      <div className="flex items-center gap-2">
                        <div
                          className="flex-1 h-1.5 rounded-full overflow-hidden"
                          style={{ background: 'var(--surface-elevated)' }}
                        >
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${pct}%`,
                              background: isWinner ? 'var(--accent-yellow)' : 'var(--accent-blue)',
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-medium shrink-0"
                          style={{ color: 'var(--text-mute)', minWidth: '38px' }}
                        >
                          {formatPercent(pct)}
                        </span>
                      </div>

                      <span className="text-sm font-semibold" style={{ color: 'var(--accent-blue)' }}>
                        {formatWeightedScore(result.weightedScore)}
                      </span>
                    </div>
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
    </div>
  )
}
