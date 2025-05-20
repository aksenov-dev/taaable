export interface Row {
  rowId: string   // row-uuid (unique)
  sheetId: string
  index: number
  order: number   // Позиция (0, 1, 2...), он же текст
  height?: number // px
}
