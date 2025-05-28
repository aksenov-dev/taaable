import type { CellStyle } from '@/shared/types'

interface BaseCell {
  cellId: string
  sheetId: string
  rowId: string
  columnId: string
  value: string | number
  style?: CellStyle
}

interface TextCell extends BaseCell {
  type?: 'text'
}

interface FormulaCell extends BaseCell {
  type: 'formula'
  formula: string
}

type TextCellDto = Omit<TextCell, 'cellId'>
type FormulaCellDto = Omit<FormulaCell, 'cellId'>


export type Cell = TextCell | FormulaCell
export type CellDto = TextCellDto | FormulaCellDto
