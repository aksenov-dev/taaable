import { onBeforeUnmount, readonly, ref } from 'vue'
import type { Ref } from 'vue'

import type { useResizeRuler } from '@/composables/useResizeRuler'
import { CELL_SIZE } from '@/shared/constants'

import { createResizeMask, removeResizeMask } from '@/shared/utils'

import { useSheetsDataColumnsStore } from '@/stores/sheetsData/columns'

export function useColumnResize(resizeRuler: ReturnType<typeof useResizeRuler>, tableRef: Ref<HTMLElement | null>) {
  const sheetsDataColumnsStore = useSheetsDataColumnsStore()

  let startX = 0
  let startWidth = 0
  const resizingColumnLetter = ref<string | null>(null)

  function startColumnResize(columnLetter: string, columnWidth: number): void {
    if (!tableRef.value)
      return

    const columnEl = tableRef.value.querySelector(`[data-column-letter="${columnLetter}"]`) as HTMLElement

    if (!columnEl)
      return

    const columnRect = columnEl.getBoundingClientRect()

    startX = columnRect.right + tableRef.value.scrollLeft
    startWidth = columnWidth
    resizingColumnLetter.value = columnLetter

    createResizeMask('column')
    resizeRuler.show(startX)

    window.addEventListener('mousemove', onColumnResize)
    window.addEventListener('mouseup', stopColumnResize)
  }

  function onColumnResize(event: MouseEvent): void {
    if (!tableRef.value || !resizingColumnLetter.value)
      return

    const relativeMouseX = event.clientX + tableRef.value.scrollLeft
    const maxRelativeX = tableRef.value.clientWidth + tableRef.value.scrollLeft
    const clampedX = Math.min(relativeMouseX, maxRelativeX)

    const dx = clampedX - startX
    const newWidth = startWidth + dx

    if (newWidth >= CELL_SIZE.MIN.WIDTH) {
      resizeRuler.show(startX + dx)
    }
  }

  async function stopColumnResize(): Promise<void> {
    if (!tableRef.value || !resizingColumnLetter.value)
      return

    const finalX = resizeRuler.resizeRulerPosition.value
    const delta = finalX - startX
    const finalWidth = startWidth + delta

    if (finalWidth >= CELL_SIZE.MIN.WIDTH) {
      await sheetsDataColumnsStore.updateColumnWidth(resizingColumnLetter.value, finalWidth)
    }

    window.removeEventListener('mousemove', onColumnResize)
    window.removeEventListener('mouseup', stopColumnResize)

    removeResizeMask()
    resizeRuler.hide()

    resizingColumnLetter.value = null
  }

  onBeforeUnmount(stopColumnResize)

  return {
    resizingColumnLetter: readonly(resizingColumnLetter),
    startColumnResize,
  }
}
