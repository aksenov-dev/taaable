import type { CellStyle } from '@/shared/types'

interface BaseCell {
  cellId: string
  sheetId: string
  columnId: string
  rowId: string
  style: CellStyle
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

export interface CellsData {
  cells: Record<string, Cell>
}

type ToCellDto<T extends BaseCell> = Omit<T, 'cellId' | 'style'> & { style?: CellStyle }

type TextCellDto = ToCellDto<TextCell>
type FormulaCellDto = ToCellDto<FormulaCell>

export type Cell = TextCell | FormulaCell
export type CellDto = TextCellDto | FormulaCellDto
