<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef } from 'vue'

import { handleEditableCellKeydown, placeCursorAtEnd, sanitizeHtml } from '@/shared/utils'
import { useTableWidth } from '@/composables/useTableWidth'
import { useCellEditing } from '@/composables/useCellEditing'
import { useSheetsDataStore } from '@/stores/sheetsData'

interface Props {
  tableContainer: HTMLDivElement | null
}

const emit = defineEmits<{
  keydown: [e: KeyboardEvent]
  blur: [e: FocusEvent, cellId: string, value: string]
}>()

const { tableContainer } = defineProps<Props>()

const { tableWidth } = useTableWidth(tableContainer)
const { editingCellId, initialInput, cellEditorPosition } = useCellEditing()

const sheetsDataStore = useSheetsDataStore()

const editorRef = useTemplateRef('editorRef')
const editorValue = ref('')

const cellId = editingCellId.value

const style = computed(() => {
  let maxWidth = 'auto'

  if (tableContainer && editorRef.value) {
    const tableRect = tableContainer.getBoundingClientRect()
    const editorRect = editorRef.value.getBoundingClientRect()

    const rightEdgeOfTable = tableRect.left + tableWidth.value
    const leftEdgeOfEditor = editorRect.left

    maxWidth = `${rightEdgeOfTable - leftEdgeOfEditor}px`
  }

  return {
    top: `${cellEditorPosition.value.top}px`,
    left: `${cellEditorPosition.value.left}px`,
    minWidth: `${cellEditorPosition.value.width}px`,
    minHeight: `${cellEditorPosition.value.height}px`,
    maxWidth
  }
})

const handleInput = () => {
  if (!editorRef.value) return

  if (editorRef.value.textContent?.startsWith('\u200B')) {
    editorRef.value.innerHTML = editorRef.value.innerHTML.replace('\u200B', '')
    placeCursorAtEnd(editorRef.value)
  }

  editorValue.value = sanitizeHtml(editorRef.value.innerHTML) || ''
}

onMounted(async () => {
  await nextTick()

  if (!editorRef.value) return

  const initialHtml = initialInput.value ?? String(sheetsDataStore.currentCell?.value)

  editorRef.value.innerHTML = initialHtml || '\u200B'
  editorValue.value = initialHtml || ''

  editorRef.value.focus()
  placeCursorAtEnd(editorRef.value)
})
</script>

<template>
  <div
    ref="editorRef"
    contenteditable
    class="text-small border-gray-3 outline-accent-1 absolute z-1 cursor-default justify-start
    rounded-xs border-r border-b bg-white p-1 leading-3.75 text-black outline-2 -outline-offset-1
    focus:cursor-text dark:bg-black dark:text-white"
    :style="style"
    @keydown="handleEditableCellKeydown"
    @blur="event => emit('blur', event, cellId!, editorValue)"
    @input="handleInput"
  ></div>
</template>
