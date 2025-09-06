import type { Optional } from '@/shared/types'

export interface Column {
  columnId: string
  sheetId: string
  order: number
  width: number
  offsetLeft: number
}

export interface ColumnsData {
  columns: Record<string, Column>
  columnOrder: string[]
}

export type ColumnDto = Optional<Column, 'width' | 'offsetLeft'>
