import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  totalElements: number
  size: number
  onPage: (page: number) => void
}

export function Pagination({ page, totalPages, totalElements, size, onPage }: PaginationProps) {
  if (totalPages <= 1) return null

  const from = page * size + 1
  const to   = Math.min((page + 1) * size, totalElements)

  return (
    <div className="flex items-center justify-between gap-4 px-1">
      <span className="text-xs" style={{ color: 'var(--text-ash)' }}>
        {from}–{to} de {totalElements}
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPage(page - 1)}
          disabled={page === 0}
          aria-label="Página anterior"
          className="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--hairline)',
            color: page === 0 ? 'var(--text-ash)' : 'var(--text-body)',
            cursor: page === 0 ? 'not-allowed' : 'pointer',
            opacity: page === 0 ? 0.5 : 1,
          }}
        >
          <ChevronLeft size={13} strokeWidth={2} />
        </button>

        <span className="text-xs px-2" style={{ color: 'var(--text-mute)' }}>
          {page + 1} / {totalPages}
        </span>

        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={page >= totalPages - 1}
          aria-label="Página siguiente"
          className="inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors"
          style={{
            background: 'var(--surface-elevated)',
            border: '1px solid var(--hairline)',
            color: page >= totalPages - 1 ? 'var(--text-ash)' : 'var(--text-body)',
            cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer',
            opacity: page >= totalPages - 1 ? 0.5 : 1,
          }}
        >
          <ChevronRight size={13} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
