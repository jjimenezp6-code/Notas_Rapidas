import type { NoteRepository } from '../domain/noteRepository'
import type { Note } from '../domain/note'

export const createNote = (repo: NoteRepository) => async (payload: { id: string, title: string, content: string }): Promise<Note> => {
  const now = Date.now()
  return repo.create({ ...payload, createdAt: now, updatedAt: now })
}
