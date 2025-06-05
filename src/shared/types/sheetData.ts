import type { ColumnDto, ColumnsData, CellDto, CellsData, RowDto, RowsData } from '@/shared/types'

export interface SheetData extends ColumnsData, RowsData, CellsData {}

export interface SheetDataDto {
  sheetId: string
  columns: ColumnDto[]
  rows: RowDto[]
  cells: CellDto[]
}
