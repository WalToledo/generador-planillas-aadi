import { useEffect, useState } from 'react'
import type { Song } from '../types/song'

const STORAGE_KEY = 'songs'

function readStoredSongs(): Song[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    // Solo confiamos en el dato si sigue siendo una lista: el contenido lo escribe esta misma app.
    return Array.isArray(parsed) ? (parsed as Song[]) : []
  } catch {
    // Cubre localStorage no disponible (modo privado) y JSON corrupto.
    return []
  }
}

export function useSongs() {
  // El estado se hidrata en el initializer para que el efecto de guardado nunca pise lo guardado.
  const [songs, setSongs] = useState<Song[]>(readStoredSongs)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(songs))
    } catch {
      // Sin localStorage la app sigue funcionando en memoria durante la sesión.
    }
  }, [songs])

  // Actualización funcional: no depende del `songs` capturado en el render que creó el handler.
  function addSong(data: Omit<Song, 'id'>) {
    setSongs((prev) => [...prev, { ...data, id: crypto.randomUUID() }])
  }

  return { songs, addSong, setSongs }
}
