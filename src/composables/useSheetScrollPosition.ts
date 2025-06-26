import { watch } from 'vue'

import type { Ref } from 'vue'

import { useSheetsStore } from '@/stores/sheets'

interface ScrollPosition {
  top: number
  left: number
}

const scrollPositions: Record<string, ScrollPosition> = {}

export const useSheetScrollPosition = (containerRef: Ref<HTMLDivElement | null>) => {
  const sheetsStore = useSheetsStore()

  const saveScroll = (sheetId: string | null): void => {
    if (sheetId && containerRef.value) {
      scrollPositions[sheetId] = { top: containerRef.value.scrollTop, left: containerRef.value.scrollLeft }
    }
  }

  const restoreScroll = (sheetId: string | null): void => {
    if (containerRef.value) {
      let newScrollPosition = { top: 0, left: 0 }

      if (sheetId && sheetId in scrollPositions) {
        newScrollPosition = { top: scrollPositions[sheetId].top, left: scrollPositions[sheetId].left }
      }

      containerRef.value.scrollTo(newScrollPosition)
    }
  }

  watch(() => sheetsStore.currentSheetId, (newSheetId, oldSheetId) => {
    saveScroll(oldSheetId)
    restoreScroll(newSheetId)
  })
}
