<script setup lang="ts">
import { CELL_SIZE } from '@/shared/constants'

interface Props {
  rowNumber: string
  isActive: boolean
}

const { rowNumber, isActive } = defineProps<Props>()
</script>

<template>
  <div
    role="rowheader"
    :data-row-number="rowNumber"
    class="text-small border-gray-3 sticky left-0 z-2 flex cursor-default items-center justify-center border-r border-b
    select-none"
    :class="{
      'bg-gray-2 text-black dark:text-white': isActive,
      'text-gray-5 bg-gray-1': !isActive
    }"
    :style="{ minHeight: `${CELL_SIZE.MIN.HEIGHT}px` }"
  >
    <span>{{ rowNumber }}</span>
  </div>
</template>
