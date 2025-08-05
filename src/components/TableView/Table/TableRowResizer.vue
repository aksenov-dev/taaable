<script setup lang="ts">
import { computed } from 'vue'

import type { Row } from '@/shared/types'

import { createDoubleClickHandler } from '@/shared/utils'

interface Props {
  rowNumber: string
  row: Row
  position: number
  tableScrollLeft: number
  rulerVisible: boolean
}

const emit = defineEmits<{
  mousedown: [rowNumber: string, rowHeight: number, offsetTop: number]
  dblclick: [rowNumber: string]
}>()

const { rowNumber, row, position, tableScrollLeft, rulerVisible } = defineProps<Props>()

const onResizerMousedown = createDoubleClickHandler(
  () => emit('dblclick', rowNumber),
  () => emit('mousedown', rowNumber, row.height, row.offsetTop)
)

const style = computed(() => ({
  top: `${rulerVisible ? position : row.offsetTop}px`,
  left: `${tableScrollLeft}px`
}))
</script>

<template>
  <div
    class="group absolute z-5 h-2.25 -translate-y-1.25"
    :class="[rulerVisible ? 'w-full' : 'w-11']"
    :style="style"
  >
    <div
      class="absolute left-3.5 z-5 h-2.25 w-4 cursor-row-resize opacity-0 group-hover:opacity-100"
      :class="{ 'opacity-100': rulerVisible }"
      @mousedown="onResizerMousedown"
    >
      <div class="bg-gray-5 absolute h-0.75 w-full rounded-xs"></div>
      <div class="bg-gray-5 absolute top-1.5 h-0.75 w-full rounded-xs"></div>
    </div>

    <div
      v-if="rulerVisible"
      class="bg-gray-3 absolute top-0.75 h-0.75 w-full z-5"
    ></div>
  </div>
</template>
