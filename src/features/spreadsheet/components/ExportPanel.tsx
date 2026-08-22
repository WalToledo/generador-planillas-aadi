import { useState } from 'react'
import { Download } from 'lucide-react'
import { inputClasses, labelClasses } from '@/shared/ui'
import type { SongRow, UserProfileData } from '../lib/exportPlanillaAadi'

export interface ExportPanelProps {
  songs: SongRow[]
  /** Datos fijos del radiodifusor. El CUIT viaja adentro: se persiste como parte del perfil. */
  userProfile: UserProfileData
  onCuitChange: (cuit: string) => void
}

/** Metadatos de la declaración + descarga de la planilla. */
export function ExportPanel({ songs, userProfile, onCuitChange }: ExportPanelProps) {
  // No se persiste: cambia en cada declaración y debe reingresarse.
  const [mesAnio, setMesAnio] = useState('')
  // La generación es asíncrona por el import dinámico: sin esto el usuario no ve que arrancó.
  const [isExporting, setIsExporting] = useState(false)

  const cuit = userProfile.cuit
  const hasSongs = songs.length > 0
  const hasMetadata = cuit.trim() !== '' && mesAnio.trim() !== ''
  const canExport = hasSongs && hasMetadata && !isExporting

  const tooltip = !hasSongs
    ? 'Agregá al menos una canción para exportar'
    : 'Debe completar CUIT y Mes y Año'

  async function handleExport() {
    setIsExporting(true)
    try {
      // Import dinámico: ExcelJS pesa más que toda la app y sólo hace falta al descargar,
      // así que Vite lo emite en un chunk aparte en vez de cargarlo en el arranque.
      const { exportPlanillaAadi } = await import('../lib/exportPlanillaAadi')
      await exportPlanillaAadi({ songs, userProfile, mesAnio })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="mt-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="export-cuit" className={labelClasses}>
            CUIT
          </label>
          <input
            id="export-cuit"
            type="text"
            value={cuit}
            onChange={(event) => onCuitChange(event.target.value)}
            placeholder="Ingrese CUIT"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="export-mes-anio" className={labelClasses}>
            Mes y Año
          </label>
          <input
            id="export-mes-anio"
            type="text"
            value={mesAnio}
            onChange={(event) => setMesAnio(event.target.value)}
            placeholder="Ej: Marzo 2026"
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mt-4">
        {/* El tooltip vive en el wrapper: un button deshabilitado no dispara eventos de mouse. */}
        <div className="group relative inline-block">
          <button
            type="button"
            onClick={() => void handleExport()}
            disabled={!canExport}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600 dark:focus-visible:ring-offset-slate-800"
          >
            <Download className="size-4" />
            Descargar planilla
          </button>

          {!canExport && !isExporting && (
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-700"
            >
              {tooltip}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
