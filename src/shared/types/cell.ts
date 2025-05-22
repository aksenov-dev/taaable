import type { CellStyle } from '@/shared/types'

export interface Cell {
  cellId: string
  sheetId: string
  rowId: string
  columnId: string
  value: string | number
  type?: 'text' | 'formula'
  formula?: string
  style?: CellStyle
}
