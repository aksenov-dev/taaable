import type { SheetData, SheetDataDto } from '@/shared/types'
import { TABLE_SIZE } from '@/shared/constants'

import {
  columnsArrayToColumnsData,
  columnsRecordToArray,
  fromCellDto,
  fromColumnDto,
  fromRowDto,
  generateCells,
  generateColumns,
  generateRows,
  rowsArrayToRowsData,
  rowsRecordToArray,
  toColumnDto,
  toRowDto,
} from '@/shared/utils'

export function generateSheetData(sheetId: string): SheetData {
  const { columns, columnOrder } = generateColumns(sheetId, TABLE_SIZE.DEFAULT.COLUMN_COUNT)
  const { rows, rowOrder } = generateRows(sheetId, TABLE_SIZE.DEFAULT.ROW_COUNT)
  const { cells } = generateCells(sheetId, columns, rows)

  return { columns, columnOrder, rows, rowOrder, cells }
}

export function toSheetDataDto(sheetId: string, sheetData: SheetData): SheetDataDto {
  return {
    sheetId,
    columns: columnsRecordToArray(sheetData.columns).map(toColumnDto),
    rows: rowsRecordToArray(sheetData.rows).map(toRowDto),
    cells: [],
  }
}

export function fromSheetDataDto(dto: SheetDataDto): SheetData {
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
    cells,
  }
}
