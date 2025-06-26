<script setup lang="ts">
import type { Column } from '@/shared/types'

import { CELL_SIZE } from '@/shared/constants'

interface Props {
  columnLetter: string
  column: Column
  isActive: boolean
}

const { columnLetter, column, isActive } = defineProps<Props>()
</script>

<template>
  <div
    role="columnheader"
    class="text-small border-gray-3 sticky top-0 z-3 flex cursor-default items-center justify-center border-r border-b
    select-none"
    :class="{
      'bg-gray-2 text-black dark:text-white': isActive,
      'text-gray-5 bg-gray-1': !isActive
    }"
    :style="{ minWidth: `${CELL_SIZE.MIN.WIDTH}px`, width: `${column.width}px` }"
  >
    {{ columnLetter }}
  </div>
</template>
