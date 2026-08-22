/**
 * Datos fijos del radiodifusor que se inyectan en la planilla exportada.
 * `cuit` vive acá porque es un dato fijo del usuario, pero no se edita en la
 * cuadrícula de esta feature sino en el módulo de exportación.
 */
export interface UserProfile {
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
