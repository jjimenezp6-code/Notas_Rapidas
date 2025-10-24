// composables/useToasts.ts
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'
export interface ToastAction {
  label: string
  run: () => void | Promise<void>
}
export interface Toast {
  id: number
  type: ToastType
  message: string
  action?: ToastAction
}

const toasts = ref<Toast[]>([])
let counter = 0

export function useToasts() {
  const push = (
    message: string,
    type: ToastType = 'info',
    duration = 2500,
    action?: ToastAction
  ) => {
    const id = ++counter
    toasts.value.push({ id, type, message, action })
    if (duration > 0) {
      window.setTimeout(() => remove(id), duration)
    }
  }

  const remove = (id: number) => {
    const i = toasts.value.findIndex(t => t.id === id)
    if (i !== -1) toasts.value.splice(i, 1)
  }

  return { toasts, push, remove }
}
