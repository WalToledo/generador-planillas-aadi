/** Registro de difusión de una canción. Los campos siguen la nomenclatura de la planilla exportada. */
export interface Song {
  id: string
  nombre: string
  interprete: string
  fecha: string
  /** Cantidad de veces que la canción salió al aire en el mes declarado. Mínimo 1. */
  salidas: number
}
