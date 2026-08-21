import { ThemeToggle, useTheme } from '@/shared/theme'
import { Section } from '@/shared/ui'

function App() {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200 transition-colors dark:border-slate-700">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Gestor de Canciones</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Registrá las difusiones y exportalas a Excel
            </p>
          </div>
          <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleTheme} />
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
        <Section
          title="Nueva canción"
          description="Formulario de carga con nombre, intérprete y fecha de difusión."
        />
        <Section
          title="Canciones registradas"
          description="Tabla con las canciones cargadas y acciones para editar o eliminar."
        />
        <Section
          title="Exportar"
          description="Descarga de la planilla en formato .xlsx."
        />
      </main>
    </div>
  )
}

export default App
