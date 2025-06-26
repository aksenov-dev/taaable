<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from 'vue'

import type { Cell } from '@/shared/types'

interface Props {
  cell: Cell
  isActive: boolean
  isEditing: boolean
}

const emit = defineEmits<{
  mousedown: []
  dblclick: []
  blur: []
}>()

const { cell, isActive, isEditing } = defineProps<Props>()

const cellRef = useTemplateRef('cell')

watch(() => isEditing, async editing => {
    if (editing) {
      await nextTick()
      cellRef.value?.focus()
    }
  }
)
</script>

<template>
  <div
    ref="cell"
    role="gridcell"
    :data-cell-id="cell.cellId"
    :contenteditable="isEditing"
    class="border-gray-3 text-small flex cursor-default items-center justify-start overflow-hidden border-r border-b
    bg-white p-1 leading-3.75 text-black focus:cursor-text dark:bg-black dark:text-white"
    :class="{ 'outline-accent-1 z-1 rounded-xs outline-2 -outline-offset-1': isActive }"
    @mousedown="emit('mousedown')"
    @dblclick="emit('dblclick')"
    @blur="emit('blur')"
  >
  </div>
</template>
