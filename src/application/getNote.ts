import type { NoteRepository } from '../domain/noteRepository'

export const getNote = (repo: NoteRepository) => async (id: string) => {
  return repo.getById(id)
}
