import { Moon, Sun } from 'lucide-react'

interface ThemeToggleProps {
  isDarkMode: boolean
  onToggle: () => void
}

export function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
  const label = isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
    >
      {isDarkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  )
}
