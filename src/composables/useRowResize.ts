import { onBeforeUnmount, readonly, ref } from 'vue'

import type { Ref } from 'vue'

import { CELL_SIZE } from '@/shared/constants'
import { createResizeMask, removeResizeMask } from '@/shared/utils'
import { useResizeRuler } from '@/composables/useResizeRuler'
import { useSheetsDataRowsStore } from '@/stores/sheetsData/rows'

export const useRowResize = (resizeRuler: ReturnType<typeof useResizeRuler>, tableRef: Ref<HTMLElement | null>) => {
  const sheetsDataRowsStore = useSheetsDataRowsStore()

  let startY = 0
  let startHeight = 0
  const resizingRowNumber = ref<string | null>(null)

  const startRowResize = (rowNumber: string, rowHeight: number): void => {
    if (!tableRef.value) return

    const rowEl = tableRef.value.querySelector(`[data-row-number="${rowNumber}"]`) as HTMLElement
    if (!rowEl) return

    const containerRect = tableRef.value.getBoundingClientRect()
    const rowRect = rowEl.getBoundingClientRect()

    startY = rowRect.bottom - containerRect.top + tableRef.value.scrollTop - 1
    startHeight = rowHeight
    resizingRowNumber.value = rowNumber

    createResizeMask('row')
    resizeRuler.show(startY)

    window.addEventListener('mousemove', onRowResize)
    window.addEventListener('mouseup', stopRowResize)
  }

  const onRowResize = (event: MouseEvent): void => {
    if (!tableRef.value || !resizingRowNumber.value) return

    const containerRect = tableRef.value.getBoundingClientRect()
    const relativeMouseY = event.clientY - containerRect.top + tableRef.value.scrollTop

    const maxRelativeY = tableRef.value.clientHeight + tableRef.value.scrollTop
    const clampedY = Math.min(relativeMouseY, maxRelativeY)

    const dy = clampedY - startY
    const newHeight = startHeight + dy

    if (newHeight >= CELL_SIZE.MIN.HEIGHT) {
      resizeRuler.show(startY + dy)
    }
  }

  const stopRowResize = async (): Promise<void> => {
    if (!tableRef.value || !resizingRowNumber.value) return

    const finalY = resizeRuler.resizeRulerPosition.value
    const delta = finalY - startY
    const finalHeight = startHeight + delta

    if (finalHeight >= CELL_SIZE.MIN.HEIGHT) {
      await sheetsDataRowsStore.updateRowHeight(resizingRowNumber.value, finalHeight)
    }

    window.removeEventListener('mousemove', onRowResize)
    window.removeEventListener('mouseup', stopRowResize)

    removeResizeMask()
    resizeRuler.hide()

    resizingRowNumber.value = null
  }

  onBeforeUnmount(stopRowResize)

  return {
    resizingRowNumber: readonly(resizingRowNumber),
    startRowResize
  }
}
