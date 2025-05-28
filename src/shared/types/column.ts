export interface Column {
  columnId: string
  sheetId: string
  order: number
  width?: number
}

export type ColumnDto = Pick<Column, 'columnId' | 'sheetId' | 'order' | 'width'>
