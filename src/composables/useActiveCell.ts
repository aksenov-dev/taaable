import { ref } from 'vue'

type ActiveCell = string

const DEFAULT_CELL_ID = 'A:1'
const activeCells = ref<Record<string, ActiveCell>>({})

export const useActiveCell = () => {
  const setActiveCell = (sheetId: string, cellId: ActiveCell): void => {
    activeCells.value[sheetId] = cellId
  }

  const getActiveCell = (sheetId?: string | null): ActiveCell => {
    if (!sheetId) return DEFAULT_CELL_ID

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
    resetAllActiveCells
  }
}
