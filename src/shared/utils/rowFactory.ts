import { nanoid } from 'nanoid'

import type { Row, RowsData, RowDto } from '@/shared/types'

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
  return rowsArrayToRowsData(rowsArr)
}

export const rowsArrayToRowsData = (rows: Row[]): RowsData => {
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

export const rowsRecordToArray = (rows: RowsData['rows']): Row[] => {
  return Object.values(rows)
}

export const toRowDto = (row: Row): RowDto => {
  const dto: RowDto = {
    rowId: row.rowId,
    sheetId: row.sheetId,
    order: row.order
  }

  if (row.height !== CELL_SIZE.DEFAULT_HEIGHT) {
    dto.height = row.height
  }

  return dto
}

export const fromRowDto = (dto: RowDto): Row => {
  return {
    ...dto,
    height: dto.height ?? CELL_SIZE.DEFAULT_HEIGHT
  }
}
