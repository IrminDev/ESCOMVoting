import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Upload, ArrowRight, Sparkles } from 'lucide-react'
import { userService } from '../../../services/user.service'
import { Pagination } from '../../../components/shared/Pagination'
import type { UserDTO } from '../../../model/response/UserDTO'
import type { PageResponse } from '../../../model/response/PageResponse'
import {
  NAVY,
  BLUE,
  CYAN,
  WHITE,
  BODY,
  MUTE,
  HAIRLINE_CYAN,
  ROLE_PILL,
  ROLE_LABEL,
} from '../theme'

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_PILL[role] ?? { bg: 'rgba(107,122,153,0.13)', dot: MUTE }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: cfg.bg, color: NAVY }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: cfg.dot }}
      />
      {ROLE_LABEL[role] ?? role}
    </span>
  )
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-xl animate-pulse ${className ?? ''}`}
      style={{ background: 'rgba(167,230,255,0.33)' }}
    />
  )
}

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <span
            className="inline-flex items-center gap-1.5 mb-3 text-xs font-semibold uppercase"
            style={{ color: BLUE, letterSpacing: '0.18em' }}
          >
            <Sparkles size={12} strokeWidth={2.5} />
            Padrón electoral
          </span>
          <h1
            className="font-semibold tracking-tight"
            style={{
              color: NAVY,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
            }}
          >
            Usuarios
          </h1>
          <p className="text-sm mt-2" style={{ color: BODY, lineHeight: 1.6 }}>
            {loading
              ? 'Cargando…'
              : `${data?.totalElements ?? 0} usuarios registrados`}
          </p>
        </div>
        <Link
          to="/admin/users/import"
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all"
          style={{
            background: NAVY,
            color: WHITE,
            textDecoration: 'none',
            boxShadow: '0 10px 30px -10px rgba(5,12,156,0.5)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = BLUE
            e.currentTarget.style.transform = 'translateY(-1px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = NAVY
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <Upload size={16} strokeWidth={2.5} />
          Importar CSV
          <ArrowRight
            size={16}
            strokeWidth={2}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search
          size={15}
          strokeWidth={2}
          className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: MUTE }}
        />
        <input
          type="search"
          placeholder="Buscar por nombre, correo o ID…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 text-sm rounded-full outline-none transition-all"
          style={{
            background: WHITE,
            border: `1px solid ${HAIRLINE_CYAN}`,
            color: NAVY,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = BLUE
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(53,114,239,0.12)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = HAIRLINE_CYAN
            e.currentTarget.style.boxShadow = 'none'
          }}
        />
      </div>

      {error && (
        <p
          className="text-sm px-4 py-3 rounded-lg"
          style={{ background: '#fee', color: '#c00' }}
        >
          {error}
        </p>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl overflow-hidden"
        style={{ background: WHITE, border: `1px solid ${HAIRLINE_CYAN}` }}
      >
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-sm" style={{ color: MUTE }}>
            {query
              ? 'Sin resultados para esa búsqueda.'
              : 'Aún no hay usuarios. Importa un CSV para comenzar.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1px solid ${HAIRLINE_CYAN}` }}>
                  {['ID Institucional', 'Nombre', 'Correo', 'Rol', 'Estado'].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-4 text-xs font-semibold uppercase whitespace-nowrap"
                        style={{ color: MUTE, letterSpacing: '0.1em' }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr
                    key={u.id}
                    style={
                      i < filtered.length - 1
                        ? { borderBottom: `1px solid ${HAIRLINE_CYAN}` }
                        : {}
                    }
                  >
                    <td className="px-6 py-3.5">
                      <span
                        className="font-mono text-xs font-semibold"
                        style={{ color: BLUE }}
                      >
                        {u.institutionalId}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="font-semibold" style={{ color: NAVY }}>
                        {u.name}
                      </span>
                    </td>
                    <td
                      className="px-6 py-3.5 text-xs"
                      style={{ color: BODY }}
                    >
                      {u.email}
                    </td>
                    <td className="px-6 py-3.5">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: u.active
                            ? 'rgba(58,190,249,0.13)'
                            : 'rgba(107,122,153,0.13)',
                          color: NAVY,
                        }}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: u.active ? CYAN : MUTE }}
                        />
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
