import type { Cell, CellDto, CellsData, ColumnsData, RowsData } from '@/shared/types'

export const getCellId = (columnLetter: string, rowNumber: string): string => {
  return `${columnLetter}:${rowNumber}`
}

export const parseCellId = (cellId: string): { columnLetter: string, rowNumber: string } => {
  const [columnLetter, rowNumber] = cellId.split(':')
  return { columnLetter, rowNumber }
}

const generateCell = (cellId: string, sheetId: string, columnId: string, rowId: string): Cell => {
  return {
    cellId,
    sheetId,
    columnId,
    rowId,
    value: '',
    type: 'text',
    style: {}
  }
}

export const generateCells = (sheetId: string, columns: ColumnsData['columns'], rows: RowsData['rows']): CellsData => {
  const cells: CellsData['cells'] = {}

  const columnKeys = Object.keys(columns)
  const rowKeys = Object.keys(rows)

  for (const columnKey of columnKeys) {
    const columnId = columns[columnKey].columnId

    for (const rowKey of rowKeys) {
      const rowId = rows[rowKey].rowId
      const cellId = getCellId(columnKey, rowKey)
      const cell = generateCell(cellId, sheetId, columnId, rowId)

      cells[cell.cellId] = cell
    }
  }

  return {
    cells
  }
}

export const toCellDto = (cell: Cell): CellDto => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { cellId, style, ...rest } = cell

  return {
    ...rest,
    ...(Object.keys(style).length > 0 ? { style } : {})
  }
}

export const fromCellDto = (dto: CellDto, columns: ColumnsData['columns'], rows: RowsData['rows']): Cell => {
  const columnKey = Object.keys(columns).find(key => columns[key].columnId === dto.columnId)
  const rowKey = Object.keys(rows).find(key => rows[key].rowId === dto.rowId)

  if (!columnKey || !rowKey) {
    throw new Error('Invalid columnKey or rowKey')
  }

  const cellId = getCellId(columnKey, rowKey)

  return {
    cellId,
    ...dto,
    style: dto.style ?? {}
  }
}
