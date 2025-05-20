import type { Column, Row, Cell } from '@/shared/types'

export interface Sheet {
  sheetId: string
  tableId: string
  title: string
  order: number
  columns: Column[] // colId ("col-1", "col-2")
  rows: Record<string, Row>       // rowId ("row-1", "row-2")
  cells: Record<string, Cell>     // "row-1:col-2"
}
