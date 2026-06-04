import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ArrowRight,
  Sparkles,
  UserPlus,
} from 'lucide-react'
import { userService } from '../../../services/user.service'
import {
  NAVY,
  BLUE,
  CYAN,
  ICE,
  WHITE,
  BODY,
  MUTE,
  HAIRLINE_CYAN,
  BLUE_SOFT,
} from '../theme'

const CSV_COLUMNS = 'institutionalId,email,name,role,password,isAdmin'
const CSV_EXAMPLE =
  'B220234,juan.perez@escom.ipn.mx,Juan Pérez García,STUDENT,,false\n' +
  'P10051,maria.gomez@escom.ipn.mx,María Gómez López,PROFESSOR,,false\n' +
  'A00231,coord.paae@escom.ipn.mx,Ana López Ruiz,PAAE,MiClaveFija1,true'

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
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1 text-xs font-semibold"
            style={{ color: BLUE, textDecoration: 'none' }}
          >
            <ChevronLeft size={13} strokeWidth={2.5} />
            Volver a usuarios
          </Link>
          <Link
            to="/admin/users/new"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all"
            style={{
              background: BLUE_SOFT,
              color: BLUE,
              border: `1px solid rgba(53,114,239,0.25)`,
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(53,114,239,0.22)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = BLUE_SOFT }}
          >
            <UserPlus size={12} strokeWidth={2.5} />
            Registro individual
          </Link>
        </div>
        <span
          className="inline-flex items-center gap-1.5 mb-3 text-xs font-semibold uppercase"
          style={{ color: BLUE, letterSpacing: '0.18em' }}
        >
          <Sparkles size={12} strokeWidth={2.5} />
          Carga masiva
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
          Importar usuarios
        </h1>
        <p
          className="text-sm mt-2"
          style={{ color: BODY, lineHeight: 1.6 }}
        >
          Carga el padrón electoral desde un archivo CSV. Los registros duplicados
          se omiten automáticamente.
        </p>
      </div>

      {/* CSV format reference */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-6 rounded-2xl space-y-3"
        style={{ background: WHITE, border: `1px solid ${HAIRLINE_CYAN}` }}
      >
        <h2
          className="text-xs font-semibold uppercase"
          style={{ color: BLUE, letterSpacing: '0.18em' }}
        >
          Formato del archivo
        </h2>
        <p className="text-sm" style={{ color: BODY }}>
          El archivo debe incluir una fila de encabezado y las siguientes columnas
          en orden:
        </p>
        <div
          className="px-4 py-3 rounded-lg font-mono text-xs overflow-x-auto"
          style={{
            background:
              'linear-gradient(135deg, rgba(167,230,255,0.13) 0%, rgba(58,190,249,0.07) 100%)',
            color: NAVY,
            border: `1px solid ${HAIRLINE_CYAN}`,
          }}
        >
          <p style={{ color: MUTE }}># encabezado</p>
          <p style={{ color: NAVY, fontWeight: 600 }}>{CSV_COLUMNS}</p>
          <p className="mt-1" style={{ color: MUTE }}>
            # ejemplos
          </p>
          {CSV_EXAMPLE.split('\n').map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <p className="text-xs" style={{ color: MUTE }}>
          Roles válidos:{' '}
          <code
            className="font-mono px-1.5 py-0.5 rounded"
            style={{ background: BLUE_SOFT, color: NAVY }}
          >
            STUDENT
          </code>{' '}
          <code
            className="font-mono px-1.5 py-0.5 rounded ml-1"
            style={{ background: BLUE_SOFT, color: NAVY }}
          >
            PROFESSOR
          </code>{' '}
          <code
            className="font-mono px-1.5 py-0.5 rounded ml-1"
            style={{ background: BLUE_SOFT, color: NAVY }}
          >
            PAAE
          </code>
        </p>
        <div
          className="flex items-start gap-2 text-xs p-3 rounded-lg"
          style={{
            background: 'rgba(58,190,249,0.10)',
            border: `1px solid ${HAIRLINE_CYAN}`,
            color: BODY,
          }}
        >
          <span
            className="font-mono px-1.5 py-0.5 rounded shrink-0"
            style={{ background: NAVY, color: ICE }}
          >
            password
          </span>
          <span>
            Déjala <strong>vacía</strong> para que el sistema genere una contraseña temporal
            aleatoria. En cualquier caso se envía un correo de bienvenida a cada usuario con
            sus credenciales de acceso.
          </span>
        </div>
        <div
          className="flex items-start gap-2 text-xs p-3 rounded-lg"
          style={{
            background: 'rgba(58,190,249,0.10)',
            border: `1px solid ${HAIRLINE_CYAN}`,
            color: BODY,
          }}
        >
          <span
            className="font-mono px-1.5 py-0.5 rounded shrink-0"
            style={{ background: NAVY, color: ICE }}
          >
            isAdmin
          </span>
          <span>
            Marca{' '}
            <code className="font-mono" style={{ color: NAVY, fontWeight: 600 }}>
              true
            </code>{' '}
            para otorgar acceso al panel administrativo (scope{' '}
            <code className="font-mono" style={{ color: NAVY, fontWeight: 600 }}>
              SCOPE_ADMIN
            </code>
            ) independientemente del rol. Acepta{' '}
            <code className="font-mono">true/false</code>,{' '}
            <code className="font-mono">1/0</code>,{' '}
            <code className="font-mono">sí/no</code>. Vacío = no admin.
          </span>
        </div>
      </motion.div>

      {/* Drop zone */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08 }}
      >
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => !file && inputRef.current?.click()}
          className="relative flex flex-col items-center justify-center rounded-2xl p-12 text-center transition-all cursor-pointer"
          style={{
            background: dragging
              ? BLUE_SOFT
              : 'linear-gradient(135deg, rgba(167,230,255,0.13) 0%, rgba(58,190,249,0.07) 100%)',
            border: `2px dashed ${dragging ? BLUE : HAIRLINE_CYAN}`,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleFile(f)
            }}
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
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center"
                  style={{ background: NAVY }}
                >
                  <FileText size={26} style={{ color: ICE }} strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: NAVY }}>
                    {file.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: MUTE }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    reset()
                  }}
                  className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                  style={{
                    color: NAVY,
                    background: WHITE,
                    border: `1px solid ${HAIRLINE_CYAN}`,
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
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center transition-transform"
                  style={{
                    background: dragging ? BLUE : NAVY,
                    transform: dragging ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  <Upload
                    size={24}
                    strokeWidth={1.8}
                    style={{ color: ICE }}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: NAVY }}>
                    Arrastra el archivo aquí
                  </p>
                  <p className="text-xs mt-1" style={{ color: MUTE }}>
                    o haz clic para seleccionar · solo{' '}
                    <code
                      className="font-mono px-1.5 py-0.5 rounded"
                      style={{ background: WHITE, color: NAVY }}
                    >
                      .csv
                    </code>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Feedback */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2.5 px-4 py-3 rounded-lg text-sm"
            style={{ background: '#fee', color: '#c00' }}
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
            style={{
              background: 'rgba(58,190,249,0.13)',
              color: NAVY,
              border: `1px solid ${HAIRLINE_CYAN}`,
            }}
          >
            <CheckCircle2 size={15} strokeWidth={2} style={{ color: CYAN }} />
            {importedCount === 0
              ? 'Sin cambios: todos los registros ya existían.'
              : `${importedCount} usuario${importedCount !== 1 ? 's' : ''} importado${importedCount !== 1 ? 's' : ''} correctamente.`}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || state === 'loading' || state === 'success'}
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all"
          style={{
            background: NAVY,
            color: WHITE,
            border: 'none',
            cursor:
              !file || state === 'loading' || state === 'success'
                ? 'not-allowed'
                : 'pointer',
            opacity:
              !file || state === 'loading' || state === 'success' ? 0.6 : 1,
            boxShadow: '0 10px 30px -10px rgba(5,12,156,0.5)',
          }}
          onMouseEnter={(e) => {
            if (file && state !== 'loading' && state !== 'success') {
              e.currentTarget.style.background = BLUE
              e.currentTarget.style.transform = 'translateY(-1px)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = NAVY
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          {state === 'loading' ? 'Importando…' : 'Importar usuarios'}
          <ArrowRight
            size={16}
            strokeWidth={2}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
        {state === 'success' && (
          <Link
            to="/admin/users"
            className="px-6 py-3 rounded-full text-sm font-medium"
            style={{
              background: WHITE,
              color: NAVY,
              border: `1px solid ${HAIRLINE_CYAN}`,
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
