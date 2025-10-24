import type { NoteRepository } from '../domain/noteRepository'

export const listNotes = (repo: NoteRepository) => async () => {
  const notes = await repo.getAll()
  // Sort by updatedAt desc
  return notes.sort((a, b) => b.updatedAt - a.updatedAt)
}
