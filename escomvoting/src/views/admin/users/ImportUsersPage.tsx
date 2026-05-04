import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, CheckCircle2, AlertCircle, ChevronLeft } from 'lucide-react'
import { userService } from '../../../services/user.service'

// ── CSV format spec ────────────────────────────────────────────────────────

const CSV_COLUMNS = 'institutionalId,email,name,role,password'
const CSV_EXAMPLE =
  'B220234,juan.perez@escom.ipn.mx,Juan Pérez García,STUDENT,TempPass123\nP10051,maria.gomez@escom.ipn.mx,María Gómez López,PROFESSOR,TempPass456'

// ── ImportUsersPage ────────────────────────────────────────────────────────

type UploadState = 'idle' | 'loading' | 'success' | 'error'

export function ImportUsersPage() {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [state, setState] = useState<UploadState>('idle')
  const [importedCount, setImportedCount] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(f: File) {
    if (!f.name.endsWith('.csv')) {
      setErrorMsg('Solo se aceptan archivos .csv')
      return
    }
    setFile(f)
    setState('idle')
    setErrorMsg(null)
    setImportedCount(null)
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  async function handleUpload() {
    if (!file) return
    setState('loading')
    setErrorMsg(null)
    try {
      const res = await userService.importCsv(file)
      setImportedCount(res.imported)
      setState('success')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al importar')
      setState('error')
    }
  }

  function reset() {
    setFile(null)
    setState('idle')
    setErrorMsg(null)
    setImportedCount(null)
  }

  return (
    <div className="max-w-xl space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-1 text-xs font-medium mb-4"
          style={{ color: 'var(--text-mute)', textDecoration: 'none' }}
        >
          <ChevronLeft size={13} strokeWidth={2} />
          Volver a usuarios
        </Link>
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Importar usuarios
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-mute)' }}>
          Carga el padrón electoral desde un archivo CSV. Los registros duplicados se omiten automáticamente.
        </p>
      </div>

      {/* CSV format reference */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="p-5 rounded-xl space-y-3"
        style={{ background: 'var(--surface)', border: '1px solid var(--hairline)' }}
      >
        <h2 className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-ash)' }}>
          Formato del archivo
        </h2>
        <p className="text-xs" style={{ color: 'var(--text-mute)' }}>
          El archivo debe incluir una fila de encabezado y las siguientes columnas en orden:
        </p>
        <div
          className="px-4 py-3 rounded-lg font-mono text-xs overflow-x-auto"
          style={{ background: 'var(--surface-card)', color: 'var(--text-body)' }}
        >
          <p style={{ color: 'var(--text-ash)' }}># encabezado</p>
          <p>{CSV_COLUMNS}</p>
          <p className="mt-1" style={{ color: 'var(--text-ash)' }}># ejemplos</p>
          {CSV_EXAMPLE.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <p className="text-xs" style={{ color: 'var(--text-ash)' }}>
          Roles válidos: <code className="font-mono">STUDENT</code>, <code className="font-mono">PROFESSOR</code>, <code className="font-mono">ADMIN</code>
        </p>
      </motion.div>

      {/* Drop zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !file && inputRef.current?.click()}
          className="relative flex flex-col items-center justify-center rounded-xl p-10 text-center transition-all cursor-pointer"
          style={{
            background: dragging ? 'var(--accent-blue-soft)' : 'var(--surface)',
            border: `2px dashed ${dragging ? 'var(--accent-blue)' : 'var(--hairline-strong)'}`,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="sr-only"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />

          <AnimatePresence mode="wait">
            {file ? (
              <motion.div
                key="file"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-3"
              >
                <FileText size={32} style={{ color: 'var(--accent-blue)' }} strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {file.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-mute)' }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); reset() }}
                  className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
                  style={{
                    color: 'var(--text-mute)',
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--hairline)',
                    cursor: 'pointer',
                  }}
                >
                  <X size={11} strokeWidth={2.5} />
                  Cambiar archivo
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center gap-3"
              >
                <Upload
                  size={32}
                  strokeWidth={1.5}
                  style={{ color: dragging ? 'var(--accent-blue)' : 'var(--text-ash)' }}
                />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Arrastra el archivo aquí
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-mute)' }}>
                    o haz clic para seleccionar · solo <code className="font-mono">.csv</code>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Feedback messages */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm"
            style={{ background: 'var(--accent-red-soft)', color: 'var(--accent-red)' }}
          >
            <AlertCircle size={15} strokeWidth={2} className="shrink-0 mt-0.5" />
            {errorMsg}
          </motion.div>
        )}
        {state === 'success' && importedCount !== null && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 px-4 py-3 rounded-lg text-sm"
            style={{ background: 'var(--accent-green-soft)', color: 'var(--accent-green)' }}
          >
            <CheckCircle2 size={15} strokeWidth={2} />
            {importedCount === 0
              ? 'Sin cambios: todos los registros ya existían.'
              : `${importedCount} usuario${importedCount !== 1 ? 's' : ''} importado${importedCount !== 1 ? 's' : ''} correctamente.`}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || state === 'loading' || state === 'success'}
          className="px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          style={{
            background: 'var(--cta-bg)',
            color: 'var(--cta-fg)',
            border: 'none',
            cursor: !file || state === 'loading' || state === 'success' ? 'not-allowed' : 'pointer',
            opacity: !file || state === 'loading' || state === 'success' ? 0.6 : 1,
          }}
        >
          {state === 'loading' ? 'Importando…' : 'Importar usuarios'}
        </button>
        {state === 'success' && (
          <Link
            to="/admin/users"
            className="px-6 py-2.5 rounded-lg text-sm font-medium"
            style={{
              background: 'var(--surface-elevated)',
              color: 'var(--text-body)',
              border: '1px solid var(--hairline)',
              textDecoration: 'none',
            }}
          >
            Ver usuarios
          </Link>
        )}
      </div>
    </div>
  )
}
