import type { Column, Row, Cell } from '@/shared/types'

export interface Sheet {
  sheetId: string
  tableId: string
  title: string
  order: number
}

export interface SheetData {
  rows: Record<string, Row>
  columns: Column[]
  cells: Record<string, Cell>
}

export type SheetDto = Pick<Sheet, 'sheetId' | 'tableId' | 'title' | 'order'>
