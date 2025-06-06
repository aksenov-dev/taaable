import { nanoid } from 'nanoid'

import type { Table, TableDto } from '@/shared/types'

export const generateTable = (): Table => {
  return {
    tableId: nanoid(),
    title: 'Новая таблица',
    viewedAt: Date.now()
  }
}

export const toTableDto = (table: Table): TableDto => ({
  tableId: table.tableId,
  title: table.title,
  viewedAt: table.viewedAt
})

export const fromTableDto = (dto: TableDto): Table => {
  return {
    ...dto
  }
}
