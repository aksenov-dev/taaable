import { computed, nextTick, ref } from 'vue'
import { defineStore } from 'pinia'

import type { SheetData } from '@/shared/types'

import {
  generateSheetData,
  fromSheetDataDto,
  measureCellContentWidth,
  parseCellId,
  toCellDto,
  toColumnDto,
  toSheetDataDto,
  toRowDto
} from '@/shared/utils'

import { CELL_SIZE } from '@/shared/constants'
import { useActiveCell } from '@/composables/useActiveCell'
import { useTableStore } from '@/stores/table'
import { useSheetsStore } from '@/stores/sheets'
import { createSheetDataStorage } from '@/db/sheetDataStorage'
import { createRowStorage } from '@/db/rowStorage'
import { createColumnStorage } from '@/db/columnStorage'
import { createCellStorage } from '@/db/cellStorage'

export const useSheetsDataStore = defineStore('sheetsData', () => {
  const sheetsData = ref<Record<string, SheetData>>({})

  const { getActiveCell } = useActiveCell()
  const tableStore = useTableStore()
  const sheetsStore = useSheetsStore()
  const sheetDataStorage = createSheetDataStorage()
  const rowStorage = createRowStorage()
  const columnStorage = createColumnStorage()
  const cellStorage = createCellStorage()

  const currentSheetData = computed(() => {
    if (!sheetsStore.currentSheetId) return
    return sheetsData.value[sheetsStore.currentSheetId]
  })

  const currentCell = computed(() => {
    if (!currentSheetData.value) return
    return currentSheetData.value.cells[getActiveCell(sheetsStore.currentSheetId)]
  })

  const createSheetData = async (sheetId: string): Promise<void> => {
    const sheetData = generateSheetData(sheetId)

    sheetsData.value[sheetId] = sheetData
    calculateRowsOffsets(sheetId)
    calculateColumnsOffsets(sheetId)

    await sheetDataStorage.saveSheetData(toSheetDataDto(sheetId, sheetData))
  }

  const getSheetsData = async (): Promise<void> => {
    if (!tableStore.currentTable) return

    try {
      const sheetDataDtos = await sheetDataStorage.getSheetsDataByTableId(tableStore.currentTable.tableId)

      for (const sheetDataDto of sheetDataDtos) {
        sheetsData.value[sheetDataDto.sheetId] = fromSheetDataDto(sheetDataDto)
        calculateRowsOffsets(sheetDataDto.sheetId)
        calculateColumnsOffsets(sheetDataDto.sheetId)
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных таблицы из IndexedDB:', error)
    }
  }

  const deleteSheetData = async (sheetId: string): Promise<void> => {
    await sheetDataStorage.deleteSheetDataBySheetId(sheetId)
    delete sheetsData.value[sheetId]
  }

  const updateCellValue = async (cellId: string, value: string): Promise<void> => {
    if (!currentSheetData.value) return

    const currentCell = currentSheetData.value.cells[cellId]
    if (!currentCell) return

    currentCell.value = value
    await cellStorage.saveCell(toCellDto(currentCell))

    const { rowNumber } = parseCellId(cellId)

    const row = currentSheetData.value.rows[parseCellId(cellId).rowNumber]
    if (!row) return

    if (row.isAutoHeight) {
      await setRowHeight(rowNumber, { auto: true })
    }
  }


  const calculateRowsOffsets = (sheetId: string): void => {
    const sheetData = sheetsData.value[sheetId]
    if (!sheetData) return

    const { rowOrder, rows } = sheetData
    let offset = CELL_SIZE.HEADER.COL_HEIGHT

    for (const order of rowOrder) {
      const row = rows[order]

      offset += row.height
      row.offsetTop = offset
    }
  }

  const setRowHeight = async (rowNumber: string, options: { auto?: boolean, height?: number }): Promise<void> => {
    if (!currentSheetData.value) return

    const row = currentSheetData.value.rows[rowNumber]
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


  const calculateColumnsOffsets = (sheetId: string): void => {
    const sheetData = sheetsData.value[sheetId]
    if (!sheetData) return

    const { columnOrder, columns } = sheetData
    let offset = CELL_SIZE.HEADER.ROW_WIDTH

    for (const order of columnOrder) {
      const column = columns[order]

      offset += column.width
      column.offsetLeft = offset
    }
  }

  const getMaxColumnContentWidth = (columnLetter: string): number | null => {
    const sheetData = currentSheetData.value
    if (!sheetData) return null

    const notEmptyCellIds = Object.keys(sheetData.cells).filter(key => {
      const cell = sheetData.cells[key]
      const [cellColumnLetter] = key.split(':')

      return cellColumnLetter === columnLetter && cell.value !== ''
    })

    if (notEmptyCellIds.length === 0) return null

    let maxWidth = 0

    for (const cellId of notEmptyCellIds) {
      const cellEl = document.querySelector<HTMLElement>(`[data-cell-id="${cellId}"]`)
      if (!cellEl) continue

      const cellContentWidth = measureCellContentWidth(cellEl)
      maxWidth = Math.max(maxWidth, cellContentWidth)
    }

    return Math.max(maxWidth, CELL_SIZE.MIN.WIDTH)
  }

  const setColumnWidth = async (columnLetter: string, options: { auto?: boolean, width?: number }): Promise<void> => {
    if (!currentSheetData.value) return

    const column = currentSheetData.value.columns[columnLetter]
    if (!column) return

    if (options.auto) {
      await nextTick()

      const maxWidth = getMaxColumnContentWidth(columnLetter)
      if (!maxWidth || maxWidth === column.width) return

      column.width = maxWidth
    } else if (typeof options.width === 'number') {
      if (column.width === options.width) return

      column.width = options.width
    } else {
      return
    }

    calculateColumnsOffsets(sheetsStore.currentSheetId!)
    await columnStorage.saveColumn(toColumnDto(column))
  }

  const updateColumnWidth = async (columnLetter: string, newWidth: number): Promise<void> => {
    await setColumnWidth(columnLetter, { width: newWidth })
  }

  const fitColumnWidthToContent = async (columnLetter: string): Promise<void> => {
    await setColumnWidth(columnLetter, { auto: true })
  }

  const clear = (): void => {
    sheetsData.value = {}
  }

  return {
    currentSheetData,
    currentCell,
    createSheetData,
    getSheetsData,
    deleteSheetData,
    updateCellValue,
    updateRowHeight,
    resetRowAutoHeight,
    updateColumnWidth,
    fitColumnWidthToContent,
    clear
  }
})
