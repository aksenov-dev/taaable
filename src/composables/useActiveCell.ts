import { ref } from 'vue'

import { DEFAULT_CELL_ID } from '@/shared/constants/cell.ts'

const activeCells = ref<Record<string, string>>({})

export function useActiveCell() {
  const setActiveCell = (sheetId: string, cellId: string): void => {
    activeCells.value[sheetId] = cellId
  }

  const getActiveCell = (sheetId?: string | null): string => {
    if (!sheetId)
      return DEFAULT_CELL_ID

    if (!(sheetId in activeCells.value)) {
      activeCells.value[sheetId] = DEFAULT_CELL_ID
    }

    return activeCells.value[sheetId]
  }

  const resetActiveCell = (sheetId: string): void => {
    activeCells.value[sheetId] = DEFAULT_CELL_ID
  }

  const resetAllActiveCells = (): void => {
    for (const sheetId in activeCells.value) {
      activeCells.value[sheetId] = DEFAULT_CELL_ID
    }
  }

  return {
    setActiveCell,
    getActiveCell,
    resetActiveCell,
    resetAllActiveCells,
  }
}
