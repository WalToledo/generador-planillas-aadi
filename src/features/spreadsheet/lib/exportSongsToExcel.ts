import { utils, writeFile } from 'xlsx'

/**
 * Fila exportable. Es la forma mínima que necesita la planilla, sin el `id` interno.
 * No se importa `Song` de `features/songs`: una feature no importa de otra. Como el
 * tipado de TypeScript es estructural, un `Song[]` es asignable a `SongRow[]`.
 */
export interface SongRow {
  nombre: string
  interprete: string
  fecha: string
}

/**
 * La fecha se guarda como `YYYY-MM-DD` (input type="date"). Se parte el string en
 * vez de usar `new Date()`, que lo interpreta como UTC y corre un día según la zona.
 * Duplica a propósito el helper de `SongTable`: cruzar features para compartirlo
 * rompería la regla de dependencias.
 */
function formatFecha(fecha: string) {
  const [year, month, day] = fecha.split('-')
  if (!year || !month || !day) return fecha
  return `${day}/${month}/${year}`
}

/** Genera la planilla a partir de las canciones y dispara la descarga en el navegador. */
export function exportSongsToExcel(songs: SongRow[], fileName = 'canciones.xlsx') {
  // Las claves del objeto son los encabezados que `json_to_sheet` escribe en la fila 1.
  const rows = songs.map((song) => ({
    Nombre: song.nombre,
    Intérprete: song.interprete,
    Fecha: formatFecha(song.fecha),
  }))

  const worksheet = utils.json_to_sheet(rows)
  worksheet['!cols'] = [{ wch: 32 }, { wch: 28 }, { wch: 12 }]

  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, worksheet, 'Canciones')
  writeFile(workbook, fileName)
}
