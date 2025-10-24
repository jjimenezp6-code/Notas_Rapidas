<script setup lang="ts">
import { useInstallPrompt } from '@/composables/useInstallPrompt'

const { canInstall, showBanner, install, dismiss, isStandalone } = useInstallPrompt()
const onInstall = async () => { await install() }
</script>

<template>
  <!-- Solo aparece en PC, no instalada, y solo cuando Chrome entrega el evento -->
  <transition name="fade">
    <div v-if="showBanner && !isStandalone()" class="fixed bottom-4 right-4 z-50">
      <div class="flex items-center gap-3 rounded-xl shadow-lg bg-neutral-900/95 text-white backdrop-blur px-3 py-2">
        <span class="text-sm">
          ¿Quieres instalar la aplicación? <strong>Descárgala aquí</strong>
        </span>

        <button
          class="px-3 py-1.5 rounded-lg bg-yellow-400 text-black hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!canInstall"
          @click="onInstall"
          title="Instalar"
        >
          Instalar
        </button>

        <button
          class="px-2 py-1 rounded-lg bg-neutral-700/70 hover:bg-neutral-600/70"
          @click="dismiss"
          aria-label="Cerrar"
          title="Más tarde"
        >
          ✕
        </button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
