import { nextTick } from 'vue'
import { defineStore } from 'pinia'

import { CELL_SIZE } from '@/shared/constants'
import { toRowDto } from '@/shared/utils'
import { useSheetsStore } from '@/stores/sheets'
import { useSheetsDataStore } from '@/stores/sheetsData'
import { createRowStorage } from '@/db/rowStorage'

export const useSheetsDataRowsStore = defineStore('sheetsDataRows', () => {
  const sheetsStore = useSheetsStore()
  const sheetsDataStore = useSheetsDataStore()
  const rowStorage = createRowStorage()

  const calculateRowsOffsets = (sheetId: string): void => {
    const sheetData = sheetsDataStore.getSheetDataById(sheetId)
    if (!sheetData) return

    const { rowOrder, rows } = sheetData
    let offset = CELL_SIZE.HEADER.COL_HEIGHT

    for (const order of rowOrder) {
      const row = rows[order]

      offset += row.height
      row.offsetTop = offset
    }
  }

  const setRowHeight = async (rowNumber: string, options: { auto?: boolean; height?: number }): Promise<void> => {
    if (!sheetsDataStore.currentSheetData) return

    const row = sheetsDataStore.currentSheetData.rows[rowNumber]
    if (!row) return

    if (options.auto) {
      row.isAutoHeight = true

      await nextTick()
      const rowEl = document.querySelector(`[data-row-number="${rowNumber}"]`) as HTMLElement
      if (!rowEl) return

      const autoHeight = Math.ceil(rowEl.getBoundingClientRect().height)
      if (autoHeight === row.height) return

      row.height = autoHeight
    } else if (typeof options.height === 'number') {
      if (row.height === options.height) return

      row.isAutoHeight = false
      row.height = options.height
    } else {
      return
    }

    calculateRowsOffsets(sheetsStore.currentSheetId!)
    await rowStorage.saveRow(toRowDto(row))
  }

  const updateRowHeight = async (rowNumber: string, newHeight: number): Promise<void> => {
    await setRowHeight(rowNumber, { height: newHeight })
  }

  const resetRowAutoHeight = async (rowNumber: string): Promise<void> => {
    await setRowHeight(rowNumber, { auto: true })
  }

  return {
    calculateRowsOffsets,
    setRowHeight,
    updateRowHeight,
    resetRowAutoHeight
  }
})
