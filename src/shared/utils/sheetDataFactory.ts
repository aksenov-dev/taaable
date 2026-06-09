import type { SheetData, SheetDataDto } from '@/shared/types'
import { TABLE_SIZE } from '@/shared/constants'

import {
  columnsArrayToColumnsData,
  columnsRecordToArray,
  fromCellDto,
  fromColumnDto,
  fromMergeDto,
  fromRowDto,
  generateCells,
  generateColumns,
  generateRows,
  mergesArrayToMergesData,
  mergesRecordToArray,
  rowsArrayToRowsData,
  rowsRecordToArray,
  toColumnDto,
  toMergeDto,
  toRowDto,
} from '@/shared/utils'

export function generateSheetData(sheetId: string): SheetData {
  const { columns, columnOrder } = generateColumns(sheetId, TABLE_SIZE.DEFAULT.COLUMN_COUNT)
  const { rows, rowOrder } = generateRows(sheetId, TABLE_SIZE.DEFAULT.ROW_COUNT)
  const { cells } = generateCells(sheetId, columns, rows)

  return { columns, columnOrder, rows, rowOrder, cells, merges: {} }
}

export function toSheetDataDto(sheetId: string, sheetData: SheetData): SheetDataDto {
  return {
    sheetId,
    columns: columnsRecordToArray(sheetData.columns).map(toColumnDto),
    rows: rowsRecordToArray(sheetData.rows).map(toRowDto),
    cells: [],
    merges: mergesRecordToArray(sheetData.merges).map(toMergeDto),
  }
}

export function fromSheetDataDto(dto: SheetDataDto): SheetData {
  const { columns, columnOrder } = columnsArrayToColumnsData(dto.columns.map(fromColumnDto))
  const { rows, rowOrder } = rowsArrayToRowsData(dto.rows.map(fromRowDto))
  const { cells } = generateCells(dto.sheetId, columns, rows)
  const { merges } = mergesArrayToMergesData(dto.merges.map(fromMergeDto))

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
    merges,
  }
}
