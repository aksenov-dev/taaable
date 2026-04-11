import { nextTick } from 'vue'
import { defineStore } from 'pinia'

import { CELL_SIZE } from '@/shared/constants'

import { measureCellContentWidth, toColumnDto } from '@/shared/utils'

import { createColumnStorage } from '@/db/columnStorage'
import { useSheetsStore } from '@/stores/sheets'
import { useSheetsDataStore } from '@/stores/sheetsData'

export const useSheetsDataColumnsStore = defineStore('sheetsDataColumns', () => {
  const sheetsStore = useSheetsStore()
  const sheetsDataStore = useSheetsDataStore()
  const columnStorage = createColumnStorage()

  function calculateColumnsOffsets(sheetId: string): void {
    const sheetData = sheetsDataStore.getSheetDataById(sheetId)

    if (!sheetData)
      return

    const { columnOrder, columns } = sheetData
    let offset = CELL_SIZE.HEADER.ROW_WIDTH

    for (const order of columnOrder) {
      const column = columns[order]

      offset += column.width
      column.offsetLeft = offset
    }
  }

  function getMaxColumnContentWidth(columnLetter: string): number | null {
    const sheetData = sheetsDataStore.currentSheetData

    if (!sheetData)
      return null

    const notEmptyCellIds = Object.keys(sheetData.cells).filter((key) => {
      const cell = sheetData.cells[key]
      const [cellColumnLetter] = key.split(':')

      return cellColumnLetter === columnLetter && cell.value !== ''
    })

    if (notEmptyCellIds.length === 0)
      return null

    let maxWidth = 0

    for (const cellId of notEmptyCellIds) {
      const cellEl = document.querySelector<HTMLElement>(`[data-cell-id="${cellId}"]`)

      if (!cellEl)
        continue

      const cellContentWidth = measureCellContentWidth(cellEl)
      maxWidth = Math.max(maxWidth, cellContentWidth)
    }

    return Math.max(maxWidth, CELL_SIZE.MIN.WIDTH)
  }

  async function setColumnWidth(columnLetter: string, options: { auto?: boolean, width?: number }): Promise<void> {
    if (!sheetsDataStore.currentSheetData)
      return

    const column = sheetsDataStore.currentSheetData.columns[columnLetter]

    if (!column)
      return

    if (options.auto) {
      await nextTick()

      const maxWidth = getMaxColumnContentWidth(columnLetter)

      if (!maxWidth || maxWidth === column.width)
        return

      column.width = maxWidth
    }
    else if (typeof options.width === 'number') {
      if (column.width === options.width)
        return

      column.width = options.width
    }
    else {
      return
    }

    calculateColumnsOffsets(sheetsStore.currentSheetId!)
    await columnStorage.saveColumn(toColumnDto(column))
  }

  async function updateColumnWidth(columnLetter: string, newWidth: number): Promise<void> {
    await setColumnWidth(columnLetter, { width: newWidth })
  }

  async function fitColumnWidthToContent(columnLetter: string): Promise<void> {
    await setColumnWidth(columnLetter, { auto: true })
  }

  return {
    calculateColumnsOffsets,
    updateColumnWidth,
    fitColumnWidthToContent,
  }
})
