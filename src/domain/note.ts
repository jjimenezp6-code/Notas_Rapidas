// src/domain/note.ts
export type Note = {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
  pinned?: boolean
  tags?: string[]
}
