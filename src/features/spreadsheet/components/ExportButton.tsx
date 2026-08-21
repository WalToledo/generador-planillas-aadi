import { Download } from 'lucide-react'
import { exportSongsToExcel } from '../lib/exportSongsToExcel'
import type { SongRow } from '../lib/exportSongsToExcel'

export interface ExportButtonProps {
  songs: SongRow[]
}

/** Descarga la planilla `canciones.xlsx`. Sin canciones cargadas no hay nada que exportar. */
export function ExportButton({ songs }: ExportButtonProps) {
  const hasSongs = songs.length > 0

  return (
    <div className="mt-4">
      {/* El tooltip vive en el wrapper: un button deshabilitado no dispara eventos de mouse. */}
      <div className="group relative inline-block">
        <button
          type="button"
          onClick={() => exportSongsToExcel(songs)}
          disabled={!hasSongs}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600 dark:focus-visible:ring-offset-slate-800"
        >
          <Download className="size-4" />
          Descargar planilla
        </button>

        {!hasSongs && (
          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-700"
          >
            Agregá al menos una canción para exportar
          </span>
        )}
      </div>
    </div>
  )
}
