import { ref } from 'vue'

import type { SelectionBounds, SelectionRange } from '@/shared/types'

import { getCellId, parseCellId } from '@/shared/utils'

import { useSheetsStore } from '@/stores/sheets'
import { useSheetsDataStore } from '@/stores/sheetsData'
import { useActiveCell } from '@/composables/useActiveCell'

const selections = ref<Record<string, SelectionRange>>({})

export function useSelection() {
  const sheetsStore = useSheetsStore()
  const sheetsDataStore = useSheetsDataStore()
  const { getActiveCell } = useActiveCell()

  function rangeToIndexBounds(range: SelectionRange, columnOrder: string[], rowOrder: string[]): SelectionBounds {
    const startColIdx = columnOrder.indexOf(parseCellId(range.startId).columnLetter)
    const startRowIdx = rowOrder.indexOf(parseCellId(range.startId).rowNumber)
    const endColIdx = columnOrder.indexOf(parseCellId(range.endId).columnLetter)
    const endRowIdx = rowOrder.indexOf(parseCellId(range.endId).rowNumber)

    return {
      minColIndex: Math.min(startColIdx, endColIdx),
      maxColIndex: Math.max(startColIdx, endColIdx),
      minRowIndex: Math.min(startRowIdx, endRowIdx),
      maxRowIndex: Math.max(startRowIdx, endRowIdx),
    }
  }

  function saveNormalized(sheetId: string, startId: string, endId: string): void {
    const columnOrder = sheetsDataStore.currentSheetData?.columnOrder ?? []
    const rowOrder = sheetsDataStore.currentSheetData?.rowOrder ?? []
    const bounds = rangeToIndexBounds({ startId, endId }, columnOrder, rowOrder)

    selections.value[sheetId] = {
      startId: getCellId(columnOrder[bounds.minColIndex], rowOrder[bounds.minRowIndex]),
      endId: getCellId(columnOrder[bounds.maxColIndex], rowOrder[bounds.maxRowIndex]),
    }
  }

  function extendSelection(sheetId: string, newEndId: string): void {
    const anchorId = selections.value[sheetId]?.startId ?? getActiveCell(sheetId)
    saveNormalized(sheetId, anchorId, newEndId)
  }

  function setSelectionRange(sheetId: string, startId: string, endId: string): void {
    saveNormalized(sheetId, startId, endId)
  }

  function clearSelection(sheetId: string): void {
    delete selections.value[sheetId]
  }

  function hasSelection(sheetId: string): boolean {
    return sheetId in selections.value
  }

  function getSelectionStart(sheetId: string): string | null {
    return selections.value[sheetId]?.startId ?? null
  }

  function getSelectionEnd(sheetId: string): string | null {
    return selections.value[sheetId]?.endId ?? null
  }

  function isInSelection(cellId: string): boolean {
    const sheetId = sheetsStore.currentSheetId
    const selection = sheetId ? selections.value[sheetId] : null

    if (!selection)
      return false

    const columnOrder = sheetsDataStore.currentSheetData?.columnOrder ?? []
    const rowOrder = sheetsDataStore.currentSheetData?.rowOrder ?? []

    const bounds = rangeToIndexBounds(selection, columnOrder, rowOrder)
    const cellColIdx = columnOrder.indexOf(parseCellId(cellId).columnLetter)
    const cellRowIdx = rowOrder.indexOf(parseCellId(cellId).rowNumber)

    return (
      cellColIdx >= bounds.minColIndex
      && cellColIdx <= bounds.maxColIndex
      && cellRowIdx >= bounds.minRowIndex
      && cellRowIdx <= bounds.maxRowIndex
    )
  }

  function getSelectionBounds(sheetId: string): SelectionBounds | null {
    const selection = selections.value[sheetId]

    if (!selection)
      return null

    const columnOrder = sheetsDataStore.currentSheetData?.columnOrder ?? []
    const rowOrder = sheetsDataStore.currentSheetData?.rowOrder ?? []

    return rangeToIndexBounds(selection, columnOrder, rowOrder)
  }

  return {
    extendSelection,
    setSelectionRange,
    clearSelection,
    hasSelection,
    getSelectionStart,
    getSelectionEnd,
    isInSelection,
    getSelectionBounds,
  }
}
