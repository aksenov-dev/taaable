import { nanoid } from 'nanoid'

import type { Row, RowsData } from '@/shared/types'

import { CELL_SIZE } from '@/shared/constants'

const generateRow = (sheetId: string, order: number): Row => {
  return {
    rowId: nanoid(),
    sheetId,
    order,
    height: CELL_SIZE.DEFAULT_HEIGHT
  }
}

export const generateRows = (sheetId: string, count: number): RowsData => {
  const rowsArr = Array.from({ length: count }, (_, i) => generateRow(sheetId, i))
  return transformRowsFromArray(rowsArr)
}

export const transformRowsFromArray = (rows: Row[]): RowsData => {
  const rowsRecord: RowsData['rows'] = {}
  const rowOrder: RowsData['rowOrder'] = []

  const sortedRows = [...rows].sort((a, b) => a.order - b.order)

  for (const row of sortedRows) {
    const key = String(row.order + 1)

    rowsRecord[key] = row
    rowOrder.push(key)
  }

  return {
    rows: rowsRecord,
    rowOrder
  }
}
