import type { SheetData, SheetDataDto } from '@/shared/types'

import { TABLE_SIZE } from '@/shared/constants'
import {
  generateColumns,
  columnsArrayToColumnsData,
  columnsRecordToArray,
  fromColumnDto,
  toColumnDto,
  generateRows,
  rowsArrayToRowsData,
  rowsRecordToArray,
  fromRowDto,
  toRowDto,
  generateCells,
  fromCellDto
} from '@/shared/utils'

export const generateSheetData = (sheetId: string): SheetData => {
  const { columns, columnOrder } = generateColumns(sheetId, TABLE_SIZE.DEFAULT_COLUMN_COUNT)
  const { rows, rowOrder } = generateRows(sheetId, TABLE_SIZE.DEFAULT_ROW_COUNT)
  const { cells } = generateCells(sheetId, columns, rows)

  return { columns, columnOrder, rows, rowOrder, cells }
}

export const toSheetDataDto = (sheetId: string, sheetData: SheetData): SheetDataDto => ({
  sheetId,
  columns: columnsRecordToArray(sheetData.columns).map(toColumnDto),
  rows: rowsRecordToArray(sheetData.rows).map(toRowDto),
  cells: []
})

export const fromSheetDataDto = (dto: SheetDataDto): SheetData => {
  const { columns, columnOrder } = columnsArrayToColumnsData(dto.columns.map(fromColumnDto))
  const { rows, rowOrder } = rowsArrayToRowsData(dto.rows.map(fromRowDto))
  const { cells } = generateCells(dto.sheetId, columns, rows)

  for (const cellDto of dto.cells) {
    const cell = fromCellDto(cellDto, columns, rows)
    cells[cell.cellId] = cell
  }

  return {
    columns,
    columnOrder,
    rows,
    rowOrder,
    cells
  }
}
