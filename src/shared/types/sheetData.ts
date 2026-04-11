import type { CellDto, CellsData, ColumnDto, ColumnsData, RowDto, RowsData } from '@/shared/types'

export interface SheetData extends ColumnsData, RowsData, CellsData {}

export interface SheetDataDto {
  sheetId: string
  columns: ColumnDto[]
  rows: RowDto[]
  cells: CellDto[]
}
