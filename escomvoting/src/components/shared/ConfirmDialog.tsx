import { type ReactNode, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { NAVY, BLUE, WHITE, BODY, MUTE, HAIRLINE_CYAN, BLUE_SOFT } from '../../views/admin/theme'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: ReactNode
  icon?: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'primary' | 'danger'
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

const DANGER = '#c0392b'

export function ConfirmDialog({
  open,
  title,
  description,
  icon,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  tone = 'primary',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  // Close on Escape (ignored while the action is running).
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !loading) onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, loading, onCancel])

  const accent = tone === 'danger' ? DANGER : BLUE

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(8,15,40,0.45)', backdropFilter: 'blur(2px)' }}
          onMouseDown={() => { if (!loading) onCancel() }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md p-6 rounded-2xl"
            style={{ background: WHITE, border: `1px solid ${HAIRLINE_CYAN}`, boxShadow: '0 24px 60px -20px rgba(5,12,156,0.45)' }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              aria-label="Cerrar"
              className="absolute top-4 right-4 inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{ color: MUTE, background: 'transparent', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              <X size={16} strokeWidth={2} />
            </button>

            {icon && (
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: tone === 'danger' ? 'rgba(192,57,43,0.1)' : BLUE_SOFT, color: accent }}
              >
                {icon}
              </div>
            )}

            <h2 className="text-base font-semibold pr-8" style={{ color: NAVY }}>
              {title}
            </h2>
            <div className="text-sm mt-2" style={{ color: BODY, lineHeight: 1.6 }}>
              {description}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="px-5 py-2.5 rounded-full text-sm font-medium transition-colors"
                style={{
                  background: 'transparent',
                  color: MUTE,
                  border: `1px solid ${HAIRLINE_CYAN}`,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="px-5 py-2.5 rounded-full text-sm font-medium transition-all"
                style={{
                  background: accent,
                  color: WHITE,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Procesando…' : confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
