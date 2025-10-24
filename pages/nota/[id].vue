<template>
  <div :key="normalizedId" class="space-y-4">
    <div class="flex items-center gap-2">
      <NuxtLink to="/" class="btn btn-ghost">← Volver</NuxtLink>
      <div class="ml-auto flex items-center gap-2">
        <button @click="save" class="btn btn-primary" :disabled="saving">Guardar</button>
        <button v-if="normalizedId !== 'new'" @click="confirmOpen = true" class="btn btn-danger">Eliminar</button>
      </div>
    </div>

    <input
      v-model="title"
      type="text"
      placeholder="Título"
      class="input w-full text-2xl font-semibold"
    />
    <textarea
      v-model="content"
      rows="14"
      placeholder="Escribe tu nota..."
      class="input w-full min-h-[300px]"
    ></textarea>

    <div class="card p-4">
      <h3 class="font-semibold mb-2">Etiquetas</h3>
      <TagInput v-model="tags" />
    </div>

    <ConfirmDialog
      v-model:open="confirmOpen"
      title="Eliminar nota"
      :message="`Esta acción no se puede deshacer. ¿Eliminar la nota «${title || 'Sin título'}»?`"
      confirm-text="Eliminar"
      cancel-text="Cancelar"
      variant="danger"
      @confirm="doDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotesStore, type Note } from '@/stores/notes'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import TagInput from '@/components/TagInput.vue'
import { useToasts } from '@/composables/useToasts'

const route = useRoute()
const router = useRouter()
const store = useNotesStore()
const { push: toast } = useToasts()

const normalizedId = computed(() => {
  const p = route.params.id as string | string[] | undefined
  return Array.isArray(p) ? p[0] : (p ?? 'new')
})

const title = ref('')
const content = ref('')
const tags = ref<string[]>([])
const confirmOpen = ref(false)
const saving = ref(false)

function resetForm() { title.value = ''; content.value = ''; tags.value = [] }

let loadToken = 0
async function loadExisting(id: string) {
  const my = ++loadToken
  resetForm()
  if (!store.loaded) await store.load()
  if (my !== loadToken) return
  const n = await store.get(id)
  if (my !== loadToken) return
  if (!n) { await router.push('/'); return }
  title.value = n.title || ''
  content.value = n.content || ''
  tags.value = n.tags || []
}

watch(
  normalizedId,
  (id) => { loadToken++; id === 'new' ? resetForm() : loadExisting(id) },
  { immediate: true }
)

const save = async () => {
  if (saving.value) return
  saving.value = true
  try {
    if (normalizedId.value === 'new') {
      const created: string | Note = await store.add(title.value, content.value)
      const newId = typeof created === 'string' ? created : created.id
      if (tags.value.length) await store.update(newId, { tags: tags.value })
      toast('Nota creada', 'success')
      await router.push('/')
    } else {
      await store.update(normalizedId.value, {
        title: title.value,
        content: content.value,
        tags: tags.value
      })
      toast('Cambios guardados', 'success')
      await router.push('/')
    }
  } catch (e) {
    console.error(e)
    toast('No se pudo guardar la nota', 'error')
  } finally {
    saving.value = false
  }
}

const doDelete = async () => {
  try {
    if (normalizedId.value === 'new') return

    // ✅ Snapshot de la nota antes de eliminar (para poder restaurar)
    const snap = {
      title: title.value,
      content: content.value,
      tags: [...tags.value],
    }

    await store.remove(normalizedId.value)

    // ✅ Toast rojo con opción de Deshacer
    toast('Nota eliminada', 'error', 5000, {
      label: 'Deshacer',
      run: async () => {
        const created: string | Note = await store.add(snap.title || '', snap.content || '')
        const newId = typeof created === 'string' ? created : created.id
        if (snap.tags?.length) {
          await store.update(newId, { tags: snap.tags })
        }
      },
    })

    await router.push('/')
  } catch (e) {
    console.error(e)
    toast('No se pudo eliminar la nota', 'error')
  }
}
</script>
