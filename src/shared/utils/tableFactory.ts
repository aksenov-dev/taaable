import { nanoid } from 'nanoid'

import type { Table, TableDto } from '@/shared/types'

export const generateTable = (): Table => {
  return {
    tableId: nanoid(),
    title: 'Новая таблица',
    viewedAt: Date.now()
  }
}

export const toTableDto = (table: Table): TableDto => {
  const { tableId, title, viewedAt } = table
  return { tableId, title, viewedAt }
}

export const fromTableDto = (dto: TableDto): Table => {
  return {
    ...dto
  }
}
