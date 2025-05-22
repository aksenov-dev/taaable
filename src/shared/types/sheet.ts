import type { Column, Row, Cell } from '@/shared/types'

export interface Sheet {
  sheetId: string
  tableId: string
  title: string
  order: number
  rows: Record<string, Row>
  columns: Column[]
  cells: Record<string, Cell>
}

export type SheetDto = Pick<Sheet, 'sheetId' | 'tableId' | 'title' | 'order'>
export type SheetMeta = Pick<Sheet, 'sheetId' | 'title' | 'order'>
export type SheetData = Pick<Sheet, 'rows' | 'columns' | 'cells'>
