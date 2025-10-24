import { defineNuxtPlugin } from 'nuxt/app'
import { registerSW } from 'virtual:pwa-register'

export default defineNuxtPlugin(() => {
  let hasRefreshed = false

  // Si el nuevo SW toma control, recargamos 1 sola vez
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (hasRefreshed) return
    hasRefreshed = true
    location.reload()
  })

  const updateSW = registerSW({
    immediate: true,

    onNeedRefresh() {
      // Si Workbox avisa que hay update, activarlo YA
      updateSW(true)
    },

    onOfflineReady() {},

    onRegisteredSW(_url, reg) {
      if (!reg) return

      const safeUpdate = () => reg.update().catch(() => {})
      const activateWaiting = () => {
        try {
          if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' })
          else updateSW(true)
        } catch {}
      }

      // Empujones iniciales
      safeUpdate()
      setTimeout(safeUpdate, 1500)
      setTimeout(() => { safeUpdate(); activateWaiting() }, 4000)

      // Primer plano
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          safeUpdate()
          activateWaiting()
        }
      })

      // Vuelve internet
      window.addEventListener('online', () => {
        safeUpdate()
        activateWaiting()
      })

      // Ráfaga de 30s (iOS standalone es caprichoso)
      const start = Date.now()
      const burst = setInterval(() => {
        safeUpdate()
        activateWaiting()
        if (Date.now() - start > 30_000) clearInterval(burst)
      }, 5_000)

      // Si ya hay uno esperando al registrar
      if (reg.waiting) activateWaiting()
    }
  })
})
