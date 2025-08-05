import type { Optional } from '@/shared/types'

export interface Row {
  rowId: string
  sheetId: string
  order: number
  height: number
  isAutoHeight: boolean
  offsetTop: number
}

export interface RowsData {
  rows: Record<string, Row>
  rowOrder: string[]
}

export type RowDto = Optional<Row, 'height' | 'isAutoHeight' | 'offsetTop'>
