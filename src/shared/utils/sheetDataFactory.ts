import { TABLE_SIZE } from '@/shared/constants'
import { generateColumns, generateRows, generateCells } from '@/shared/utils'

import type { SheetData } from '@/shared/types'

export const generateSheetData = (sheetId: string): SheetData => {
  const { columns, columnOrder } = generateColumns(sheetId, TABLE_SIZE.DEFAULT_COLUMN_COUNT)
  const { rows, rowOrder } = generateRows(sheetId, TABLE_SIZE.DEFAULT_ROW_COUNT)
  const { cells } = generateCells(sheetId, columns, rows)

  return {
    columns,
    columnOrder,
    rows,
    rowOrder,
    cells
  }
}
