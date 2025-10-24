import type { NoteRepository } from '../domain/noteRepository'
import type { Note } from '../domain/note'

export const updateNote = (repo: NoteRepository) => async (id: string, patch: Partial<Omit<Note, 'id'>>) => {
  return repo.update(id, { ...patch, updatedAt: Date.now() })
}
