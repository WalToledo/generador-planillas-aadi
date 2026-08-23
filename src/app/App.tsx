import { useState } from 'react'
import { SongForm, SongTable, useSongs } from '@/features/songs'
import type { Song } from '@/features/songs'
import { ExportPanel } from '@/features/spreadsheet'
import { UserProfileForm, useUserProfile } from '@/features/userProfile'
import { ThemeToggle, useTheme } from '@/shared/theme'
import { Section, Tabs } from '@/shared/ui'
import type { TabItem } from '@/shared/ui'

type TabId = 'songs' | 'profile'

const TABS: readonly TabItem<TabId>[] = [
  { id: 'songs', label: 'Canciones' },
  { id: 'profile', label: 'Datos del Usuario' },
]

function App() {
  const { isDarkMode, toggleTheme } = useTheme()
  const { songs, addSong, updateSong, deleteSong } = useSongs()
  const { userProfile, updateField } = useUserProfile()
  const [editingId, setEditingId] = useState<string | null>(null)
  // La pestaña visible no se persiste: cada sesión arranca en la carga de canciones.
  const [activeTab, setActiveTab] = useState<TabId>('songs')

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

      <div className="mx-auto max-w-4xl px-4">
        <Tabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
        {activeTab === 'songs' ? (
          <>
            <Section
              title="Nueva canción"
              description="Formulario de carga con nombre, intérprete, fecha de difusión y cantidad de salidas."
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
              description="Metadatos de la declaración y descarga de la planilla en formato .xlsx."
            >
              <ExportPanel
                songs={songs}
                userProfile={userProfile}
                onCuitChange={(cuit) => updateField('cuit', cuit)}
              />
            </Section>
          </>
        ) : (
          <Section
            title="Datos del Usuario"
            description="Datos fijos del radiodifusor. Se guardan automáticamente y se inyectan en la planilla exportada."
          >
            <UserProfileForm userProfile={userProfile} onFieldChange={updateField} />
          </Section>
        )}
      </main>
    </div>
  )
}

export default App
