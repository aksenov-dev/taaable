export interface NavigationCtx {
  sheetId: string
  currentCellId: string
  colIndex: number
  rowIndex: number
  columnOrder: string[]
  rowOrder: string[]
  shift: boolean
  ctrl: boolean
}

export type NavigationResult = { colIndex: number, rowIndex: number } | null
