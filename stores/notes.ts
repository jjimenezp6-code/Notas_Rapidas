// stores/notes.ts
import { defineStore } from 'pinia'
import { IndexedDbNoteRepository } from '@/src/infrastructure/IndexedDbNoteRepository'

export type Note = {
  id: string
  title: string
  content: string
  createdAt: number
  updatedAt: number
  pinned?: boolean
  tags?: string[]
}

type NotePatch = Partial<Omit<Note, 'id' | 'createdAt'>>

const repo = new IndexedDbNoteRepository()

export const useNotesStore = defineStore('notes', {
  state: () => ({
    notes: [] as Note[],
    loaded: false
  }),

  actions: {
    async load() {
      if (this.loaded) return
      const list = await repo.getAll()
      this.notes = list.map((n: any) => ({
        id: n.id,
        title: n.title ?? '',
        content: n.content ?? '',
        createdAt: n.createdAt ?? Date.now(),
        updatedAt: n.updatedAt ?? n.createdAt ?? Date.now(),
        pinned: n.pinned ?? false,
        tags: Array.isArray(n.tags) ? n.tags : []
      }))
      this.loaded = true
    },

    async add(title: string, content: string): Promise<Note> {
      const note: Note = {
        id: crypto.randomUUID(),
        title,
        content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        pinned: false,
        tags: []
      }
      await repo.create(note)
      this.notes.unshift(note)
      return note
    },

    // ✅ Robusto: si no existe en DB, la crea; si existe, actualiza
    async update(id: string, patch: NotePatch): Promise<Note> {
      // asegura que el store esté cargado
      if (!this.loaded) await this.load()

      // busca localmente y en DB
      let current = this.notes.find(n => n.id === id) || await repo.getById(id)

      if (!current) {
        // no existe: crearla con lo que haya en patch
        const created: Note = {
          id,
          title: (patch.title ?? '').toString(),
          content: (patch.content ?? '').toString(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
          pinned: patch.pinned ?? false,
          tags: Array.isArray(patch.tags) ? patch.tags : []
        }
        await repo.create(created)
        this.notes.unshift(created)
        return created
      }

      // existe: actualizar
      const updated = await repo.update(id, {
        ...patch,
        updatedAt: Date.now()
      })

      // sincroniza el array local
      const i = this.notes.findIndex(n => n.id === id)
      if (i !== -1) this.notes[i] = updated as Note
      else this.notes.unshift(updated as Note)

      return updated as Note
    },

    async togglePin(id: string) {
      const n = this.notes.find(n => n.id === id)
      if (!n) return
      await this.update(id, { pinned: !n.pinned })
    },

    async remove(id: string) {
      await repo.remove(id)
      this.notes = this.notes.filter(n => n.id !== id)
    },

    async get(id: string): Promise<Note | null> {
      const local = this.notes.find(n => n.id === id)
      if (local) return local
      const dbNote = await repo.getById(id)
      return (dbNote as Note) ?? null
    }
  }
})
