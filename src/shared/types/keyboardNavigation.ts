export interface NavigationCtx {
  sheetId: string
  currentCellId: string
  columnIndex: number
  rowIndex: number
  columnOrder: string[]
  rowOrder: string[]
  shift: boolean
  ctrl: boolean
}

export type NavigationResult = { columnIndex: number, rowIndex: number } | null
