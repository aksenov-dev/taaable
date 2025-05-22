import { nanoid } from 'nanoid'

import type { Table, TableDto } from '@/shared/types'

export function createTableObject(): Table {
  return {
    tableId: nanoid(),
    title: 'Новая таблица',
    viewedAt: Date.now(),
    sheets: []
  }
}

export function toTableDto(table: Table): TableDto {
  const { tableId, title, viewedAt } = table
  return { tableId, title, viewedAt }
}

export function fromTableDto(dto: TableDto): Table {
  return {
    ...dto,
    sheets: []
  }
}
