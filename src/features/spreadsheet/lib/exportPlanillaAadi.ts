import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

/**
 * Fila exportable. Es la forma mínima que necesita la planilla, sin el `id` interno.
 * No se importa `Song` de `features/songs`: una feature no importa de otra. Como el
 * tipado de TypeScript es estructural, un `Song[]` es asignable a `SongRow[]`.
 */
export interface SongRow {
  nombre: string
  interprete: string
  fecha: string
  salidas: number
}

/** Mismo criterio que `SongRow`: interfaz estructural, no el `UserProfile` de la otra feature. */
export interface UserProfileData {
  nombreComercial: string
  razonSocial: string
  domicilioFiscal: string
  provincia: string
  email: string
  frecuenciaEmisora: string
  whatsapp: string
  localidad: string
  codigoPostal: string
  contacto: string
  cuit: string
}

export interface PlanillaAadiData {
  songs: SongRow[]
  userProfile: UserProfileData
  mesAnio: string
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

const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: 'thin' },
  left: { style: 'thin' },
  bottom: { style: 'thin' },
  right: { style: 'thin' },
}

/** Fondo sólido: en ExcelJS el color visible de un patrón `solid` es `fgColor`, no `bgColor`. */
function solidFill(argb: string): ExcelJS.FillPattern {
  return { type: 'pattern', pattern: 'solid', fgColor: { argb } }
}

/**
 * Aplica el borde fino a todas las celdas de la fila, incluidas las combinadas.
 * `lastCol` es 4 por defecto: el bloque de datos del usuario ocupa cuatro columnas y
 * bordear la quinta le dejaría una celda vacía al costado. La tabla de canciones pasa 5.
 */
function borderRow(sheet: ExcelJS.Worksheet, row: number, lastCol = 4) {
  for (let col = 1; col <= lastCol; col += 1) {
    sheet.getCell(row, col).border = THIN_BORDER
  }
}

/** Escribe un par etiqueta/valor en dos celdas contiguas. */
function writeField(sheet: ExcelJS.Worksheet, row: number, col: number, label: string, value: string) {
  const labelCell = sheet.getCell(row, col)
  labelCell.value = label
  labelCell.font = { bold: true }
  sheet.getCell(row, col + 1).value = value
}

/**
 * Genera la Declaración Jurada Mensual de AADI y dispara la descarga.
 * La planilla usa cinco columnas: el bloque de datos del usuario ocupa dos pares
 * etiqueta/valor por fila (A:D), y la tabla de canciones combina A:B para el nombre
 * y suma la columna E con la cantidad de salidas.
 */
export async function exportPlanillaAadi({ songs, userProfile, mesAnio }: PlanillaAadiData) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Declaración Jurada')

  sheet.columns = [{ width: 24 }, { width: 24 }, { width: 26 }, { width: 20 }, { width: 18 }]

  // 1. Encabezado y metadatos.
  sheet.mergeCells('A1:E1')
  const titulo = sheet.getCell('A1')
  titulo.value = 'DECLARACION JURADA MENSUAL - RADIODIFUSORES'
  titulo.font = { bold: true, size: 14 }
  titulo.alignment = { horizontal: 'center', vertical: 'middle' }
  sheet.getRow(1).height = 24

  writeField(sheet, 2, 1, 'CUIT:', userProfile.cuit)
  writeField(sheet, 2, 3, 'Mes y Año:', mesAnio)
  borderRow(sheet, 2)

  // 2. Datos del usuario. La fila 3 queda vacía a propósito, como separador.
  sheet.mergeCells('A4:D4')
  const bloqueUsuario = sheet.getCell('A4')
  bloqueUsuario.value = 'Datos del Usuario'
  bloqueUsuario.font = { bold: true, color: { argb: 'FFFFFFFF' } }
  bloqueUsuario.fill = solidFill('FF000000')
  bloqueUsuario.alignment = { horizontal: 'center', vertical: 'middle' }
  borderRow(sheet, 4)

  // Mismo orden de columnas que el formulario de la pestaña "Datos del Usuario".
  const filasUsuario: [string, string, string, string][] = [
    ['Nombre comercial:', userProfile.nombreComercial, 'Frecuencia y emisora:', userProfile.frecuenciaEmisora],
    ['Razón Social:', userProfile.razonSocial, 'Whatsapp:', userProfile.whatsapp],
    ['Domicilio fiscal:', userProfile.domicilioFiscal, 'Localidad:', userProfile.localidad],
    ['Provincia:', userProfile.provincia, 'Cód.Postal:', userProfile.codigoPostal],
    ['e-mail:', userProfile.email, 'Contacto:', userProfile.contacto],
  ]

  filasUsuario.forEach(([label1, value1, label2, value2], index) => {
    const row = 5 + index
    writeField(sheet, row, 1, label1, value1)
    writeField(sheet, row, 3, label2, value2)
    borderRow(sheet, row)
  })

  // 3. Canciones. La fila 10 queda vacía a propósito, como separador.
  const headerRow = 11
  sheet.mergeCells(headerRow, 1, headerRow, 2)
  sheet.getCell(headerRow, 1).value = 'Nombre de la Canción'
  sheet.getCell(headerRow, 3).value = 'Intérprete'
  sheet.getCell(headerRow, 4).value = 'Fecha de Difusión'
  sheet.getCell(headerRow, 5).value = 'Cantidad de Salidas'

  for (let col = 1; col <= 5; col += 1) {
    const cell = sheet.getCell(headerRow, col)
    cell.font = { bold: true }
    cell.fill = solidFill('FFD9D9D9')
    cell.alignment = { horizontal: 'center', vertical: 'middle' }
  }
  borderRow(sheet, headerRow, 5)

  songs.forEach((song, index) => {
    const row = headerRow + 1 + index
    sheet.mergeCells(row, 1, row, 2)
    sheet.getCell(row, 1).value = song.nombre
    sheet.getCell(row, 3).value = song.interprete
    const fechaCell = sheet.getCell(row, 4)
    fechaCell.value = formatFecha(song.fecha)
    fechaCell.alignment = { horizontal: 'center' }
    // Va como número, no como texto: así se puede sumar la columna en la planilla.
    const salidasCell = sheet.getCell(row, 5)
    salidasCell.value = song.salidas
    salidasCell.alignment = { horizontal: 'center' }
    borderRow(sheet, row, 5)
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  saveAs(blob, 'Planilla_AADI.xlsx')
}
