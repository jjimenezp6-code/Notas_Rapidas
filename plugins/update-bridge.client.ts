import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin(() => {
  // Solo en navegador
  if (typeof window === 'undefined') return

  const getDocBuild = () =>
    document.querySelector('meta[name="x-build"]')?.getAttribute('content') || ''

  const fetchBuild = async (): Promise<string> => {
    try {
      // Forzamos red real (sin cache) para leer el HEAD nuevo
      const res = await fetch('/?__check_build__=' + Date.now(), { cache: 'no-store' })
      const html = await res.text()
      // Extrae <meta name="x-build" content="...">
      const m = html.match(/<meta[^>]+name=["']x-build["'][^>]+content=["']([^"']+)["']/i)
      return m?.[1] || ''
    } catch {
      return ''
    }
  }

  const forceSWUpdate = async () => {
    try {
      const reg = await navigator.serviceWorker?.getRegistration()
      if (!reg) return
      await reg.update().catch(() => {})
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
    } catch {}
  }

  const checkAndUpdate = async () => {
    const current = getDocBuild()
    if (!current) return
    const latest = await fetchBuild()
    if (latest && latest !== current) {
      // Hay build nuevo: fuerza update del SW y deja que controllerchange recargue
      await forceSWUpdate()
    }
  }

  // 1) Ráfaga corta al abrir (mejora iOS)
  const start = Date.now()
  const burst = setInterval(async () => {
    await checkAndUpdate()
    if (Date.now() - start > 25_000) clearInterval(burst)
  }, 5000)

  // 2) Al volver a primer plano y al volver internet
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkAndUpdate()
  })
  window.addEventListener('online', () => checkAndUpdate())
})
