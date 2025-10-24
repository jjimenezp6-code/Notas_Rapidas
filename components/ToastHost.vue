<template>
  <div
    class="fixed z-[60] bottom-4 left-4 flex flex-col gap-2 pointer-events-none sm:bottom-6 sm:left-6"
    role="region"
    aria-live="polite"
  >
    <TransitionGroup name="toast">
      <div
        v-for="t in toasts"
        :key="t.id"
        class="pointer-events-auto min-w-[220px] max-w-[90vw] sm:max-w-sm
               rounded-xl shadow-lg ring-1 p-3 flex items-center gap-3
               bg-white text-black ring-black/10 dark:bg-white/10 dark:text-white dark:ring-white/10"
      >
        <div class="mt-[2px] text-base leading-none">
          <span v-if="t.type === 'success'">✓</span>
          <span v-else-if="t.type === 'error'">✕</span>
          <span v-else>ℹ️</span>
        </div>

        <p class="text-sm leading-5">{{ t.message }}</p>

        <button
          v-if="t.action"
          class="ml-auto rounded-md px-2 py-1 text-xs font-medium bg-black/5 hover:bg-black/10
                 dark:bg-white/10 dark:hover:bg-white/20"
          @click="onAction(t)"
        >
          {{ t.action.label }}
        </button>

        <button
          class="ml-1 -mr-1 rounded-md p-1 text-xs opacity-60 hover:opacity-100"
          @click="remove(t.id)"
          aria-label="Cerrar"
        >
          ✕
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToasts } from '@/composables/useToasts'
const { toasts, remove } = useToasts()

const onAction = async (t: any) => {
  try { await t.action?.run?.() } finally { remove(t.id) }
}
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all .18s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(6px) scale(.98); }
</style>


