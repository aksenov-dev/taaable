import { ref, watch } from 'vue'
import type { ComputedRef, Ref } from 'vue'

import type { SelectionRange } from '@/shared/types'

export function useSelectionOverlayStyles(
  tableContainer: Ref<HTMLElement | null>,
  selectionRanges: ComputedRef<SelectionRange[]>,
  gridTemplateColumns: ComputedRef<string>,
  gridTemplateRows: ComputedRef<string>,
  coveredToAnchorMap: ComputedRef<Record<string, string>>,
  rowHeightsKey: ComputedRef<string>,
) {
  const overlayStyles = ref<(Record<string, string> | null)[]>([])

  watch(
    [tableContainer, selectionRanges, gridTemplateColumns, gridTemplateRows, coveredToAnchorMap, rowHeightsKey],
    () => {
      const container = tableContainer.value
      const ranges = selectionRanges.value

      if (!container) {
        overlayStyles.value = []
        return
      }

      overlayStyles.value = ranges.map(({ startId, endId }) => {
        const resolvedStartId = coveredToAnchorMap.value[startId] ?? startId
        const resolvedEndId = coveredToAnchorMap.value[endId] ?? endId

        const anchorEl = container.querySelector(`[data-cell-id="${resolvedStartId}"]`)
        const activeEl = container.querySelector(`[data-cell-id="${resolvedEndId}"]`)

        if (!anchorEl || !activeEl)
          return null

        const containerRect = container.getBoundingClientRect()
        const anchorRect = anchorEl.getBoundingClientRect()
        const activeRect = activeEl.getBoundingClientRect()

        const top = Math.min(anchorRect.top, activeRect.top) - containerRect.top + container.scrollTop
        const left = Math.min(anchorRect.left, activeRect.left) - containerRect.left + container.scrollLeft
        const width = Math.max(anchorRect.right, activeRect.right) - Math.min(anchorRect.left, activeRect.left)
        const height = Math.max(anchorRect.bottom, activeRect.bottom) - Math.min(anchorRect.top, activeRect.top)

        return {
          top: `${top - 1}px`,
          left: `${left - 1}px`,
          width: `${width + 1}px`,
          height: `${height + 1}px`,
        }
      })
    },
    { flush: 'post', immediate: true },
  )

  return { overlayStyles }
}
