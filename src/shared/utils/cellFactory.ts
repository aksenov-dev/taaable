import type { Cell, CellsData, ColumnsData, RowsData } from '@/shared/types'

const generateCell = (cellId: string, sheetId: string, columnId: string, rowId: string): Cell => {
  return {
    cellId,
    sheetId,
    columnId,
    rowId,
    value: '',
    type: 'text'
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
      const cellId = `${columnKey}:${rowKey}`
      const cell = generateCell(cellId, sheetId, columnId, rowId)

      cells[cell.cellId] = cell
    }
  }

  return {
    cells
  }
}
