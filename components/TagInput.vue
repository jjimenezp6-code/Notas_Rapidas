<template>
  <div class="space-y-2">
    <div class="flex gap-2 flex-wrap">
      <span v-for="(t, i) in modelValue" :key="t + i" class="chip">
        {{ t }}
        <button class="text-neutral-500" @click="$emit('update:modelValue', modelValue.filter((_, idx) => idx !== i))">✕</button>
      </span>
    </div>
    <input
      v-model="draft"
      class="input w-full"
      placeholder="Escribe una etiqueta y presiona Enter"
      @keydown.enter.prevent="add"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{ modelValue: string[] }>()
const emit = defineEmits(['update:modelValue'])
const draft = ref('')

const add = () => {
  const v = draft.value.trim()
  if (!v) return
  const set = new Set(props.modelValue)
  set.add(v)
  emit('update:modelValue', Array.from(set))
  draft.value = ''
}
</script>
