import { nanoid } from 'nanoid'

import type { Row, RowDto, RowsData } from '@/shared/types'
import { CELL_SIZE } from '@/shared/constants'

function generateRow(sheetId: string, order: number): Row {
  return {
    rowId: nanoid(),
    sheetId,
    order,
    height: CELL_SIZE.DEFAULT.HEIGHT,
    isAutoHeight: true,
    offsetTop: 0,
  }
}

export function generateRows(sheetId: string, count: number): RowsData {
  const rowsArr = Array.from({ length: count }, (_, i) => generateRow(sheetId, i))
  return rowsArrayToRowsData(rowsArr)
}

export function rowsArrayToRowsData(rows: Row[]): RowsData {
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
    rowOrder,
  }
}

export function rowsRecordToArray(rows: RowsData['rows']): Row[] {
  return Object.values(rows)
}

export function toRowDto(row: Row): RowDto {
  const dto: RowDto = {
    rowId: row.rowId,
    sheetId: row.sheetId,
    order: row.order,
  }

  if (row.height !== CELL_SIZE.DEFAULT.HEIGHT) {
    dto.height = row.height
  }

  if (!row.isAutoHeight) {
    dto.isAutoHeight = row.isAutoHeight
  }

  return dto
}

export function fromRowDto(dto: RowDto): Row {
  return {
    ...dto,
    height: dto.height ?? CELL_SIZE.DEFAULT.HEIGHT,
    isAutoHeight: dto.isAutoHeight ?? true,
    offsetTop: 0,
  }
}
