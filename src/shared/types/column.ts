export interface Column {
  columnId: string
  sheetId: string
  order: number
  width?: number
}

export interface ColumnsData {
  columns: Record<string, Column>
  columnOrder: string[]
}

export type ColumnDto = Pick<Column, 'columnId' | 'sheetId' | 'order' | 'width'>
