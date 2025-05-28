import type { Column, Row, Cell } from '@/shared/types'

export interface Sheet {
  sheetId: string
  tableId: string
  title: string
  order: number
}

export interface SheetData {
  columns: Column[]
  rows: Record<string, Row>
  cells: Record<string, Cell>
}

export type SheetDto = Pick<Sheet, 'sheetId' | 'tableId' | 'title' | 'order'>
