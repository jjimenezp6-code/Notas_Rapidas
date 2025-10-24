<template>
  <NuxtPwaManifest />
  <div class="app-bg">
    <TopBar />
    <main class="mx-auto max-w-3xl p-4 md:p-6">
      <div class="panel">
        <NuxtPage :key="route.fullPath" />
      </div>
    </main>
    <InstallPWA />
    <!-- Host de toasts (Paso 6) -->
    <ToastHost />
  </div>
</template>

<script setup lang="ts">
import TopBar from '@/components/TopBar.vue'
import InstallPWA from '@/components/InstallPWA.vue'
import ToastHost from '@/components/ToastHost.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

