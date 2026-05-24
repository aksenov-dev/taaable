<script setup lang="ts">
import { ref, watchEffect } from 'vue'

const { tableContainer, startCellId, endCellId } = defineProps<{
  tableContainer: HTMLElement | null
  startCellId: string | null
  endCellId: string | null
}>()

const overlayStyle = ref<Record<string, string> | null>(null)

watchEffect(() => {
  if (!tableContainer || !startCellId || !endCellId) {
    overlayStyle.value = null
    return
  }

  const anchorEl = tableContainer.querySelector(`[data-cell-id="${startCellId}"]`)
  const activeEl = tableContainer.querySelector(`[data-cell-id="${endCellId}"]`)

  if (!anchorEl || !activeEl) {
    overlayStyle.value = null
    return
  }

  const containerRect = tableContainer.getBoundingClientRect()
  const anchorRect = anchorEl.getBoundingClientRect()
  const activeRect = activeEl.getBoundingClientRect()

  const top = Math.min(anchorRect.top, activeRect.top) - containerRect.top + tableContainer.scrollTop
  const left = Math.min(anchorRect.left, activeRect.left) - containerRect.left + tableContainer.scrollLeft
  const width = Math.max(anchorRect.right, activeRect.right) - Math.min(anchorRect.left, activeRect.left)
  const height = Math.max(anchorRect.bottom, activeRect.bottom) - Math.min(anchorRect.top, activeRect.top)

  overlayStyle.value = {
    top: `${top - 1}px`,
    left: `${left - 1}px`,
    width: `${width + 1}px`,
    height: `${height + 1}px`,
  }
}, { flush: 'post' }) // run after DOM update so querySelector sees the new cells
</script>

<template>
  <div
    v-if="overlayStyle && endCellId && startCellId !== endCellId"
    class="selection-overlay"
    :style="overlayStyle"
  />
</template>

<style scoped>
@reference '@/index.css';

.selection-overlay {
  @apply absolute pointer-events-none border border-accent-1 z-2 rounded-xs;
}

.selection-overlay:after {
  @apply content-[''] absolute size-2 rounded-full bg-accent-1 ring-[1px] ring-(--fill-handle-ring)
  -bottom-1 -right-1 z-10 cursor-crosshair pointer-events-auto;
}
</style>
