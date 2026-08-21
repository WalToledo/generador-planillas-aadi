import { Pencil, Trash2 } from 'lucide-react'
import type { Song } from '../types/song'

const headClasses =
  'px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400'

const cellClasses = 'px-3 py-2 text-sm text-slate-700 dark:text-slate-200'

const actionClasses =
  'rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white'

/**
 * La fecha se guarda como `YYYY-MM-DD` (input type="date"). Se parte el string en
 * vez de usar `new Date()`, que lo interpreta como UTC y corre un día según la zona.
 */
function formatFecha(fecha: string) {
  const [year, month, day] = fecha.split('-')
  if (!year || !month || !day) return fecha
  return `${day}/${month}/${year}`
}

export interface SongTableProps {
  songs: Song[]
  editingId: string | null
  onEdit: (song: Song) => void
  onDelete: (id: string) => void
}

export function SongTable({ songs, editingId, onEdit, onDelete }: SongTableProps) {
  if (songs.length === 0) {
    return (
      <p className="mt-4 rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400">
        Todavía no hay canciones cargadas.
      </p>
    )
  }

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            <th scope="col" className={headClasses}>
              Nombre
            </th>
            <th scope="col" className={headClasses}>
              Intérprete
            </th>
            <th scope="col" className={headClasses}>
              Fecha
            </th>
            <th scope="col" className={`${headClasses} text-right`}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song) => (
            <tr
              key={song.id}
              className={`border-b border-slate-100 transition-colors dark:border-slate-700/60 ${
                song.id === editingId ? 'bg-indigo-50 dark:bg-indigo-950/40' : ''
              }`}
            >
              <td className={`${cellClasses} font-medium`}>{song.nombre}</td>
              <td className={cellClasses}>{song.interprete}</td>
              <td className={`${cellClasses} whitespace-nowrap`}>{formatFecha(song.fecha)}</td>
              <td className={cellClasses}>
                {/* Los botones son sólo icono: el nombre va en aria-label para que se distingan entre filas. */}
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(song)}
                    aria-label={`Editar «${song.nombre}»`}
                    title={`Editar «${song.nombre}»`}
                    className={actionClasses}
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(song.id)}
                    aria-label={`Eliminar «${song.nombre}»`}
                    title={`Eliminar «${song.nombre}»`}
                    className={`${actionClasses} hover:text-red-600 dark:hover:text-red-400`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
