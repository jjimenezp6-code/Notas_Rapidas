<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        @click.self="onCancel"
      />
    </transition>

    <transition name="pop">
      <div
        v-if="open"
        class="fixed inset-0 z-50 grid place-items-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="descId"
      >
        <div class="w-full max-w-md rounded-2xl bg-white shadow-xl ring-1 ring-neutral-200">
          <div class="px-5 pt-5">
            <h3 :id="titleId" class="text-lg font-semibold text-neutral-900">
              {{ title }}
            </h3>
            <p :id="descId" class="mt-1 text-neutral-600">
              {{ message }}
            </p>
          </div>

          <div class="mt-5 flex items-center justify-end gap-2 px-5 pb-5">
            <button
              type="button"
              class="rounded-xl border border-neutral-300 px-4 py-2 text-neutral-700 hover:bg-neutral-50"
              @click="onCancel"
            >
              {{ cancelText }}
            </button>

            <button
              type="button"
              class="rounded-xl px-4 py-2 text-white hover:opacity-90"
              :class="confirmClass"
              @click="onConfirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'primary'
}>(), {
  title: 'Confirmar acción',
  message: '¿Estás seguro?',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  variant: 'danger'
})

const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const titleId = `dialog-title-${Math.random().toString(36).slice(2)}`
const descId = `dialog-desc-${Math.random().toString(36).slice(2)}`

const confirmClass = computed(() =>
  props.variant === 'danger' ? 'bg-red-600' : 'bg-brand-500'
)

const onCancel = () => {
  emit('update:open', false)
  emit('cancel')
}

const onConfirm = () => {
  emit('update:open', false)
  emit('confirm')
}

onMounted(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.open) onCancel()
  }
  window.addEventListener('keydown', onKey)
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.pop-enter-active, .pop-leave-active { transition: all .18s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateY(6px) scale(.98); }
</style>
