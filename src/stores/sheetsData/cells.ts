import { computed } from 'vue'
import { defineStore } from 'pinia'

import type { CellStyle, TextFormatKey } from '@/shared/types'

import { parseCellId, toCellDto } from '@/shared/utils'

import { createCellStorage } from '@/db/cellStorage'
import { useSheetsStore } from '@/stores/sheets'
import { useSheetsDataStore } from '@/stores/sheetsData'
import { useSheetsDataRowsStore } from '@/stores/sheetsData/rows'
import { useActiveCell } from '@/composables/useActiveCell'
import { useSelection } from '@/composables/useSelection'

export const useSheetsDataCellsStore = defineStore('sheetsDataCells', () => {
  const { getActiveCell } = useActiveCell()
  const { getSelectedCellIds, hasSelection } = useSelection()

  const sheetsStore = useSheetsStore()
  const sheetsDataStore = useSheetsDataStore()
  const sheetsDataRowsStore = useSheetsDataRowsStore()

  const cellStorage = createCellStorage()

  const currentCell = computed(() => {
    if (!sheetsDataStore.currentSheetData)
      return

    return sheetsDataStore.currentSheetData.cells[getActiveCell(sheetsStore.currentSheetId)]
  })

  const selectionCellIds = computed(() => {
    const sheetId = sheetsStore.currentSheetId
    if (!sheetId || !sheetsDataStore.currentSheetData)
      return []

    if (hasSelection(sheetId)) {
      const currentSheetData = sheetsDataStore.currentSheetData
      return getSelectedCellIds(sheetId, currentSheetData.columnOrder, currentSheetData.rowOrder)
    }

    return currentCell.value ? [currentCell.value.cellId] : []
  })

  const isAllBold = computed(() => hasStyleForAll('bold'))
  const isAllItalic = computed(() => hasStyleForAll('italic'))
  const isAllStrikethrough = computed(() => hasStyleForAll('strikethrough'))

  function hasStyleForAll(key: TextFormatKey): boolean {
    if (!selectionCellIds.value.length)
      return false

    return selectionCellIds.value.every(id => Boolean(sheetsDataStore.currentSheetData?.cells[id]?.style[key]))
  }

  async function setCellStyle(cellId: string, style: Partial<CellStyle>): Promise<void> {
    if (!sheetsDataStore.currentSheetData)
      return

    const cell = sheetsDataStore.currentSheetData.cells[cellId]
    if (!cell)
      return

    Object.assign(cell.style, style)
    await cellStorage.saveCell(toCellDto(cell))
  }

  async function toggleSelectionStyle(key: TextFormatKey): Promise<void> {
    if (!sheetsDataStore.currentSheetData)
      return

    const cellIds = selectionCellIds.value
    const allHave = cellIds.every(id => Boolean(sheetsDataStore.currentSheetData?.cells[id]?.style[key]))

    await Promise.all(cellIds.map(id => setCellStyle(id, { [key]: !allHave })))
  }

  async function updateCellValue(cellId: string, value: string): Promise<void> {
    if (!sheetsDataStore.currentSheetData)
      return

    const currentCell = sheetsDataStore.currentSheetData.cells[cellId]
    if (!currentCell)
      return

    currentCell.value = value
    await cellStorage.saveCell(toCellDto(currentCell))

    const { rowNumber } = parseCellId(cellId)

    const row = sheetsDataStore.currentSheetData.rows[parseCellId(cellId).rowNumber]
    if (!row)
      return

    if (row.isAutoHeight) {
      await sheetsDataRowsStore.setRowHeight(rowNumber, { auto: true })
    }
  }

  return {
    currentCell,
    isAllBold,
    isAllItalic,
    isAllStrikethrough,
    toggleSelectionStyle,
    updateCellValue,
  }
})
