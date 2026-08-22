import { inputClasses, labelClasses } from '@/shared/ui'
import type { UserProfile } from '../types/userProfile'

/** Campo editable de la cuadrícula. `cuit` queda afuera: se edita en el módulo de exportación. */
type ProfileField = Exclude<keyof UserProfile, 'cuit'>

/**
 * Orden por FILAS, no por columnas: el grid de 2 columnas llena de izquierda a derecha,
 * así que los campos van intercalados para que queden las columnas que pide la planilla.
 */
const FIELDS: { name: ProfileField; label: string; type: string }[] = [
  { name: 'nombreComercial', label: 'Nombre comercial', type: 'text' },
  { name: 'frecuenciaEmisora', label: 'Frecuencia y emisora', type: 'text' },
  { name: 'razonSocial', label: 'Razón Social', type: 'text' },
  { name: 'whatsapp', label: 'Whatsapp', type: 'tel' },
  { name: 'domicilioFiscal', label: 'Domicilio fiscal', type: 'text' },
  { name: 'localidad', label: 'Localidad', type: 'text' },
  { name: 'provincia', label: 'Provincia', type: 'text' },
  { name: 'codigoPostal', label: 'Cód. Postal', type: 'text' },
  { name: 'email', label: 'e-mail', type: 'email' },
  { name: 'contacto', label: 'Contacto', type: 'text' },
]

export interface UserProfileFormProps {
  userProfile: UserProfile
  onFieldChange: (field: keyof UserProfile, value: string) => void
}

export function UserProfileForm({ userProfile, onFieldChange }: UserProfileFormProps) {
  return (
    // No es un <form>: los cambios se persisten al tipear, no hay submit que manejar.
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      {FIELDS.map((field) => (
        <div key={field.name}>
          <label htmlFor={`profile-${field.name}`} className={labelClasses}>
            {field.label}
          </label>
          <input
            id={`profile-${field.name}`}
            type={field.type}
            value={userProfile[field.name]}
            onChange={(event) => onFieldChange(field.name, event.target.value)}
            className={inputClasses}
          />
        </div>
      ))}
    </div>
  )
}
