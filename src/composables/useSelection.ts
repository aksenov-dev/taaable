import { ref } from 'vue'

import type { SelectionBounds, SelectionRange } from '@/shared/types'

import { getCellId, parseCellId } from '@/shared/utils'

import { useSheetsStore } from '@/stores/sheets'
import { useSheetsDataStore } from '@/stores/sheetsData'
import { useActiveCell } from '@/composables/useActiveCell'

const selections = ref<Record<string, SelectionRange[]>>({})

export function useSelection() {
  const sheetsStore = useSheetsStore()
  const sheetsDataStore = useSheetsDataStore()
  const { getActiveCell } = useActiveCell()

  function rangeToIndexBounds(range: SelectionRange, columnOrder: string[], rowOrder: string[]): SelectionBounds {
    const startColumnIndex = columnOrder.indexOf(parseCellId(range.startId).columnLetter)
    const startRowIndex = rowOrder.indexOf(parseCellId(range.startId).rowNumber)
    const endColumnIndex = columnOrder.indexOf(parseCellId(range.endId).columnLetter)
    const endRowIndex = rowOrder.indexOf(parseCellId(range.endId).rowNumber)

    return {
      minColumnIndex: Math.min(startColumnIndex, endColumnIndex),
      maxColumnIndex: Math.max(startColumnIndex, endColumnIndex),
      minRowIndex: Math.min(startRowIndex, endRowIndex),
      maxRowIndex: Math.max(startRowIndex, endRowIndex),
    }
  }

  function saveNormalized(sheetId: string, startId: string, endId: string, replaceAll = false): void {
    const columnOrder = sheetsDataStore.currentSheetData?.columnOrder ?? []
    const rowOrder = sheetsDataStore.currentSheetData?.rowOrder ?? []
    const bounds = rangeToIndexBounds({ startId, endId }, columnOrder, rowOrder)

    const normalized = {
      startId: getCellId(columnOrder[bounds.minColumnIndex], rowOrder[bounds.minRowIndex]),
      endId: getCellId(columnOrder[bounds.maxColumnIndex], rowOrder[bounds.maxRowIndex]),
    }

    const prev = selections.value[sheetId] ?? []
    selections.value[sheetId] = replaceAll ? [normalized] : [...prev.slice(0, -1), normalized]
  }

  function extendSelection(sheetId: string, newEndId: string, anchor?: string): void {
    const ranges = selections.value[sheetId]
    const anchorId = anchor ?? ranges?.at(-1)?.startId ?? getActiveCell(sheetId)
    saveNormalized(sheetId, anchorId, newEndId)
  }

  function setSelectionRange(sheetId: string, startId: string, endId: string): void {
    saveNormalized(sheetId, startId, endId, true)
  }

  function clearSelection(sheetId: string): void {
    delete selections.value[sheetId]
  }

  function hasSelection(sheetId: string): boolean {
    return (selections.value[sheetId]?.length ?? 0) > 0
  }

  function getSelectionStart(sheetId: string): string | null {
    return selections.value[sheetId]?.at(-1)?.startId ?? null
  }

  function getSelectionEnd(sheetId: string): string | null {
    return selections.value[sheetId]?.at(-1)?.endId ?? null
  }

  function getSelectionRanges(sheetId: string): SelectionRange[] {
    return selections.value[sheetId] ?? []
  }

  function getSelectionRangeCount(sheetId: string): number {
    return selections.value[sheetId]?.length ?? 0
  }

  function getCurrentRangeContext() {
    const sheetId = sheetsStore.currentSheetId
    const ranges = sheetId ? selections.value[sheetId] : null

    if (!ranges?.length)
      return null

    const columnOrder = sheetsDataStore.currentSheetData?.columnOrder ?? []
    const rowOrder = sheetsDataStore.currentSheetData?.rowOrder ?? []

    return { ranges, columnOrder, rowOrder }
  }

  function isInSelection(cellId: string): boolean {
    const ctx = getCurrentRangeContext()

    if (!ctx)
      return false

    const cellColIndex = ctx.columnOrder.indexOf(parseCellId(cellId).columnLetter)
    const cellRowIndex = ctx.rowOrder.indexOf(parseCellId(cellId).rowNumber)

    return ctx.ranges.some((range) => {
      const bounds = rangeToIndexBounds(range, ctx.columnOrder, ctx.rowOrder)

      return (
        cellColIndex >= bounds.minColumnIndex
        && cellColIndex <= bounds.maxColumnIndex
        && cellRowIndex >= bounds.minRowIndex
        && cellRowIndex <= bounds.maxRowIndex
      )
    })
  }

  function isColumnInSelection(columnLetter: string): boolean {
    const ctx = getCurrentRangeContext()

    if (!ctx)
      return false

    const columnIndex = ctx.columnOrder.indexOf(columnLetter)

    return ctx.ranges.some((range) => {
      const bounds = rangeToIndexBounds(range, ctx.columnOrder, ctx.rowOrder)
      return columnIndex >= bounds.minColumnIndex && columnIndex <= bounds.maxColumnIndex
    })
  }

  function isRowInSelection(rowNumber: string): boolean {
    const ctx = getCurrentRangeContext()

    if (!ctx)
      return false

    const rowIndex = ctx.rowOrder.indexOf(rowNumber)

    return ctx.ranges.some((range) => {
      const bounds = rangeToIndexBounds(range, ctx.columnOrder, ctx.rowOrder)
      return rowIndex >= bounds.minRowIndex && rowIndex <= bounds.maxRowIndex
    })
  }

  function getSelectionBounds(sheetId: string): SelectionBounds | null {
    const range = selections.value[sheetId]?.at(-1)

    if (!range)
      return null

    const columnOrder = sheetsDataStore.currentSheetData?.columnOrder ?? []
    const rowOrder = sheetsDataStore.currentSheetData?.rowOrder ?? []

    return rangeToIndexBounds(range, columnOrder, rowOrder)
  }

  function toggleCellInSelection(sheetId: string, cellId: string): void {
    const ranges = selections.value[sheetId] ?? []
    const exactIndex = ranges.findIndex(r => r.startId === cellId && r.endId === cellId)

    if (exactIndex !== -1) {
      const next = ranges.filter((_, i) => i !== exactIndex)

      if (next.length === 0) {
        delete selections.value[sheetId]
      }
      else {
        selections.value[sheetId] = next
      }
    }
    else if (!isInSelection(cellId)) {
      const activeId = getActiveCell(sheetId)
      const first = ranges.length === 0 ? [{ startId: activeId, endId: activeId }] : ranges
      selections.value[sheetId] = [...first, { startId: cellId, endId: cellId }]
    }
  }

  function getSelectedCellIds(sheetId: string, columnOrder: string[], rowOrder: string[], vertical = false): string[] {
    const ranges = selections.value[sheetId] ?? []
    const cellSet = new Set<string>()

    for (const range of ranges) {
      const bounds = rangeToIndexBounds(range, columnOrder, rowOrder)

      for (let rowIndex = bounds.minRowIndex; rowIndex <= bounds.maxRowIndex; rowIndex++) {
        for (let columnIndex = bounds.minColumnIndex; columnIndex <= bounds.maxColumnIndex; columnIndex++) {
          cellSet.add(getCellId(columnOrder[columnIndex], rowOrder[rowIndex]))
        }
      }
    }

    return [...cellSet].sort((a, b) => {
      const cellA = parseCellId(a)
      const cellB = parseCellId(b)

      const rowDiff = rowOrder.indexOf(cellA.rowNumber) - rowOrder.indexOf(cellB.rowNumber)
      const columnDiff = columnOrder.indexOf(cellA.columnLetter) - columnOrder.indexOf(cellB.columnLetter)

      return vertical ? (columnDiff !== 0 ? columnDiff : rowDiff) : (rowDiff !== 0 ? rowDiff : columnDiff)
    })
  }

  return {
    extendSelection,
    setSelectionRange,
    clearSelection,
    hasSelection,
    getSelectionStart,
    getSelectionEnd,
    getSelectionRanges,
    getSelectionRangeCount,
    isInSelection,
    isColumnInSelection,
    isRowInSelection,
    getSelectionBounds,
    toggleCellInSelection,
    getSelectedCellIds,
  }
}
