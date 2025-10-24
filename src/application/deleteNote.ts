import type { NoteRepository } from '../domain/noteRepository'

export const deleteNote = (repo: NoteRepository) => async (id: string) => {
  await repo.remove(id)
}
