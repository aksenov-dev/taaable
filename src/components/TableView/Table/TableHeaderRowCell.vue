<script setup lang="ts">
import type { Row } from '@/shared/types'

import { CELL_SIZE } from '@/shared/constants'

interface Props {
  rowNumber: string
  row: Row
  isActive: boolean
}

const { rowNumber, row, isActive } = defineProps<Props>()
</script>

<template>
  <div
    role="rowheader"
    class="text-small border-gray-3 sticky left-0 z-2 flex cursor-default items-center justify-center border-r border-b
    select-none"
    :class="{
      'bg-gray-2 text-black dark:text-white': isActive,
      'text-gray-5 bg-gray-1': !isActive
    }"
    :style="{ minHeight: `${CELL_SIZE.MIN.HEIGHT}px`, height: `${row.height}px` }"
  >
    {{ rowNumber }}
  </div>
</template>
