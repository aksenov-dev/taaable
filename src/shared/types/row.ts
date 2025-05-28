export interface Row {
  rowId: string
  sheetId: string
  order: number
  height?: number
}

export type RowDto = Pick<Row, 'rowId' | 'sheetId' | 'order' | 'height'>
