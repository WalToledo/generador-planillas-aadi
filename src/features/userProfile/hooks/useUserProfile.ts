import { useEffect, useState } from 'react'
import type { UserProfile } from '../types/userProfile'

const STORAGE_KEY = 'userProfile'

const EMPTY_PROFILE: UserProfile = {
  nombreComercial: '',
  razonSocial: '',
  domicilioFiscal: '',
  provincia: '',
  email: '',
  frecuenciaEmisora: '',
  whatsapp: '',
  localidad: '',
  codigoPostal: '',
  contacto: '',
  cuit: '',
}

function readStoredProfile(): UserProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return EMPTY_PROFILE
    const parsed: unknown = JSON.parse(stored)
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return EMPTY_PROFILE
    }
    // El spread sobre EMPTY_PROFILE evita campos `undefined` si lo guardado es de una versión previa.
    return { ...EMPTY_PROFILE, ...(parsed as Partial<UserProfile>) }
  } catch {
    // Cubre localStorage no disponible (modo privado) y JSON corrupto.
    return EMPTY_PROFILE
  }
}

export function useUserProfile() {
  // El estado se hidrata en el initializer para que el efecto de guardado nunca pise lo guardado.
  const [userProfile, setUserProfile] = useState<UserProfile>(readStoredProfile)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile))
    } catch {
      // Sin localStorage la app sigue funcionando en memoria durante la sesión.
    }
  }, [userProfile])

  // Actualización funcional: no depende del `userProfile` capturado en el render que creó el handler.
  function updateField(field: keyof UserProfile, value: string) {
    setUserProfile((prev) => ({ ...prev, [field]: value }))
  }

  return { userProfile, updateField, setUserProfile }
}
