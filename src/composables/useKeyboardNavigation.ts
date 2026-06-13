import { onMounted, onUnmounted, ref } from 'vue'
import type { Ref } from 'vue'

import type { NavigationCtx, NavigationResult, TextFormatKey } from '@/shared/types'

import {
  getCellId,
  parseCellId,
  resolveNavColContext,
  resolveTabRowContext,
  skipCoveredCols,
  skipCoveredRows,
} from '@/shared/utils'

import { useSheetsStore } from '@/stores/sheets'
import { useSheetsDataStore } from '@/stores/sheetsData'
import { useSheetsDataCellsStore } from '@/stores/sheetsData/cells'
import { useSheetsDataMergesStore } from '@/stores/sheetsData/merges'
import { useActiveCell } from '@/composables/useActiveCell'
import { useCellEditing } from '@/composables/useCellEditing'
import { useSelection } from '@/composables/useSelection'

export function useKeyboardNavigation(containerRef: Ref<HTMLDivElement | null>) {
  const sheetsStore = useSheetsStore()
  const sheetsDataStore = useSheetsDataStore()
  const sheetsDataCellsStore = useSheetsDataCellsStore()
  const mergesStore = useSheetsDataMergesStore()

  const tabRowContext = ref<string | null>(null)
  const navColContext = ref<string | null>(null)

  const { getActiveCell, setActiveCell } = useActiveCell()
  const { editingCellId, activateEditor, stopEditing } = useCellEditing()
  const {
    setSelectionRange,
    clearSelection,
    hasSelection,
    getSelectionStart,
    getSelectionEnd,
    getSelectedCellIds,
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

    const { columnLetter: startColumn, rowNumber: startRow } = parseCellId(startId)
    const { columnLetter: endColumn, rowNumber: endRow } = parseCellId(endId)

    return {
      startId,
      endId,
      startColumn,
      startRow,
      endColumn,
      endRow,
      startColumnIndex: columnOrder.indexOf(startColumn),
      endColumnIndex: columnOrder.indexOf(endColumn),
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
      .filter(id => !mergesStore.mergeCoveredSet.has(id))

    const nextIndex = (cellIndex.indexOf(currentCellId) + dir + cellIndex.length) % cellIndex.length
    const { columnLetter, rowNumber } = parseCellId(cellIndex[nextIndex])

    return { columnIndex: columnOrder.indexOf(columnLetter), rowIndex: rowOrder.indexOf(rowNumber) }
  }

  function handleArrowUp(event: KeyboardEvent, ctx: NavigationCtx): NavigationResult {
    const { sheetId, currentCellId, columnIndex, columnOrder, rowIndex, rowOrder, shift, ctrl } = ctx

    if (!shift) {
      clearSelection(sheetId)
      tabRowContext.value = null

      const effectiveColIndex = navColContext.value !== null
        ? columnOrder.indexOf(navColContext.value)
        : columnIndex

      let newRowIndex = ctrl ? 0 : Math.max(0, rowIndex - 1)
      const targetId = getCellId(columnOrder[effectiveColIndex], rowOrder[newRowIndex])

      if (mergesStore.mergeCoveredSet.has(targetId)) {
        const anchorId = mergesStore.coveredToAnchorMap[targetId]
        const { columnLetter: anchorCol, rowNumber: anchorRow } = parseCellId(anchorId)

        if (anchorId === currentCellId) {
          newRowIndex = skipCoveredRows(
            newRowIndex,
            effectiveColIndex,
            -1,
            rowOrder,
            columnOrder,
            mergesStore.mergeCoveredSet,
            mergesStore.coveredToAnchorMap,
            currentCellId,
          )

          navColContext.value = resolveNavColContext(
            effectiveColIndex,
            newRowIndex,
            columnOrder,
            rowOrder,
            mergesStore.coveredToAnchorMap,
          )
        }
        else if (anchorCol !== columnOrder[effectiveColIndex]) {
          navColContext.value = columnOrder[effectiveColIndex]

          return {
            columnIndex: columnOrder.indexOf(anchorCol),
            rowIndex: rowOrder.indexOf(anchorRow),
          }
        }
        else {
          navColContext.value = null
        }
      }
      else {
        navColContext.value = null
      }

      return { columnIndex: effectiveColIndex, rowIndex: newRowIndex }
    }

    event.preventDefault()

    const { startId, startColumn, endColumn, startRowIndex, endRowIndex } = getSelectionEndpoints(ctx)

    const newEndRowIndex = ctrl ? 0 : Math.max(0, endRowIndex - 1)
    const newBottomRowIndex = Math.max(startRowIndex, newEndRowIndex)

    if (rowIndex > newBottomRowIndex) {
      const newTopRowIndex = ctrl ? 0 : Math.max(0, startRowIndex - 1)
      const newStartId = getCellId(startColumn, rowOrder[newTopRowIndex])
      const newEndId = getCellId(endColumn, rowOrder[rowIndex])

      setSelectionRange(sheetId, newStartId, newEndId)
    }
    else {
      setSelectionRange(sheetId, startId, getCellId(endColumn, rowOrder[newEndRowIndex]))
    }

    return null
  }

  function handleArrowDown(event: KeyboardEvent, ctx: NavigationCtx): NavigationResult {
    const { sheetId, currentCellId, columnIndex, rowIndex, columnOrder, rowOrder, shift, ctrl } = ctx

    if (!shift) {
      clearSelection(sheetId)
      tabRowContext.value = null

      const effectiveColIndex = navColContext.value !== null
        ? columnOrder.indexOf(navColContext.value)
        : columnIndex

      let newRowIndex = ctrl ? rowOrder.length - 1 : Math.min(rowOrder.length - 1, rowIndex + 1)
      const targetId = getCellId(columnOrder[effectiveColIndex], rowOrder[newRowIndex])

      if (mergesStore.mergeCoveredSet.has(targetId)) {
        const anchorId = mergesStore.coveredToAnchorMap[targetId]
        const { columnLetter: anchorCol, rowNumber: anchorRow } = parseCellId(anchorId)

        if (anchorId === currentCellId) {
          newRowIndex = skipCoveredRows(
            newRowIndex,
            effectiveColIndex,
            1,
            rowOrder,
            columnOrder,
            mergesStore.mergeCoveredSet,
            mergesStore.coveredToAnchorMap,
            currentCellId,
          )

          navColContext.value = resolveNavColContext(
            effectiveColIndex,
            newRowIndex,
            columnOrder,
            rowOrder,
            mergesStore.coveredToAnchorMap,
          )
        }
        else if (anchorCol !== columnOrder[effectiveColIndex]) {
          navColContext.value = columnOrder[effectiveColIndex]

          return {
            columnIndex: columnOrder.indexOf(anchorCol),
            rowIndex: rowOrder.indexOf(anchorRow),
          }
        }
        else {
          newRowIndex = skipCoveredRows(
            newRowIndex,
            effectiveColIndex,
            1,
            rowOrder,
            columnOrder,
            mergesStore.mergeCoveredSet,
            mergesStore.coveredToAnchorMap,
          )

          navColContext.value = null
        }
      }
      else {
        navColContext.value = null
      }

      return { columnIndex: effectiveColIndex, rowIndex: newRowIndex }
    }

    event.preventDefault()

    const { startColumn, endColumn, startRowIndex, endRowIndex } = getSelectionEndpoints(ctx)

    const newEndRowIndex = ctrl ? rowOrder.length - 1 : Math.min(rowOrder.length - 1, endRowIndex + 1)
    const newTopRowIndex = Math.min(startRowIndex + 1, newEndRowIndex)

    if (ctrl || rowIndex < newTopRowIndex) {
      const newStartId = getCellId(startColumn, rowOrder[newEndRowIndex])
      const newEndId = getCellId(endColumn, rowOrder[rowIndex])

      setSelectionRange(sheetId, newStartId, newEndId)
    }
    else {
      setSelectionRange(
        sheetId,
        getCellId(startColumn, rowOrder[startRowIndex + 1]),
        getCellId(endColumn, rowOrder[endRowIndex]),
      )
    }

    return null
  }

  function handleArrowLeft(event: KeyboardEvent, ctx: NavigationCtx): NavigationResult {
    const { sheetId, currentCellId, columnIndex, rowIndex, columnOrder, rowOrder, shift, ctrl } = ctx

    if (!shift) {
      clearSelection(sheetId)
      navColContext.value = null

      const effectiveRowIndex = tabRowContext.value !== null
        ? rowOrder.indexOf(tabRowContext.value)
        : rowIndex

      let newColIndex = ctrl ? 0 : Math.max(0, columnIndex - 1)
      const targetId = getCellId(columnOrder[newColIndex], rowOrder[effectiveRowIndex])

      if (mergesStore.mergeCoveredSet.has(targetId)) {
        const anchorId = mergesStore.coveredToAnchorMap[targetId]
        const { columnLetter: anchorCol, rowNumber: anchorRow } = parseCellId(anchorId)

        if (anchorId === currentCellId) {
          newColIndex = skipCoveredCols(
            newColIndex,
            effectiveRowIndex,
            -1,
            columnOrder,
            rowOrder,
            mergesStore.mergeCoveredSet,
            mergesStore.coveredToAnchorMap,
            currentCellId,
          )

          tabRowContext.value = resolveTabRowContext(
            newColIndex,
            effectiveRowIndex,
            columnOrder,
            rowOrder,
            mergesStore.coveredToAnchorMap,
          )
        }
        else if (anchorRow !== rowOrder[effectiveRowIndex]) {
          tabRowContext.value = rowOrder[effectiveRowIndex]

          return {
            columnIndex: columnOrder.indexOf(anchorCol),
            rowIndex: rowOrder.indexOf(anchorRow),
          }
        }
        else {
          newColIndex = skipCoveredCols(
            newColIndex,
            effectiveRowIndex,
            -1,
            columnOrder,
            rowOrder,
            mergesStore.mergeCoveredSet,
            mergesStore.coveredToAnchorMap,
          )

          tabRowContext.value = null
        }
      }
      else {
        tabRowContext.value = null
      }

      return { columnIndex: newColIndex, rowIndex: effectiveRowIndex }
    }

    event.preventDefault()

    const { startId, startRow, endRow, startColumnIndex, endColumnIndex } = getSelectionEndpoints(ctx)

    const newEndColumnIndex = ctrl ? 0 : Math.max(0, endColumnIndex - 1)
    const newRightColumnIndex = Math.max(startColumnIndex, newEndColumnIndex)

    if (columnIndex > newRightColumnIndex) {
      const newLeftColumnIndex = ctrl ? 0 : Math.max(0, startColumnIndex - 1)
      const newStartId = getCellId(columnOrder[newLeftColumnIndex], startRow)
      const newEndId = getCellId(columnOrder[columnIndex], endRow)

      setSelectionRange(sheetId, newStartId, newEndId)
    }
    else {
      setSelectionRange(sheetId, startId, getCellId(columnOrder[newEndColumnIndex], endRow))
    }

    return null
  }

  function handleArrowRight(event: KeyboardEvent, ctx: NavigationCtx): NavigationResult {
    const { sheetId, currentCellId, columnIndex, rowIndex, columnOrder, rowOrder, shift, ctrl } = ctx

    if (!shift) {
      clearSelection(sheetId)
      navColContext.value = null

      const effectiveRowIndex = tabRowContext.value !== null
        ? rowOrder.indexOf(tabRowContext.value)
        : rowIndex

      let newColIndex = ctrl ? columnOrder.length - 1 : Math.min(columnOrder.length - 1, columnIndex + 1)
      const targetId = getCellId(columnOrder[newColIndex], rowOrder[effectiveRowIndex])

      if (mergesStore.mergeCoveredSet.has(targetId)) {
        const anchorId = mergesStore.coveredToAnchorMap[targetId]
        const { columnLetter: anchorCol, rowNumber: anchorRow } = parseCellId(anchorId)

        if (anchorId === currentCellId) {
          newColIndex = skipCoveredCols(
            newColIndex,
            effectiveRowIndex,
            1,
            columnOrder,
            rowOrder,
            mergesStore.mergeCoveredSet,
            mergesStore.coveredToAnchorMap,
            currentCellId,
          )

          tabRowContext.value = resolveTabRowContext(
            newColIndex,
            effectiveRowIndex,
            columnOrder,
            rowOrder,
            mergesStore.coveredToAnchorMap,
          )
        }
        else if (anchorRow !== rowOrder[effectiveRowIndex]) {
          tabRowContext.value = rowOrder[effectiveRowIndex]

          return {
            columnIndex: columnOrder.indexOf(anchorCol),
            rowIndex: rowOrder.indexOf(anchorRow),
          }
        }
        else {
          newColIndex = skipCoveredCols(
            newColIndex,
            effectiveRowIndex,
            1,
            columnOrder,
            rowOrder,
            mergesStore.mergeCoveredSet,
            mergesStore.coveredToAnchorMap,
          )

          tabRowContext.value = null
        }
      }
      else {
        tabRowContext.value = null
      }

      return { columnIndex: newColIndex, rowIndex: effectiveRowIndex }
    }

    event.preventDefault()

    const { startRow, endRow, startColumnIndex, endColumnIndex } = getSelectionEndpoints(ctx)

    const newEndColumnIndex = ctrl ? columnOrder.length - 1 : Math.min(columnOrder.length - 1, endColumnIndex + 1)
    const newLeftColumnIndex = Math.min(startColumnIndex + 1, newEndColumnIndex)

    if (ctrl || columnIndex < newLeftColumnIndex) {
      const newStartId = getCellId(columnOrder[newEndColumnIndex], startRow)
      const newEndId = getCellId(columnOrder[columnIndex], endRow)

      setSelectionRange(sheetId, newStartId, newEndId)
    }
    else {
      setSelectionRange(
        sheetId,
        getCellId(columnOrder[startColumnIndex + 1], startRow),
        getCellId(columnOrder[endColumnIndex], endRow),
      )
    }

    return null
  }

  function handleTab(ctx: NavigationCtx): NavigationResult {
    const { sheetId, currentCellId, columnIndex, rowIndex, columnOrder, rowOrder, shift } = ctx
    const dir = shift ? -1 : 1

    stopEditingMode()

    if (hasSelection(sheetId)) {
      const nonCovered = getSelectedCellIds(sheetId, columnOrder, rowOrder, false)
        .filter(id => !mergesStore.mergeCoveredSet.has(id))

      if (nonCovered.length > 1)
        return cycleSelection(currentCellId, sheetId, columnOrder, rowOrder, dir)

      clearSelection(sheetId)
    }

    const effectiveRowIndex = tabRowContext.value !== null
      ? rowOrder.indexOf(tabRowContext.value)
      : rowIndex

    let newColIndex = Math.max(0, Math.min(columnOrder.length - 1, columnIndex + dir))
    const targetId = getCellId(columnOrder[newColIndex], rowOrder[effectiveRowIndex])

    if (mergesStore.mergeCoveredSet.has(targetId)) {
      const anchorId = mergesStore.coveredToAnchorMap[targetId]
      const { columnLetter: anchorCol, rowNumber: anchorRow } = parseCellId(anchorId)

      if (anchorId === currentCellId) {
        newColIndex = skipCoveredCols(
          newColIndex,
          effectiveRowIndex,
          dir,
          columnOrder,
          rowOrder,
          mergesStore.mergeCoveredSet,
          mergesStore.coveredToAnchorMap,
          currentCellId,
        )

        tabRowContext.value = resolveTabRowContext(
          newColIndex,
          effectiveRowIndex,
          columnOrder,
          rowOrder,
          mergesStore.coveredToAnchorMap,
        )
      }
      else if (anchorRow !== rowOrder[effectiveRowIndex]) {
        tabRowContext.value = rowOrder[effectiveRowIndex]

        return {
          columnIndex: columnOrder.indexOf(anchorCol),
          rowIndex: rowOrder.indexOf(anchorRow),
        }
      }
      else {
        newColIndex = skipCoveredCols(
          newColIndex,
          effectiveRowIndex,
          dir,
          columnOrder,
          rowOrder,
          mergesStore.mergeCoveredSet,
          mergesStore.coveredToAnchorMap,
        )

        tabRowContext.value = null
      }
    }
    else {
      tabRowContext.value = null
    }

    return { columnIndex: newColIndex, rowIndex: effectiveRowIndex }
  }

  function handleEnter(event: KeyboardEvent, ctx: NavigationCtx): NavigationResult {
    const { sheetId, currentCellId, columnIndex, rowIndex, rowOrder, columnOrder, shift } = ctx
    const dir = shift ? -1 : 1
    const wasEditing = Boolean(editingCellId.value)

    if (hasSelection(sheetId)) {
      if (wasEditing)
        stopEditingMode()

      const nonCovered = getSelectedCellIds(sheetId, columnOrder, rowOrder, true)
        .filter(id => !mergesStore.mergeCoveredSet.has(id))

      if (nonCovered.length > 1)
        return cycleSelection(currentCellId, sheetId, columnOrder, rowOrder, dir, true)

      clearSelection(sheetId)
    }

    if (wasEditing) {
      stopEditingMode()
      tabRowContext.value = null

      const effectiveColIndex = navColContext.value !== null
        ? columnOrder.indexOf(navColContext.value)
        : columnIndex

      let newRowIndex = Math.min(rowOrder.length - 1, rowIndex + dir)
      const targetId = getCellId(columnOrder[effectiveColIndex], rowOrder[newRowIndex])

      if (mergesStore.mergeCoveredSet.has(targetId)) {
        const anchorId = mergesStore.coveredToAnchorMap[targetId]
        const { columnLetter: anchorCol, rowNumber: anchorRow } = parseCellId(anchorId)

        if (anchorId === currentCellId) {
          newRowIndex = skipCoveredRows(
            newRowIndex,
            effectiveColIndex,
            dir,
            rowOrder,
            columnOrder,
            mergesStore.mergeCoveredSet,
            mergesStore.coveredToAnchorMap,
            currentCellId,
          )

          navColContext.value = resolveNavColContext(
            effectiveColIndex,
            newRowIndex,
            columnOrder,
            rowOrder,
            mergesStore.coveredToAnchorMap,
          )
        }
        else if (anchorCol !== columnOrder[effectiveColIndex]) {
          navColContext.value = columnOrder[effectiveColIndex]

          return {
            columnIndex: columnOrder.indexOf(anchorCol),
            rowIndex: rowOrder.indexOf(anchorRow),
          }
        }
        else {
          newRowIndex = skipCoveredRows(
            newRowIndex,
            effectiveColIndex,
            dir,
            rowOrder,
            columnOrder,
            mergesStore.mergeCoveredSet,
            mergesStore.coveredToAnchorMap,
          )

          navColContext.value = null
        }
      }
      else {
        navColContext.value = null
      }

      return { columnIndex: effectiveColIndex, rowIndex: newRowIndex }
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

  async function handleStyleToggle(event: KeyboardEvent, ctx: NavigationCtx, key: TextFormatKey): Promise<void> {
    if (!ctx.ctrl) {
      handleDefault(event, ctx)
      return
    }

    event.preventDefault()
    await sheetsDataCellsStore.toggleSelectionStyle(key)
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
      case 'b':
        await handleStyleToggle(event, ctx, 'bold')
        return
      case 'i':
        await handleStyleToggle(event, ctx, 'italic')
        return
      case 's':
        await handleStyleToggle(event, ctx, 'strikethrough')
        return
      default:
        handleDefault(event, ctx)
        return
    }

    if (result) {
      event.preventDefault()

      const newColumn = columnOrder[result.columnIndex]
      const newRow = rowOrder[result.rowIndex]

      if (newColumn && newRow) {
        const cellId = getCellId(newColumn, newRow)
        setActiveCell(sheetId, mergesStore.coveredToAnchorMap[cellId] ?? cellId)
      }
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
}
