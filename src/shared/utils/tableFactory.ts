import { nanoid } from 'nanoid'

import type { Table, TableDto } from '@/shared/types'

export function generateTable(): Table {
  return {
    tableId: nanoid(),
    title: 'Новая таблица',
    viewedAt: Date.now(),
  }
}

export function toTableDto(table: Table): TableDto {
  return {
    tableId: table.tableId,
    title: table.title,
    viewedAt: table.viewedAt,
  }
}

export function fromTableDto(dto: TableDto): Table {
  return {
    ...dto,
  }
}
