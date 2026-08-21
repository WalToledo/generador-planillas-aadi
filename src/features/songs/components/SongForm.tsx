import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Song } from '../types/song'

const inputClasses =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500'

const labelClasses = 'mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'

export interface SongFormProps {
  onSubmit: (data: Omit<Song, 'id'>) => void
  /**
   * Canción en edición: precarga los campos y cambia el texto del botón.
   * Quien lo use debe pasar además `key={editingSong?.id ?? 'new'}` para que el
   * componente se remonte al cambiar de canción; así el reset no necesita un efecto.
   */
  editingSong?: Song | null
  /** Sale del modo edición sin aplicar cambios. Sólo se muestra si hay `editingSong`. */
  onCancelEdit?: () => void
}

export function SongForm({ onSubmit, editingSong, onCancelEdit }: SongFormProps) {
  const [nombre, setNombre] = useState(editingSong?.nombre ?? '')
  const [interprete, setInterprete] = useState(editingSong?.interprete ?? '')
  const [fecha, setFecha] = useState(editingSong?.fecha ?? '')

  // El trim evita que un campo con solo espacios pase como dato válido.
  const isValid = nombre.trim() !== '' && interprete.trim() !== '' && fecha !== ''

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValid) return

    onSubmit({ nombre: nombre.trim(), interprete: interprete.trim(), fecha })
    setNombre('')
    setInterprete('')
    setFecha('')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="song-nombre" className={labelClasses}>
            Nombre de la canción
          </label>
          <input
            id="song-nombre"
            type="text"
            value={nombre}
            onChange={(event) => setNombre(event.target.value)}
            placeholder="Ej: Cambalache"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="song-interprete" className={labelClasses}>
            Intérprete
          </label>
          <input
            id="song-interprete"
            type="text"
            value={interprete}
            onChange={(event) => setInterprete(event.target.value)}
            placeholder="Ej: Julio Sosa"
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="song-fecha" className={labelClasses}>
            Fecha de difusión
          </label>
          <input
            id="song-fecha"
            type="date"
            value={fecha}
            onChange={(event) => setFecha(event.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        {/* El tooltip vive en el wrapper: un button deshabilitado no dispara eventos de mouse. */}
        <div className="group relative inline-block">
          <button
            type="submit"
            disabled={!isValid}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600 dark:focus-visible:ring-offset-slate-800"
          >
            {editingSong ? 'Guardar Cambios' : 'Agregar'}
          </button>

          {!isValid && (
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-700"
            >
              Debe ingresar datos en las 3 casillas
            </span>
          )}
        </div>

        {editingSong && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
