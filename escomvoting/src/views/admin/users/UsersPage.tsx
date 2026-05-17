import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Upload } from 'lucide-react'
import { userService } from '../../../services/user.service'
import { Pagination } from '../../../components/shared/Pagination'
import type { UserDTO } from '../../../model/response/UserDTO'
import type { PageResponse } from '../../../model/response/PageResponse'

// ── Role badge ─────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  STUDENT:   { label: 'Estudiante',    color: 'var(--accent-blue)',   bg: 'var(--accent-blue-soft)' },
  PROFESSOR: { label: 'Profesor',      color: 'var(--accent-green)',  bg: 'var(--accent-green-soft)' },
  PAAE:      { label: 'PAAE',          color: 'var(--accent-yellow)', bg: 'var(--accent-yellow-soft)' },
}

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_CONFIG[role] ?? { label: role, color: 'var(--text-mute)', bg: 'var(--surface-card)' }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded animate-pulse ${className ?? ''}`}
      style={{ background: 'var(--surface-elevated)' }}
    />
  )
}

// ── UsersPage ──────────────────────────────────────────────────────────────

export function UsersPage() {
  const [data, setData] = useState<PageResponse<UserDTO> | null>(null)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  useEffect(() => {
    setLoading(true)
    userService
      .listAll(page, 25)
      .then(setData)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : 'Error al cargar usuarios'),
      )
      .finally(() => setLoading(false))
  }, [page])

  const users = data?.content ?? []
  const filtered = users.filter((u) => {
    const q = query.toLowerCase()
    return (
      !q ||
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.institutionalId.toLowerCase().includes(q)
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Usuarios
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-mute)' }}>
            {loading ? 'Cargando…' : `${data?.totalElements ?? 0} usuarios registrados`}
          </p>
        </div>
        <Link
          to="/admin/users/import"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: 'var(--cta-bg)', color: 'var(--cta-fg)', textDecoration: 'none' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cta-bg-hover)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--cta-bg)')}
        >
          <Upload size={14} strokeWidth={2.5} />
          Importar CSV
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={14}
          strokeWidth={2}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--text-ash)' }}
        />
        <input
          type="search"
          placeholder="Buscar por nombre, correo o ID…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-2 text-sm rounded-lg outline-none transition-all"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--hairline)',
            color: 'var(--text-primary)',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--accent-blue)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--hairline)')}
        />
      </div>

      {/* Error */}
      {error && (
        <p
          className="text-sm px-4 py-3 rounded-lg"
          style={{ background: 'var(--accent-red-soft)', color: 'var(--accent-red)' }}
        >
          {error}
        </p>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
      >
        {loading ? (
          <div className="p-5 space-y-3">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-12 text-center text-sm" style={{ color: 'var(--text-ash)' }}>
            {query ? 'Sin resultados para esa búsqueda.' : 'No hay usuarios todavía. Importa un CSV para comenzar.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
                  {['ID Institucional', 'Nombre', 'Correo', 'Rol', 'Estado'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3.5 text-xs font-medium uppercase tracking-wide whitespace-nowrap"
                      style={{ color: 'var(--text-ash)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr
                    key={u.id}
                    style={
                      i < filtered.length - 1
                        ? { borderBottom: '1px solid var(--hairline)' }
                        : {}
                    }
                  >
                    <td className="px-5 py-3.5">
                      <span
                        className="font-mono text-xs"
                        style={{ color: 'var(--text-mute)' }}
                      >
                        {u.institutionalId}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="font-medium"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {u.name}
                      </span>
                    </td>
                    <td
                      className="px-5 py-3.5 text-xs"
                      style={{ color: 'var(--text-mute)' }}
                    >
                      {u.email}
                    </td>
                    <td className="px-5 py-3.5">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium"
                        style={{
                          background: u.active ? 'var(--accent-green-soft)' : 'var(--surface-card)',
                          color: u.active ? 'var(--accent-green)' : 'var(--text-ash)',
                        }}
                      >
                        {u.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {data && (
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
