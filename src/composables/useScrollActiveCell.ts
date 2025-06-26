import { watch } from 'vue'

import type { Ref } from 'vue'

import { CELL_SIZE } from '@/shared/constants'
import { useActiveCell } from '@/composables/useActiveCell'
import { useSheetsStore } from '@/stores/sheets'

export function useScrollActiveCell(containerRef: Ref<HTMLDivElement | null>) {
  const sheetsStore = useSheetsStore()
  const { getActiveCell } = useActiveCell()

  watch(() => getActiveCell(sheetsStore.currentSheetId), async newCellId => {
    if (!sheetsStore.currentSheetId) return

    const container = containerRef.value
    if (!container || !container.contains(document.activeElement)) return

    const cellElement = container.querySelector<HTMLDivElement>(`[data-cell-id="${newCellId}"]`)
    if (!cellElement) return

    const containerRect = container.getBoundingClientRect()
    const cellRect = cellElement.getBoundingClientRect()

    const topOffset = CELL_SIZE.DEFAULT.HEIGHT + 1
    const leftOffset = CELL_SIZE.DEFAULT.WIDTH + 1

    const cellTop = cellRect.top - containerRect.top + container.scrollTop
    const cellBottom = cellTop + cellRect.height
    const cellLeft = cellRect.left - containerRect.left + container.scrollLeft
    const cellRight = cellLeft + cellRect.width

    const visibleTop = container.scrollTop + topOffset
    const visibleBottom = container.scrollTop + container.clientHeight
    const visibleLeft = container.scrollLeft + leftOffset
    const visibleRight = container.scrollLeft + container.clientWidth

    const cellIsAbove = cellTop < visibleTop
    const cellIsBelow = cellBottom > visibleBottom
    const cellIsLeft = cellLeft < visibleLeft
    const cellIsRight = cellRight > visibleRight

    if (cellIsAbove || cellIsBelow) {
      container.scrollTo({ top: cellIsAbove ? cellTop - topOffset : cellBottom - container.clientHeight })
    }

    if (cellIsLeft || cellIsRight) {
      container.scrollTo({ left: cellIsLeft ? cellLeft - leftOffset : cellRight - container.clientWidth })
    }
  })
}
