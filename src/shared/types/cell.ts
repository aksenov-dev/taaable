import type { CellStyle } from '@/shared/types'

interface BaseCell {
  cellId: string
  sheetId: string
  columnId: string
  rowId: string
  style?: CellStyle
}

interface TextCell extends BaseCell {
  type: 'text'
  value: string
}

interface FormulaCell extends BaseCell {
  type: 'formula'
  formula: string
  value?: number
}

type TextCellDto = Omit<TextCell, 'cellId'>
type FormulaCellDto = Omit<FormulaCell, 'cellId'>

export type Cell = TextCell | FormulaCell
export type CellDto = TextCellDto | FormulaCellDto

export interface CellsData {
  cells: Record<string, Cell>
}
