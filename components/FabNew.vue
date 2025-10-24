<template>
  <button
    class="fab inline-flex items-center justify-center h-14 w-14 rounded-2xl
           bg-yellow-400 text-black shadow-[0_12px_30px_rgba(0,0,0,0.18)]
           hover:shadow-[0_16px_40px_rgba(0,0,0,0.22)] active:scale-95
           transition-transform duration-150"
    @click="$emit('click')"
    aria-label="Nueva nota"
    title="Nueva nota"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 5a1 1 0 1 1 2 0v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6z"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
// Emite 'click'; sin lógica adicional para no romper nada.
</script>

<style scoped>
/* animación sutil al montar */
:host, button { animation: pop .18s ease-out; }
@keyframes pop { from { transform: scale(.96); opacity: .0 } to { transform: scale(1); opacity: 1 } }
</style>
