<script setup lang="ts">
import type { Cell } from '@/shared/types'

const { cell, isActive, isEditing, isInSelection, colSpan = 1, rowSpan = 1 } = defineProps<{
  cell: Cell
  isActive: boolean
  isEditing: boolean
  isInSelection: boolean
  colSpan?: number
  rowSpan?: number
}>()

const emit = defineEmits<{
  dblclick: [event: MouseEvent]
  mousedown: [event: MouseEvent]
}>()
</script>

<template>
  <div
    role="gridcell"
    :data-cell-id="cell.cellId"
    class="cell"
    :class="{
      'cell--active': isActive,
      'cell--fill-handle': isActive && !isEditing && !isInSelection,
      'cell--selected': isInSelection,
    }"
    :style="{
      gridColumn: `span ${colSpan}`,
      gridRow: `span ${rowSpan}`,
    }"
    @dblclick="event => emit('dblclick', event)"
    @mousedown="event => emit('mousedown', event)"
    v-html="cell.value"
  />
</template>

<style scoped>
@reference '@/index.css';

.cell {
  @apply font-roboto text-small border-gray-3 flex cursor-default items-start justify-start
  truncate overflow-hidden border-r border-b bg-white p-1 leading-3.75 text-black
  select-none focus:cursor-text dark:bg-black dark:text-white;
}

.cell--active {
  @apply outline-accent-1 outline-2 -outline-offset-1 rounded-xs z-1 relative overflow-visible;
}

.cell--fill-handle::after {
  @apply content-[''] absolute size-2 rounded-full bg-accent-1 ring-[1px] ring-(--fill-handle-ring)
  -bottom-1 -right-1 z-10 cursor-crosshair;
}

.cell--selected {
  @apply bg-gray-1;
}
</style>
