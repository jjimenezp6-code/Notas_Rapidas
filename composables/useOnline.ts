// composables/useOnline.ts
import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useOnline() {
  const online = ref(true)

  const update = () => { online.value = navigator.onLine }

  onMounted(() => {
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('online', update)
    window.removeEventListener('offline', update)
  })

  return { online }
}

