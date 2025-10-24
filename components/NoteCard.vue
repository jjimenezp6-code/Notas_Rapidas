<template>
  <article
    class="note-card group cursor-pointer overflow-hidden relative p-3"
    @click="open"
  >
    <!-- Insignia FIJADA -->
    <span
      v-if="note.pinned"
      class="absolute top-2 left-2 z-10 rounded-md px-2 py-[2px] text-[10px] font-semibold
             bg-yellow-400 text-black ring-1 ring-black/10 select-none pointer-events-none shadow-sm"
    >
      FIJADA
    </span>

    <!-- Acciones -->
    <div
      class="absolute top-2 right-2 z-20 flex flex-col items-end gap-1 md:opacity-0 md:group-hover:opacity-100 transition duration-150"
      @click.stop
    >
      <!-- fila 1 -->
      <div class="flex gap-1">
        <button
          class="rounded-lg px-2 py-[2px] text-[11px] bg-black/5 text-black hover:bg-black/10
                 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition"
          @click="togglePinLocal"
        >
          {{ note.pinned ? '📌 Quitar' : '📍 Fijar' }}
        </button>

        <button
          class="rounded-lg px-2 py-[2px] text-[11px] bg-black/5 text-black hover:bg-black/10
                 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition"
          @click="open"
        >
          ✏️
        </button>
      </div>

      <!-- fila 2 -->
      <button
        class="rounded-lg px-2 py-[2px] text-[11px] bg-red-500/90 text-white hover:bg-red-600 transition"
        @click="askDelete"
      >
        🗑️
      </button>
    </div>

    <!-- Contenido -->
    <div class="pt-10">
      <h3
        class="note-title pr-24 font-medium"
        :class="compact ? 'line-clamp-1 text-[14px]' : 'line-clamp-2 text-[16px]'"
      >
        {{ note.title || 'Sin título' }}
      </h3>

      <p
        class="note-content mt-2 whitespace-pre-wrap text-[13px]"
        :class="compact ? 'line-clamp-2' : 'line-clamp-4'"
      >
        {{ note.content || '—' }}
      </p>

      <div class="mt-3 flex flex-wrap items-center gap-2 text-[11px]">
        <span v-for="t in note.tags || []" :key="t" class="note-tag">#{{ t }}</span>
        <span class="ml-auto opacity-60">{{ prettyTime }}</span>
      </div>
    </div>

    <ConfirmDialog
      v-model:open="confirmOpen"
      title="Eliminar nota"
      :message="`¿Eliminar la nota «${note.title || 'Sin título'}»?`"
      confirm-text="Eliminar"
      cancel-text="Cancelar"
      variant="danger"
      @confirm="confirmDelete"
    />
  </article>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { navigateTo } from 'nuxt/app'
import type { Note } from '@/stores/notes'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const props = defineProps<{ note: Note; compact?: boolean }>()
const emit = defineEmits<{ (e: 'togglePin', id: string): void; (e: 'delete', id: string): void }>()

const open = () => navigateTo(`/nota/${props.note.id}`)
const togglePinLocal = () => emit('togglePin', props.note.id)
const confirmOpen = ref(false)
const askDelete = () => { confirmOpen.value = true }
const confirmDelete = () => emit('delete', props.note.id)

const prettyTime = computed(() => {
  const ts = (props.note.updatedAt ?? props.note.createdAt) || Date.now()
  const diff = Date.now() - ts
  const sec = Math.floor(diff / 1000)
  if (sec < 60) return 'hace unos segundos'
  const min = Math.floor(sec / 60)
  if (min < 60) return `hace ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `hace ${h} h`
  const d = Math.floor(h / 24)
  if (d < 7) return `hace ${d} d`
  return new Date(ts).toLocaleDateString()
})
</script>

<style scoped>
.note-card {
  animation: fadeIn 0.18s ease-out;
  position: relative;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.note-card:hover .note-title {
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>


