import { nanoid } from 'nanoid'

import type { Column, ColumnsData, ColumnDto } from '@/shared/types'

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
  return columnsArrayToColumnsData(columnsArr)
}

export const columnsArrayToColumnsData = (columns: Column[]): ColumnsData => {
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

export const columnsRecordToArray = (columns: ColumnsData['columns']): Column[] => {
  return Object.values(columns)
}

export const toColumnDto = (column: Column): ColumnDto => {
  const dto: ColumnDto = {
    columnId: column.columnId,
    sheetId: column.sheetId,
    order: column.order
  }

  if (column.width !== CELL_SIZE.DEFAULT_WIDTH) {
    dto.width = column.width
  }

  return dto
}

export const fromColumnDto = (dto: ColumnDto): Column => {
  return {
    ...dto,
    width: dto.width ?? CELL_SIZE.DEFAULT_WIDTH
  }
}
