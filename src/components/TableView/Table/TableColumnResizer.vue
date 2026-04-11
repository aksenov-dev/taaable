<script setup lang="ts">
import { computed } from 'vue'

import type { Column } from '@/shared/types'

import { createDoubleClickHandler } from '@/shared/utils'

interface Props {
  columnLetter: string
  column: Column
  position: number
  rulerVisible: boolean
}

const { columnLetter, column, position, rulerVisible } = defineProps<Props>()

const emit = defineEmits<{
  dblclick: [columnLetter: string]
  mousedown: [columnLetter: string, columnWidth: number, offsetLeft: number]
}>()

const onResizerMousedown = createDoubleClickHandler(
  () => emit('dblclick', columnLetter),
  () => emit('mousedown', columnLetter, column.width, column.offsetLeft),
)

const style = computed(() => ({ left: `${rulerVisible ? position : column.offsetLeft}px` }))
</script>

<template>
  <div
    class="group absolute z-4 w-2.25 -translate-x-1.25"
    :class="[rulerVisible ? 'h-full' : 'h-6']"
    :style="style"
  >
    <div
      class="absolute top-1 z-4 h-3.75 w-2.25 cursor-col-resize opacity-0 group-hover:opacity-100"
      :class="{ 'opacity-100': rulerVisible }"
      @mousedown="onResizerMousedown"
    >
      <div class="bg-gray-5 absolute h-full w-0.75 rounded-xs" />
      <div class="bg-gray-5 absolute left-1.5 h-full w-0.75 rounded-xs" />
    </div>

    <div
      v-if="rulerVisible"
      class="bg-gray-3 absolute left-0.75 z-4 h-full w-0.75"
    />
  </div>
</template>
