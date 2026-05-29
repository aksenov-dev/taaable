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
  const {
    setSelectionRange,
    clearSelection,
    hasSelection,
    getSelectionStart,
    getSelectionEnd,
    getSelectionBounds,
    getSelectedCellIds,
    getSelectionRangeCount,
  } = useSelection()

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

  function getSelectionEndpoints(ctx: NavigationCtx) {
    const { sheetId, currentCellId, columnOrder, rowOrder } = ctx

    const startId = getSelectionStart(sheetId) ?? currentCellId
    const endId = getSelectionEnd(sheetId) ?? currentCellId

    const { columnLetter: startCol, rowNumber: startRow } = parseCellId(startId)
    const { columnLetter: endCol, rowNumber: endRow } = parseCellId(endId)

    return {
      startId,
      endId,
      startCol,
      startRow,
      endCol,
      endRow,
      startColIndex: columnOrder.indexOf(startCol),
      endColIndex: columnOrder.indexOf(endCol),
      startRowIndex: rowOrder.indexOf(startRow),
      endRowIndex: rowOrder.indexOf(endRow),
    }
  }

  function cycleSelection(
    currentCellId: string,
    sheetId: string,
    columnOrder: string[],
    rowOrder: string[],
    dir: number,
    vertical = false,
  ): NavigationResult {
    const cellIndex = getSelectedCellIds(sheetId, columnOrder, rowOrder, vertical)
    const nextIndex = (cellIndex.indexOf(currentCellId) + dir + cellIndex.length) % cellIndex.length
    const { columnLetter, rowNumber } = parseCellId(cellIndex[nextIndex])

    return { columnIndex: columnOrder.indexOf(columnLetter), rowIndex: rowOrder.indexOf(rowNumber) }
  }

  function handleArrowUp(event: KeyboardEvent, ctx: NavigationCtx): NavigationResult {
    const { sheetId, columnIndex, rowIndex, rowOrder, shift, ctrl } = ctx

    if (!shift) {
      clearSelection(sheetId)

      return {
        columnIndex,
        rowIndex: ctrl ? 0 : Math.max(0, rowIndex - 1),
      }
    }

    event.preventDefault()

    const { startId, startCol, endCol, startRowIndex, endRowIndex } = getSelectionEndpoints(ctx)

    const newEndRowIndex = ctrl ? 0 : Math.max(0, endRowIndex - 1)
    const newBottomRowIndex = Math.max(startRowIndex, newEndRowIndex)

    if (rowIndex > newBottomRowIndex) {
      const newTopRowIndex = ctrl ? 0 : Math.max(0, startRowIndex - 1)
      const newStartId = getCellId(startCol, rowOrder[newTopRowIndex])
      const newEndId = getCellId(endCol, rowOrder[rowIndex])

      setSelectionRange(sheetId, newStartId, newEndId)
    }
    else {
      setSelectionRange(sheetId, startId, getCellId(endCol, rowOrder[newEndRowIndex]))
    }

    return null
  }

  function handleArrowDown(event: KeyboardEvent, ctx: NavigationCtx): NavigationResult {
    const { sheetId, columnIndex, rowIndex, rowOrder, shift, ctrl } = ctx

    if (!shift) {
      clearSelection(sheetId)

      return {
        columnIndex,
        rowIndex: ctrl ? rowOrder.length - 1 : Math.min(rowOrder.length - 1, rowIndex + 1),
      }
    }

    event.preventDefault()

    const { startCol, endCol, startRowIndex, endRowIndex } = getSelectionEndpoints(ctx)

    const newEndRowIndex = ctrl ? rowOrder.length - 1 : Math.min(rowOrder.length - 1, endRowIndex + 1)
    const newTopRowIndex = Math.min(startRowIndex + 1, newEndRowIndex)

    if (ctrl || rowIndex < newTopRowIndex) {
      const newStartId = getCellId(startCol, rowOrder[newEndRowIndex])
      const newEndId = getCellId(endCol, rowOrder[rowIndex])

      setSelectionRange(sheetId, newStartId, newEndId)
    }
    else {
      setSelectionRange(
        sheetId,
        getCellId(startCol, rowOrder[startRowIndex + 1]),
        getCellId(endCol, rowOrder[endRowIndex]),
      )
    }

    return null
  }

  function handleArrowLeft(event: KeyboardEvent, ctx: NavigationCtx): NavigationResult {
    const { sheetId, columnIndex, rowIndex, columnOrder, shift, ctrl } = ctx

    if (!shift) {
      clearSelection(sheetId)

      return {
        columnIndex: ctrl ? 0 : Math.max(0, columnIndex - 1),
        rowIndex,
      }
    }

    event.preventDefault()

    const { startId, startRow, endRow, startColIndex, endColIndex } = getSelectionEndpoints(ctx)

    const newEndColIndex = ctrl ? 0 : Math.max(0, endColIndex - 1)
    const newRightColIndex = Math.max(startColIndex, newEndColIndex)

    if (columnIndex > newRightColIndex) {
      const newLeftColIdx = ctrl ? 0 : Math.max(0, startColIndex - 1)
      const newStartId = getCellId(columnOrder[newLeftColIdx], startRow)
      const newEndId = getCellId(columnOrder[columnIndex], endRow)

      setSelectionRange(sheetId, newStartId, newEndId)
    }
    else {
      setSelectionRange(sheetId, startId, getCellId(columnOrder[newEndColIndex], endRow))
    }

    return null
  }

  function handleArrowRight(event: KeyboardEvent, ctx: NavigationCtx): NavigationResult {
    const { sheetId, columnIndex, rowIndex, columnOrder, shift, ctrl } = ctx

    if (!shift) {
      clearSelection(sheetId)

      return {
        columnIndex: ctrl ? columnOrder.length - 1 : Math.min(columnOrder.length - 1, columnIndex + 1),
        rowIndex,
      }
    }

    event.preventDefault()

    const { startRow, endRow, startColIndex, endColIndex } = getSelectionEndpoints(ctx)

    const newEndColIndex = ctrl ? columnOrder.length - 1 : Math.min(columnOrder.length - 1, endColIndex + 1)
    const newLeftColIndex = Math.min(startColIndex + 1, newEndColIndex)

    if (ctrl || columnIndex < newLeftColIndex) {
      const newStartId = getCellId(columnOrder[newEndColIndex], startRow)
      const newEndId = getCellId(columnOrder[columnIndex], endRow)

      setSelectionRange(sheetId, newStartId, newEndId)
    }
    else {
      setSelectionRange(
        sheetId,
        getCellId(columnOrder[startColIndex + 1], startRow),
        getCellId(columnOrder[endColIndex], endRow),
      )
    }

    return null
  }

  function handleTab(ctx: NavigationCtx): NavigationResult {
    const { sheetId, currentCellId, columnIndex, rowIndex, columnOrder, rowOrder, shift } = ctx
    const dir = shift ? -1 : 1

    stopEditingMode()

    if (hasSelection(sheetId)) {
      if (getSelectionRangeCount(sheetId) > 1)
        return cycleSelection(currentCellId, sheetId, columnOrder, rowOrder, dir)

      const bounds = getSelectionBounds(sheetId)

      if (!bounds)
        return null

      const canMoveInRow = shift
        ? columnIndex > bounds.minColIndex
        : columnIndex < bounds.maxColIndex

      const newColIndex = canMoveInRow
        ? columnIndex + dir
        : shift ? bounds.maxColIndex : bounds.minColIndex

      const newRowIndex = canMoveInRow
        ? rowIndex
        : shift
          ? rowIndex > bounds.minRowIndex ? rowIndex - 1 : bounds.maxRowIndex
          : rowIndex < bounds.maxRowIndex ? rowIndex + 1 : bounds.minRowIndex

      return { columnIndex: newColIndex, rowIndex: newRowIndex }
    }

    return {
      columnIndex: Math.max(0, Math.min(columnOrder.length - 1, columnIndex + dir)),
      rowIndex,
    }
  }

  function handleEnter(event: KeyboardEvent, ctx: NavigationCtx): NavigationResult {
    const { sheetId, currentCellId, columnIndex, rowIndex, rowOrder, columnOrder, shift } = ctx
    const dir = shift ? -1 : 1
    const wasEditing = Boolean(editingCellId.value)

    if (hasSelection(sheetId)) {
      if (wasEditing)
        stopEditingMode()

      if (getSelectionRangeCount(sheetId) > 1)
        return cycleSelection(currentCellId, sheetId, columnOrder, rowOrder, dir, true)

      const bounds = getSelectionBounds(sheetId)

      if (!bounds)
        return null

      const canMoveInCol = shift
        ? rowIndex > bounds.minRowIndex
        : rowIndex < bounds.maxRowIndex

      const newRowIndex = canMoveInCol
        ? rowIndex + dir
        : shift ? bounds.maxRowIndex : bounds.minRowIndex

      const newColIndex = canMoveInCol
        ? columnIndex
        : shift
          ? columnIndex > bounds.minColIndex ? columnIndex - 1 : bounds.maxColIndex
          : columnIndex < bounds.maxColIndex ? columnIndex + 1 : bounds.minColIndex

      return { columnIndex: newColIndex, rowIndex: newRowIndex }
    }

    if (wasEditing) {
      stopEditingMode()

      return {
        columnIndex,
        rowIndex: Math.min(rowOrder.length - 1, rowIndex + dir),
      }
    }

    event.preventDefault()
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

    if (hasSelection(ctx.sheetId)) {
      const cellIds = getSelectedCellIds(ctx.sheetId, ctx.columnOrder, ctx.rowOrder)
      await Promise.all(cellIds.map(id => sheetsDataCellsStore.updateCellValue(id, '')))
    }
    else {
      await sheetsDataCellsStore.updateCellValue(ctx.currentCellId, '')
    }

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

    const columnIndex = columnOrder.indexOf(columnLetter)
    const rowIndex = rowOrder.indexOf(rowNumber)

    if (columnIndex === -1 || rowIndex === -1)
      return

    const ctx: NavigationCtx = {
      sheetId,
      currentCellId,
      columnIndex,
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
        result = handleEnter(event, ctx)
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

      const newCol = columnOrder[result.columnIndex]
      const newRow = rowOrder[result.rowIndex]

      if (newCol && newRow)
        setActiveCell(sheetId, getCellId(newCol, newRow))
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
}
