// composables/useInstallPrompt.ts
import { ref, onMounted, onBeforeUnmount } from 'vue'

type BIPEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export function useInstallPrompt() {
  const canInstall = ref(false)   // hay beforeinstallprompt disponible
  const showBanner = ref(false)   // mostrar la banda (solo desktop)
  let deferredPrompt: BIPEvent | null = null

  const isStandalone = () =>
    window.matchMedia?.('(display-mode: standalone)')?.matches ||
    (navigator as any).standalone === true

  const isIos = () => /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isAndroid = () => /android/i.test(navigator.userAgent)
  const isMobileUA = () => /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
  const isDesktop = () => !isMobileUA()

  const onBeforeInstallPrompt = (e: Event) => {
    e.preventDefault()
    if (!isDesktop()) return // solo PC
    deferredPrompt = e as BIPEvent
    canInstall.value = true
    showBanner.value = true
  }

  const onAppInstalled = () => {
    canInstall.value = false
    showBanner.value = false
    deferredPrompt = null
  }

  const install = async () => {
    if (!deferredPrompt) return false
    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      deferredPrompt = null
      showBanner.value = false
      canInstall.value = false
      return outcome === 'accepted'
    } catch {
      showBanner.value = false
      canInstall.value = false
      return false
    }
  }

  const dismiss = () => {
    showBanner.value = false
  }

  const recheck = () => {
    // sin forzar; el banner aparece cuando Chrome emite el evento
  }

  onMounted(() => {
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onAppInstalled)
    document.addEventListener('visibilitychange', recheck)
    window.addEventListener('focus', recheck)

    // En móviles, no mostramos banner
    if (isIos() || isAndroid()) {
      showBanner.value = false
      canInstall.value = false
    }
  })

  onBeforeUnmount(() => {
    window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt as any)
    window.removeEventListener('appinstalled', onAppInstalled)
    document.removeEventListener('visibilitychange', recheck)
    window.removeEventListener('focus', recheck)
  })

  return { canInstall, showBanner, install, dismiss, isStandalone }
}
