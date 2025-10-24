<template>
  <header
    role="banner"
    class="sticky top-0 z-40 backdrop-blur bg-white/60 dark:bg-black/30 border-b border-black/10 dark:border-white/10 pt-[env(safe-area-inset-top)]"
  >
    <div class="mx-auto max-w-5xl px-4 md:px-6 h-14 flex items-center gap-3">
      <div class="flex items-center gap-2">
        <img src="/icon-192.png" alt="" class="h-6 w-6 rounded-md" />
        <h1 class="font-[Sora] text-lg tracking-tight text-black dark:text-white m-0">
          Notas Rápidas
        </h1>
      </div>

      <div class="ml-auto flex items-center gap-2">
        <span
          class="px-2 py-1 rounded-full text-xs"
          :class="online ? 'bg-green-500/20 text-green-700 dark:text-green-300' : 'bg-red-500/20 text-red-700 dark:text-red-300'"
        >
          {{ online ? 'En línea' : 'Sin conexión' }}
        </span>
        <!-- Auto-import desde /components/ThemeToggle.vue -->
        <ThemeToggle />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useOnline } from '@/composables/useOnline'
const { online } = useOnline()
</script>
