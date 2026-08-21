import { useState } from 'react'
import { SongForm, SongTable, useSongs } from '@/features/songs'
import type { Song } from '@/features/songs'
import { ExportButton } from '@/features/spreadsheet'
import { ThemeToggle, useTheme } from '@/shared/theme'
import { Section } from '@/shared/ui'

function App() {
  const { isDarkMode, toggleTheme } = useTheme()
  const { songs, addSong, updateSong, deleteSong } = useSongs()
  const [editingId, setEditingId] = useState<string | null>(null)

  // La canción en edición se deriva del array: guardarla en estado la dejaría desincronizada.
  const editingSong = songs.find((song) => song.id === editingId) ?? null

  function handleSubmit(data: Omit<Song, 'id'>) {
    if (editingId) {
      updateSong(editingId, data)
      setEditingId(null)
      return
    }
    addSong(data)
  }

  function handleDelete(id: string) {
    deleteSong(id)
    // Borrar la fila en edición debe cerrar el modo edición, no dejar el form colgado.
    if (id === editingId) setEditingId(null)
  }

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
        >
          {/* La `key` remonta el form al cambiar de canción: así los campos se resetean sin efecto. */}
          <SongForm
            key={editingSong?.id ?? 'new'}
            onSubmit={handleSubmit}
            editingSong={editingSong}
            onCancelEdit={() => setEditingId(null)}
          />
        </Section>
        <Section
          title="Canciones registradas"
          description={
            songs.length === 1
              ? '1 canción cargada.'
              : `${songs.length} canciones cargadas.`
          }
        >
          <SongTable
            songs={songs}
            editingId={editingId}
            onEdit={(song) => setEditingId(song.id)}
            onDelete={handleDelete}
          />
        </Section>
        <Section
          title="Exportar"
          description="Descarga de la planilla en formato .xlsx."
        >
          <ExportButton songs={songs} />
        </Section>
      </main>
    </div>
  )
}

export default App
