// src/infrastructure/IndexedDbNoteRepository.ts
import { openDB, type IDBPDatabase } from 'idb'
import type { Note } from '@/src/domain/note'
import type { NoteRepository } from '@/src/domain/noteRepository'

const DB_NAME = 'notas-rapidas-db'
const STORE = 'notes'

/** Convierte cualquier valor a un clon plano “safe” para IndexedDB */
function toPlain<T>(v: T): T {
  try {
    return JSON.parse(JSON.stringify(v)) as T
  } catch {
    return v
  }
}

/** Normaliza una nota para que sea 100% serializable en IndexedDB */
function normalizeNote(n: Partial<Note> & { id: string }): Note {
  return {
    id: String(n.id),
    title: String(n.title ?? ''),
    content: String(n.content ?? ''),
    createdAt: Number(n.createdAt ?? Date.now()),
    updatedAt: Number(n.updatedAt ?? n.createdAt ?? Date.now()),
    pinned: Boolean(n.pinned ?? false),
    tags: Array.isArray(n.tags) ? toPlain(n.tags.map((t: string) => String(t))) : []
  }
}

export class IndexedDbNoteRepository implements NoteRepository {
  private dbPromise: Promise<IDBPDatabase> | null = null

  private ensureDb() {
    if (!this.dbPromise) {
      if (typeof indexedDB === 'undefined') {
        throw new Error('IndexedDB no disponible en este entorno')
      }
      this.dbPromise = openDB(DB_NAME, 1, {
        upgrade(db) {
          const store = db.createObjectStore(STORE, { keyPath: 'id' })
          store.createIndex('updatedAt', 'updatedAt')
        }
      })
    }
    return this.dbPromise
  }

  async getAll(): Promise<Note[]> {
    const db = await this.ensureDb()
    const list = (await db.getAll(STORE)) as Note[]
    return list.map(n => normalizeNote(n))
  }

  async getById(id: string): Promise<Note | null> {
    const db = await this.ensureDb()
    const n = (await db.get(STORE, id)) as Note | undefined
    return n ? normalizeNote(n) : null
  }

  async create(note: Note): Promise<Note> {
    const db = await this.ensureDb()
    const plain = normalizeNote(toPlain(note))
    await db.put(STORE, plain)
    return plain
  }

  async update(id: string, patch: Partial<Omit<Note, 'id'>>): Promise<Note> {
    const db = await this.ensureDb()
    const existing = (await db.get(STORE, id)) as Note | undefined

    if (!existing) {
      const created = normalizeNote({
        id,
        title: patch.title ?? '',
        content: patch.content ?? '',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        pinned: patch.pinned ?? false,
        tags: Array.isArray(patch.tags) ? patch.tags : []
      })
      await db.put(STORE, created)
      return created
    }

    const merged: Note = normalizeNote({
      ...existing,
      ...toPlain(patch),
      id,
      updatedAt: Date.now()
    })

    await db.put(STORE, merged)
    return merged
  }

  async remove(id: string): Promise<void> {
    const db = await this.ensureDb()
    await db.delete(STORE, id)
  }
}
