import { computed } from 'vue'
import { defineStore } from 'pinia'

import { parseCellId, toCellDto } from '@/shared/utils'
import { useSheetsStore } from '@/stores/sheets'
import { useActiveCell } from '@/composables/useActiveCell'
import { useSheetsDataStore } from '@/stores/sheetsData'
import { useSheetsDataRowsStore } from '@/stores/sheetsData/rows'
import { createCellStorage } from '@/db/cellStorage'

export const useSheetsDataCellsStore = defineStore('sheetsDataCells', () => {
  const { getActiveCell } = useActiveCell()
  const sheetsStore = useSheetsStore()
  const sheetsDataStore = useSheetsDataStore()
  const sheetsDataRowsStore = useSheetsDataRowsStore()
  const cellStorage = createCellStorage()

  const currentCell = computed(() => {
    if (!sheetsDataStore.currentSheetData) return
    return sheetsDataStore.currentSheetData.cells[getActiveCell(sheetsStore.currentSheetId)]
  })

  const updateCellValue = async (cellId: string, value: string): Promise<void> => {
    if (!sheetsDataStore.currentSheetData) return

    const currentCell = sheetsDataStore.currentSheetData.cells[cellId]
    if (!currentCell) return

    currentCell.value = value
    await cellStorage.saveCell(toCellDto(currentCell))

    const { rowNumber } = parseCellId(cellId)

    const row = sheetsDataStore.currentSheetData.rows[parseCellId(cellId).rowNumber]
    if (!row) return

    if (row.isAutoHeight) {
      await sheetsDataRowsStore.setRowHeight(rowNumber, { auto: true })
    }
  }

  return {
    currentCell,
    updateCellValue
  }
})
