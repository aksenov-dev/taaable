import type {
  CellDto,
  CellsData,
  ColumnDto,
  ColumnsData,
  MergeDto,
  MergesData,
  RowDto,
  RowsData,
} from '@/shared/types'

export interface SheetData extends ColumnsData, RowsData, CellsData, MergesData {}

export interface SheetDataDto {
  sheetId: string
  columns: ColumnDto[]
  rows: RowDto[]
  cells: CellDto[]
  merges: MergeDto[]
}
