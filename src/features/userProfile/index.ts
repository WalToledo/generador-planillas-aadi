// API pública de la feature: el resto de la app importa desde acá, nunca de rutas internas.
export type { UserProfile } from './types/userProfile'
export { useUserProfile } from './hooks/useUserProfile'
export { UserProfileForm } from './components/UserProfileForm'
export type { UserProfileFormProps } from './components/UserProfileForm'
