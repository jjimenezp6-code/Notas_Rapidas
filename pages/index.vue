<template>
  <div class="space-y-6">
    <!-- Buscador y acciones -->
    <div class="card p-4 flex flex-col gap-3 md:flex-row md:items-center">
      <input
        v-model="q"
        type="text"
        placeholder="Buscar notas…"
        class="input w-full md:flex-1"
      />

      <div class="flex items-center gap-2 order-3 md:order-none">
        <span class="text-xs opacity-70">Vista:</span>
        <span class="chip" :class="!compact ? 'active' : ''" @click="setCompact(false)">Normal</span>
        <span class="chip" :class="compact ? 'active' : ''" @click="setCompact(true)">Compacta</span>
      </div>

      <button class="btn btn-primary md:ml-auto" @click="newNote">Nueva</button>
    </div>

    <!-- Filtros por etiquetas -->
    <div class="card p-4">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="chip" :class="activeTag === '' ? 'active' : ''" @click="activeTag = ''">Etiquetas</span>
        <span
          v-for="t in allTags"
          :key="t"
          class="chip"
          :class="activeTag === t ? 'active' : ''"
          @click="activeTag = t"
        >
          #{{ t }}
        </span>
      </div>
    </div>

    <!-- Fijadas -->
    <section v-if="pinned.length">
      <h2 class="text-sm uppercase tracking-wide text-neutral-500 mb-2">Fijadas</h2>
      <TransitionGroup name="list-fade" tag="div" :class="gridClass">
        <NoteCard
          v-for="n in pinned"
          :key="n.id"
          :note="n"
          :compact="compact"
          @togglePin="onTogglePin"
          @delete="removeNote"
        />
      </TransitionGroup>
    </section>

    <!-- Todas -->
    <section v-if="others.length">
      <h2 class="text-sm uppercase tracking-wide text-neutral-500 mb-2">Todas</h2>
      <TransitionGroup name="list-fade" tag="div" :class="gridClass">
        <NoteCard
          v-for="n in others"
          :key="n.id"
          :note="n"
          :compact="compact"
          @togglePin="onTogglePin"
          @delete="removeNote"
        />
      </TransitionGroup>
    </section>

    <!-- Sin notas -->
    <div
      v-if="loaded && pinned.length === 0 && others.length === 0"
      class="card p-10 text-center text-neutral-500"
    >
      No hay notas aún. Crea tu primera nota.
    </div>

    <FabNew class="md:hidden" @click="newNote" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { navigateTo } from 'nuxt/app'
import { useNotesStore, type Note } from '@/stores/notes'
import NoteCard from '@/components/NoteCard.vue'
import FabNew from '@/components/FabNew.vue'
import { useToasts } from '@/composables/useToasts'

const { push: toast } = useToasts()
const store = useNotesStore()

const q = ref('')
const activeTag = ref('')
const compact = ref(false)

const loaded = computed(() => store.loaded)

onMounted(async () => {
  if (!store.loaded) await store.load()
  const pref = localStorage.getItem('ui:compact')
  compact.value = pref === '1'
})

const visible = computed<Note[]>(() => {
  let list = store.notes.slice()

  if (q.value.trim()) {
    const term = q.value.toLowerCase()
    list = list.filter(n =>
      (n.title || '').toLowerCase().includes(term) ||
      (n.content || '').toLowerCase().includes(term)
    )
  }

  if (activeTag.value) {
    list = list.filter(n => (n.tags || []).includes(activeTag.value))
  }

  return list.sort((a, b) =>
    (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) ||
    (b.updatedAt ?? b.createdAt) - (a.updatedAt ?? a.createdAt)
  )
})

const pinned = computed(() => visible.value.filter(n => n.pinned))
const others = computed(() => visible.value.filter(n => !n.pinned))

const allTags = computed(() => {
  const set = new Set<string>()
  store.notes.forEach(n => (n.tags || []).forEach(t => set.add(t)))
  return Array.from(set).sort((a, b) => a.localeCompare(b))
})

const newNote = async () => {
  await navigateTo(`/nota/new`)
}

const onTogglePin = async (id: string) => {
  await store.togglePin(id)
  const n = await store.get(id)
  toast(n?.pinned ? 'Nota fijada' : 'Nota desfijada', 'info')
}

// ✅ NUEVO: eliminación con opción “Deshacer”
const removeNote = async (id: string) => {
  const snap = await store.get(id)
  if (!snap) return

  await store.remove(id)

  toast('Nota eliminada', 'error', 5000, {
    label: 'Deshacer',
    run: async () => {
      const created = await store.add(snap.title || '', snap.content || '')
      const newId = typeof created === 'string' ? created : created.id
      if (snap.tags?.length) {
        await store.update(newId, { tags: snap.tags })
      }
    }
  })
}

const setCompact = (val: boolean) => {
  compact.value = val
  localStorage.setItem('ui:compact', val ? '1' : '0')
}

const gridClass = computed(() =>
  compact.value
    ? 'grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
    : 'grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
)
</script>

<style scoped>
.list-fade-enter-active, .list-fade-leave-active { transition: all .18s ease; }
.list-fade-enter-from, .list-fade-leave-to { opacity: 0; transform: translateY(6px); }
.list-fade-move { transition: transform .18s ease; }
</style>
