// src/domain/noteRepository.ts
import type { Note } from './note'

export interface NoteRepository {
  getAll(): Promise<Note[]>
  getById(id: string): Promise<Note | null>
  create(note: Note): Promise<Note>
  update(id: string, patch: Partial<Omit<Note, 'id'>>): Promise<Note>
  remove(id: string): Promise<void>
}
