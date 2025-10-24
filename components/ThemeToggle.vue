<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme, initTheme } = useTheme()
onMounted(() => initTheme())
const label = computed(() => (isDark.value ? 'Oscuro' : 'Claro'))
</script>

<template>
  <button
    class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-black/10 text-black hover:bg-black/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 transition"
    @click="toggleTheme"
    :title="isDark ? 'Cambiar a claro' : 'Cambiar a oscuro'"
    aria-label="Cambiar tema"
  >
    <span class="text-sm">{{ label }}</span>
  </button>
</template>
