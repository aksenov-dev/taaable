import type { Sheet } from '@/shared/types'

export interface Table {
  tableId: string
  title: string
  viewedAt: number
  sheets: Sheet[]
}

export type TableDto = Pick<Table, 'tableId' | 'title' | 'viewedAt'>
