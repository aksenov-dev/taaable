<script setup lang="ts">
import type { Cell } from '@/shared/types'

interface Props {
  cell: Cell
  isActive: boolean
}

const emit = defineEmits<{
  dblclick: [{ event: MouseEvent; cellId: string }]
  mousedown: []
}>()

const { cell, isActive } = defineProps<Props>()
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    role="gridcell"
    :data-cell-id="cell.cellId"
    class="text-small border-gray-3 flex cursor-default items-center justify-start truncate overflow-hidden border-r
    border-b bg-white p-1 leading-3.75 text-black select-none focus:cursor-text dark:bg-black dark:text-white"
    :class="{ 'outline-accent-1 z-1 rounded-xs outline-2 -outline-offset-1': isActive }"
    @dblclick="event => emit('dblclick', { event, cellId: cell.cellId })"
    @mousedown="emit('mousedown')"
    v-html="cell.value"
  ></div>
</template>
