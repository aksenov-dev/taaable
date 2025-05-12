<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  row: number
  col: number
}

const { row, col } = defineProps<Props>()

// ToDo: just for test
// click - set active cell
// dblclick - set editable cell
const isActiveCell = computed(() => row === 2 && col === 2)
</script>

<template>
  <div
    role="gridcell"
    :contenteditable="false"
    class="border-gray-3 text-small flex h-6 min-h-6 w-25 min-w-7 cursor-default items-center justify-start
    overflow-hidden border-r border-b bg-white p-1 text-black focus:cursor-text dark:bg-black dark:text-white"
    :class="{ 'outline-accent-1 z-1 rounded-xs outline-2 -outline-offset-1': isActiveCell }"
  >
    <!--    {{ `${col}:${row}` }}-->
  </div>
</template>
