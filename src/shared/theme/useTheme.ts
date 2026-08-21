import { useEffect, useState } from 'react'

const STORAGE_KEY = 'theme'

function readStoredPreference(): boolean {
  try {
    // Sin preferencia guardada arrancamos en oscuro, igual que el script de index.html.
    return localStorage.getItem(STORAGE_KEY) !== 'light'
  } catch {
    return true
  }
}

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(readStoredPreference)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
    try {
      localStorage.setItem(STORAGE_KEY, isDarkMode ? 'dark' : 'light')
    } catch {
      // localStorage puede no estar disponible (modo privado): el tema igual se aplica en memoria.
    }
  }, [isDarkMode])

  const toggleTheme = () => setIsDarkMode((prev) => !prev)

  return { isDarkMode, toggleTheme }
}
