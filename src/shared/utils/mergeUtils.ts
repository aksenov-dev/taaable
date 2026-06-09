import type { Merge, MergeBounds, SelectionBounds } from '../types'

import { getCellId, parseCellId } from './cellFactory'

export function getMergeBounds(merge: Merge, columnOrder: string[], rowOrder: string[]): MergeBounds {
  const { columnLetter, rowNumber } = parseCellId(merge.anchorCellId)
  const columnIndex = columnOrder.indexOf(columnLetter)
  const rowIndex = rowOrder.indexOf(rowNumber)

  return {
    minColumn: columnIndex,
    maxColumn: columnIndex + merge.colSpan - 1,
    minRow: rowIndex,
    maxRow: rowIndex + merge.rowSpan - 1,
  }
}

export function isMergeOverlapping(mb: MergeBounds, bounds: SelectionBounds): boolean {
  return (
    mb.minColumn <= bounds.maxColumnIndex
    && mb.maxColumn >= bounds.minColumnIndex
    && mb.minRow <= bounds.maxRowIndex
    && mb.maxRow >= bounds.minRowIndex
  )
}

export function isMergeFullyContained(mb: MergeBounds, bounds: SelectionBounds): boolean {
  return (
    mb.minColumn >= bounds.minColumnIndex
    && mb.maxColumn <= bounds.maxColumnIndex
    && mb.minRow >= bounds.minRowIndex
    && mb.maxRow <= bounds.maxRowIndex
  )
}

export function skipCoveredRows(
  rowIndex: number,
  colIndex: number,
  dir: number,
  rowOrder: string[],
  columnOrder: string[],
  coveredSet: Set<string>,
  anchorMap: Record<string, string>,
  anchorId?: string,
): number {
  let i = rowIndex

  while (i >= 0 && i < rowOrder.length) {
    const id = getCellId(columnOrder[colIndex], rowOrder[i])
    if (!coveredSet.has(id))
      break

    if (anchorId !== undefined && anchorMap[id] !== anchorId)
      break

    const next = i + dir
    if (next < 0 || next >= rowOrder.length)
      break

    i = next
  }

  return i
}

export function skipCoveredCols(
  colIndex: number,
  rowIndex: number,
  dir: number,
  columnOrder: string[],
  rowOrder: string[],
  coveredSet: Set<string>,
  anchorMap: Record<string, string>,
  anchorId?: string,
): number {
  let i = colIndex

  while (i >= 0 && i < columnOrder.length) {
    const id = getCellId(columnOrder[i], rowOrder[rowIndex])
    if (!coveredSet.has(id))
      break

    if (anchorId !== undefined && anchorMap[id] !== anchorId)
      break

    const next = i + dir
    if (next < 0 || next >= columnOrder.length)
      break

    i = next
  }

  return i
}

export function resolveNavColContext(
  colIndex: number,
  rowIndex: number,
  columnOrder: string[],
  rowOrder: string[],
  coveredToAnchorMap: Record<string, string>,
): string | null {
  const landedAnchorId = coveredToAnchorMap[getCellId(columnOrder[colIndex], rowOrder[rowIndex])]

  if (landedAnchorId) {
    const { columnLetter } = parseCellId(landedAnchorId)
    return columnLetter !== columnOrder[colIndex] ? columnOrder[colIndex] : null
  }

  return null
}

export function resolveTabRowContext(
  colIndex: number,
  rowIndex: number,
  columnOrder: string[],
  rowOrder: string[],
  coveredToAnchorMap: Record<string, string>,
): string | null {
  const landedAnchorId = coveredToAnchorMap[getCellId(columnOrder[colIndex], rowOrder[rowIndex])]

  if (landedAnchorId) {
    const { rowNumber } = parseCellId(landedAnchorId)
    return rowNumber !== rowOrder[rowIndex] ? rowOrder[rowIndex] : null
  }

  return null
}
