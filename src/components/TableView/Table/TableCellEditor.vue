<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef } from 'vue'

import { handleEditableCellKeydown, placeCursorAtEnd, sanitizeHtml } from '@/shared/utils'

import { useSheetsDataCellsStore } from '@/stores/sheetsData/cells'
import { useCellEditing } from '@/composables/useCellEditing'
import { useTableWidth } from '@/composables/useTableWidth'

interface Props {
  tableContainer: HTMLDivElement | null
}

const { tableContainer } = defineProps<Props>()

const emit = defineEmits<{
  keydown: [e: KeyboardEvent]
  blur: [e: FocusEvent, cellId: string, value: string]
}>()

const { tableWidth } = useTableWidth(tableContainer)
const { editingCellId, initialInput, cellEditorPosition } = useCellEditing()

const sheetsDataCellsStore = useSheetsDataCellsStore()

const editorRef = useTemplateRef('editorRef')
const editorValue = ref('')

const cellId = editingCellId.value

const style = computed(() => {
  if (!tableContainer || !editorRef.value)
    return

  const tableRect = tableContainer.getBoundingClientRect()
  const editorRect = editorRef.value.getBoundingClientRect()

  const rightEdgeOfTable = tableRect.left + tableWidth.value
  const leftEdgeOfEditor = editorRect.left

  return {
    top: `${cellEditorPosition.value.top - tableRect.top + tableContainer.scrollTop - 1}px`,
    left: `${cellEditorPosition.value.left - tableRect.left + tableContainer.scrollLeft}px`,
    minWidth: `${cellEditorPosition.value.width}px`,
    minHeight: `${cellEditorPosition.value.height}px`,
    maxWidth: `${rightEdgeOfTable - leftEdgeOfEditor}px`,
  }
})

function handleInput() {
  if (!editorRef.value)
    return

  if (editorRef.value.textContent?.startsWith('\u200B')) {
    editorRef.value.innerHTML = editorRef.value.innerHTML.replace('\u200B', '')
    placeCursorAtEnd(editorRef.value)
  }

  editorValue.value = sanitizeHtml(editorRef.value.innerHTML) || ''
}

onMounted(async () => {
  await nextTick()

  if (!editorRef.value)
    return

  const initialHtml = initialInput.value ?? String(sheetsDataCellsStore.currentCell?.value)
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
    class="text-small border-gray-3 outline-accent-1 absolute z-1 cursor-default justify-start rounded-xs border-r
    border-b bg-white p-1 leading-3.75 text-black outline-2 -outline-offset-1 focus:cursor-text dark:bg-black
    dark:text-white"
    :style="style"
    @keydown="handleEditableCellKeydown"
    @blur="event => emit('blur', event, cellId!, editorValue)"
    @input="handleInput"
  />
</template>
