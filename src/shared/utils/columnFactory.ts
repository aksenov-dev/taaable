import { nanoid } from 'nanoid'

import type { Column, ColumnsData } from '@/shared/types'

import { CELL_SIZE } from '@/shared/constants'
import { numberToColumnLetter } from '@/shared/utils/numberToColumnLetter'

const generateColumn = (sheetId: string, order: number): Column => {
  return {
    columnId: nanoid(),
    sheetId,
    order,
    width: CELL_SIZE.DEFAULT_WIDTH
  }
}

export const generateColumns = (sheetId: string, count: number): ColumnsData => {
  const columnsArr = Array.from({ length: count }, (_, i) => generateColumn(sheetId, i))
  return transformColumnsFromArray(columnsArr)
}

export const transformColumnsFromArray = (columns: Column[]): ColumnsData => {
  const columnsRecord: ColumnsData['columns'] = {}
  const columnOrder: ColumnsData['columnOrder'] = []

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order)

  for (const column of sortedColumns) {
    const key = numberToColumnLetter(column.order)

    columnsRecord[key] = column
    columnOrder.push(key)
  }

  return {
    columns: columnsRecord,
    columnOrder
  }
}
