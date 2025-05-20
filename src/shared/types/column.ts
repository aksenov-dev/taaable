export interface Column {
  columnId: string // col-uuid (unique)
  sheetId: string
  title: string
  order: number    // Позиция (0, 1, 2...)
  width?: number   // px
}
