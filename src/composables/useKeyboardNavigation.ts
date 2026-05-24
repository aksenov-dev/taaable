import { onMounted, onUnmounted } from 'vue'
import type { Ref } from 'vue'

import type { NavigationCtx, NavigationResult } from '@/shared/types'

import { getCellId, parseCellId } from '@/shared/utils'

import { useSheetsStore } from '@/stores/sheets'
import { useSheetsDataStore } from '@/stores/sheetsData'
import { useSheetsDataCellsStore } from '@/stores/sheetsData/cells'
import { useActiveCell } from '@/composables/useActiveCell'
import { useCellEditing } from '@/composables/useCellEditing'
import { useSelection } from '@/composables/useSelection'

export function useKeyboardNavigation(containerRef: Ref<HTMLDivElement | null>) {
  const sheetsStore = useSheetsStore()
  const sheetsDataStore = useSheetsDataStore()
  const sheetsDataCellsStore = useSheetsDataCellsStore()

  const { getActiveCell, setActiveCell } = useActiveCell()
  const { editingCellId, activateEditor, stopEditing } = useCellEditing()
  const { extendSelection, clearSelection, hasSelection, getSelectionEnd, getSelectionBounds } = useSelection()

  function startEditingMode(cellId: string, initialInput?: string) {
    const cell = document.querySelector(`[data-cell-id="${cellId}"]`) as HTMLElement | null

    if (!cell)
      return

    activateEditor(cellId, { element: cell, initialInput })
  }

  function stopEditingMode() {
    stopEditing()
    containerRef.value?.focus()
  }

  function handleArrowUp(event: KeyboardEvent, ctx: NavigationCtx): NavigationResult {
    const { sheetId, currentCellId, colIndex, rowIndex, rowOrder, shift, ctrl } = ctx

    if (shift) {
      event.preventDefault()

      const endId = getSelectionEnd(sheetId) ?? currentCellId
      const { columnLetter: endCol, rowNumber: endRow } = parseCellId(endId)
      const newEndRowIdx = ctrl ? 0 : Math.max(0, rowOrder.indexOf(endRow) - 1)
      extendSelection(sheetId, getCellId(endCol, rowOrder[newEndRowIdx]))

      return null
    }

    clearSelection(sheetId)

    return {
      colIndex,
      rowIndex: ctrl ? 0 : Math.max(0, rowIndex - 1),
    }
  }

  function handleArrowDown(event: KeyboardEvent, ctx: NavigationCtx): NavigationResult {
    const { sheetId, currentCellId, colIndex, rowIndex, rowOrder, shift, ctrl } = ctx

    if (shift) {
      event.preventDefault()

      const endId = getSelectionEnd(sheetId) ?? currentCellId
      const { columnLetter: endCol, rowNumber: endRow } = parseCellId(endId)
      const newEndRowIdx = ctrl ? rowOrder.length - 1 : Math.min(rowOrder.length - 1, rowOrder.indexOf(endRow) + 1)
      extendSelection(sheetId, getCellId(endCol, rowOrder[newEndRowIdx]))

      return null
    }

    clearSelection(sheetId)

    return {
      colIndex,
      rowIndex: ctrl ? rowOrder.length - 1 : Math.min(rowOrder.length - 1, rowIndex + 1),
    }
  }

  function handleArrowLeft(event: KeyboardEvent, ctx: NavigationCtx): NavigationResult {
    const { sheetId, currentCellId, colIndex, rowIndex, columnOrder, shift, ctrl } = ctx

    if (shift) {
      event.preventDefault()

      const endId = getSelectionEnd(sheetId) ?? currentCellId
      const { columnLetter: endCol, rowNumber: endRow } = parseCellId(endId)
      const newEndColIdx = ctrl ? 0 : Math.max(0, columnOrder.indexOf(endCol) - 1)
      extendSelection(sheetId, getCellId(columnOrder[newEndColIdx], endRow))

      return null
    }

    clearSelection(sheetId)

    return {
      colIndex: ctrl ? 0 : Math.max(0, colIndex - 1),
      rowIndex,
    }
  }

  function handleArrowRight(event: KeyboardEvent, ctx: NavigationCtx): NavigationResult {
    const { sheetId, currentCellId, colIndex, rowIndex, columnOrder, shift, ctrl } = ctx

    if (shift) {
      event.preventDefault()

      const endId = getSelectionEnd(sheetId) ?? currentCellId
      const { columnLetter: endCol, rowNumber: endRow } = parseCellId(endId)
      const newEndColIdx = ctrl
        ? columnOrder.length - 1
        : Math.min(columnOrder.length - 1, columnOrder.indexOf(endCol) + 1)
      extendSelection(sheetId, getCellId(columnOrder[newEndColIdx], endRow))

      return null
    }

    clearSelection(sheetId)

    return {
      colIndex: ctrl ? columnOrder.length - 1 : Math.min(columnOrder.length - 1, colIndex + 1),
      rowIndex,
    }
  }

  function handleTab(ctx: NavigationCtx): NavigationResult {
    const { sheetId, colIndex, rowIndex, columnOrder, shift } = ctx

    stopEditingMode()

    if (hasSelection(sheetId)) {
      const bounds = getSelectionBounds(sheetId)!

      if (shift) {
        return {
          colIndex: colIndex > bounds.minColIndex ? colIndex - 1 : bounds.maxColIndex,
          rowIndex: colIndex > bounds.minColIndex
            ? rowIndex
            : rowIndex > bounds.minRowIndex ? rowIndex - 1 : bounds.maxRowIndex,
        }
      }

      return {
        colIndex: colIndex < bounds.maxColIndex ? colIndex + 1 : bounds.minColIndex,
        rowIndex: colIndex < bounds.maxColIndex
          ? rowIndex
          : rowIndex < bounds.maxRowIndex ? rowIndex + 1 : bounds.minRowIndex,
      }
    }

    return {
      colIndex: Math.max(0, Math.min(columnOrder.length - 1, colIndex + (shift ? -1 : 1))),
      rowIndex,
    }
  }

  function handleEnter(ctx: NavigationCtx): NavigationResult {
    const { sheetId, currentCellId, colIndex, rowIndex, rowOrder, shift } = ctx
    const wasEditing = Boolean(editingCellId.value)

    if (hasSelection(sheetId)) {
      if (wasEditing)
        stopEditingMode()

      const bounds = getSelectionBounds(sheetId)!

      if (shift) {
        return {
          rowIndex: rowIndex > bounds.minRowIndex ? rowIndex - 1 : bounds.maxRowIndex,
          colIndex: rowIndex > bounds.minRowIndex
            ? colIndex
            : colIndex > bounds.minColIndex ? colIndex - 1 : bounds.maxColIndex,
        }
      }

      return {
        rowIndex: rowIndex < bounds.maxRowIndex ? rowIndex + 1 : bounds.minRowIndex,
        colIndex: rowIndex < bounds.maxRowIndex
          ? colIndex
          : colIndex < bounds.maxColIndex ? colIndex + 1 : bounds.minColIndex,
      }
    }

    if (wasEditing) {
      stopEditingMode()

      return {
        colIndex,
        rowIndex: Math.min(rowOrder.length - 1, rowIndex + (shift ? -1 : 1)),
      }
    }

    startEditingMode(currentCellId)
    return null
  }

  function handleEscape(): void {
    stopEditingMode()
  }

  async function handleDeleteBackspace(event: KeyboardEvent, ctx: NavigationCtx): Promise<NavigationResult> {
    if (editingCellId.value)
      return null

    event.preventDefault()
    await sheetsDataCellsStore.updateCellValue(ctx.currentCellId, '')

    return null
  }

  function handleDefault(event: KeyboardEvent, ctx: NavigationCtx): NavigationResult {
    if (editingCellId.value)
      return null

    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
      event.preventDefault()
      startEditingMode(ctx.currentCellId, event.key)
    }

    return null
  }

  async function handleKeydown(event: KeyboardEvent) {
    if (!sheetsStore.currentSheetId)
      return

    if (!containerRef.value || !containerRef.value.contains(document.activeElement))
      return

    const editModeNavigationKeys = ['Tab', 'Enter', 'Escape']

    if (editingCellId.value && !editModeNavigationKeys.includes(event.key))
      return

    const sheetId = sheetsStore.currentSheetId
    const currentCellId = getActiveCell(sheetsStore.currentSheetId)
    const { columnLetter, rowNumber } = parseCellId(currentCellId)

    const columnOrder = sheetsDataStore.currentSheetData?.columnOrder ?? []
    const rowOrder = sheetsDataStore.currentSheetData?.rowOrder ?? []

    const colIndex = columnOrder.indexOf(columnLetter)
    const rowIndex = rowOrder.indexOf(rowNumber)

    if (colIndex === -1 || rowIndex === -1)
      return

    const ctx: NavigationCtx = {
      sheetId,
      currentCellId,
      colIndex,
      rowIndex,
      columnOrder,
      rowOrder,
      shift: event.shiftKey,
      ctrl: event.ctrlKey || event.metaKey,
    }

    let result: NavigationResult = null

    switch (event.key) {
      case 'ArrowUp':
        result = handleArrowUp(event, ctx)
        break
      case 'ArrowDown':
        result = handleArrowDown(event, ctx)
        break
      case 'ArrowLeft':
        result = handleArrowLeft(event, ctx)
        break
      case 'ArrowRight':
        result = handleArrowRight(event, ctx)
        break
      case 'Tab':
        result = handleTab(ctx)
        break
      case 'Enter':
        result = handleEnter(ctx)
        break
      case 'Escape':
        handleEscape()
        return
      case 'Delete': case 'Backspace':
        await handleDeleteBackspace(event, ctx)
        return
      default:
        handleDefault(event, ctx)
        return
    }

    if (result) {
      event.preventDefault()

      const newCol = columnOrder[result.colIndex]
      const newRow = rowOrder[result.rowIndex]

      if (newCol && newRow)
        setActiveCell(sheetId, getCellId(newCol, newRow))
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
}
