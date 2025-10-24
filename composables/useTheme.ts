// composables/useTheme.ts
import { ref, onMounted } from 'vue'

const isDark = ref(false)
let initialized = false

function apply(dark: boolean) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (dark) root.classList.add('dark')
  else root.classList.remove('dark')
}

export function useTheme() {
  const setTheme = (dark: boolean) => {
    isDark.value = dark
    apply(dark)
    try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch {}
  }

  const toggleTheme = () => setTheme(!isDark.value)

  const initTheme = () => {
    if (initialized) return
    initialized = true
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'dark') setTheme(true)
      else if (saved === 'light') setTheme(false)
      else setTheme(!!window.matchMedia?.('(prefers-color-scheme: dark)')?.matches)
    } catch {
      setTheme(!!window.matchMedia?.('(prefers-color-scheme: dark)')?.matches)
    }
  }

  onMounted(initTheme)
  return { isDark, setTheme, toggleTheme, initTheme }
}
