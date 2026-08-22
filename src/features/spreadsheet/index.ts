// API pública de la feature: el resto de la app importa desde acá, nunca de rutas internas.
// `exportPlanillaAadi` no se reexporta a propósito: sólo la consume `ExportPanel`, con un
// import dinámico, y un reexport estático arrastraría ExcelJS de vuelta al bundle inicial.
export type { SongRow, UserProfileData, PlanillaAadiData } from './lib/exportPlanillaAadi'
export { ExportPanel } from './components/ExportPanel'
export type { ExportPanelProps } from './components/ExportPanel'
