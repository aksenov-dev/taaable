import { computed } from 'vue'
import { defineStore } from 'pinia'

import type { Merge, SelectionBounds, SheetData } from '@/shared/types'

import {
  generateMerge,
  getCellId,
  getMergeBounds,
  isMergeFullyContained,
  isMergeOverlapping,
  parseCellId,
  toCellDto,
} from '@/shared/utils'

import { createCellStorage } from '@/db/cellStorage'
import { createMergeStorage } from '@/db/mergeStorage'
import { useSheetsStore } from '@/stores/sheets'
import { useSheetsDataStore } from '@/stores/sheetsData'
import { useActiveCell } from '@/composables/useActiveCell'
import { useSelection } from '@/composables/useSelection'

export const useSheetsDataMergesStore = defineStore('sheetsDataMerges', () => {
  const sheetsStore = useSheetsStore()
  const sheetsDataStore = useSheetsDataStore()

  const mergeStorage = createMergeStorage()
  const cellStorage = createCellStorage()

  const { getActiveCell, setActiveCell } = useActiveCell()
  const { clearSelection, getContiguousSelectionBounds, getSelectionRangeCount, setSelectionRange } = useSelection()

  const anchorMerges = computed<Record<string, Merge>>(() => {
    const merges = sheetsDataStore.currentSheetData?.merges ?? {}
    return Object.fromEntries(Object.values(merges).map(m => [m.anchorCellId, m]))
  })

  const coveredToAnchorMap = computed<Record<string, string>>(() => {
    const sheetData = sheetsDataStore.currentSheetData
    if (!sheetData)
      return {}

    const { columnOrder, rowOrder, merges } = sheetData
    const map: Record<string, string> = {}

    for (const merge of Object.values(merges)) {
      const { columnLetter, rowNumber } = parseCellId(merge.anchorCellId)
      const columnIndex = columnOrder.indexOf(columnLetter)
      const rowIndex = rowOrder.indexOf(rowNumber)

      for (let columnOffset = 0; columnOffset < merge.colSpan; columnOffset++) {
        for (let rowOffset = 0; rowOffset < merge.rowSpan; rowOffset++) {
          if (columnOffset === 0 && rowOffset === 0)
            continue

          const column = columnOrder[columnIndex + columnOffset]
          const row = rowOrder[rowIndex + rowOffset]

          if (column && row)
            map[getCellId(column, row)] = merge.anchorCellId
        }
      }
    }

    return map
  })

  const mergeCoveredSet = computed(() => new Set(Object.keys(coveredToAnchorMap.value)))

  const activeCellMergeRange = computed<string | null>(() => {
    const sheetId = sheetsStore.currentSheetId
    if (!sheetId)
      return null

    const activeId = getActiveCell(sheetId)
    const merge = anchorMerges.value[activeId]

    if (!merge || (merge.colSpan === 1 && merge.rowSpan === 1))
      return null

    const sheetData = sheetsDataStore.currentSheetData
    if (!sheetData)
      return null

    const { columnLetter, rowNumber } = parseCellId(activeId)
    const colIndex = sheetData.columnOrder.indexOf(columnLetter)
    const rowIndex = sheetData.rowOrder.indexOf(rowNumber)
    const endCol = sheetData.columnOrder[colIndex + merge.colSpan - 1]
    const endRow = sheetData.rowOrder[rowIndex + merge.rowSpan - 1]

    if (!endCol || !endRow)
      return null

    const startId = activeId.replace(':', '')
    const endId = getCellId(endCol, endRow).replace(':', '')

    return `${startId}:${endId}`
  })

  const canMerge = computed<boolean>(() => {
    const sheetId = sheetsStore.currentSheetId
    if (!sheetId)
      return false

    const bounds = getContiguousSelectionBounds(sheetId)
    if (!bounds)
      return false

    const { minColumnIndex, maxColumnIndex, minRowIndex, maxRowIndex } = bounds
    const cellCount = (maxColumnIndex - minColumnIndex + 1) * (maxRowIndex - minRowIndex + 1)

    if (cellCount < 2)
      return false

    return !hasPartialOverlap(bounds)
  })

  const canMergeHorizontally = computed<boolean>(() => {
    const sheetId = sheetsStore.currentSheetId
    if (!sheetId)
      return false

    const bounds = getContiguousSelectionBounds(sheetId)
    if (!bounds)
      return false

    if (bounds.maxColumnIndex - bounds.minColumnIndex < 1)
      return false

    return !hasPartialOverlap(bounds)
  })

  const canMergeVertically = computed<boolean>(() => {
    const sheetId = sheetsStore.currentSheetId
    if (!sheetId)
      return false

    const bounds = getContiguousSelectionBounds(sheetId)
    if (!bounds)
      return false

    if (bounds.maxRowIndex - bounds.minRowIndex < 1)
      return false

    return !hasPartialOverlap(bounds)
  })

  const canUnmerge = computed<boolean>(() => {
    const sheetId = sheetsStore.currentSheetId
    if (!sheetId)
      return false

    if (getSelectionRangeCount(sheetId) > 1)
      return false

    const sheetData = sheetsDataStore.currentSheetData
    if (!sheetData)
      return false

    const bounds = getContiguousSelectionBounds(sheetId)

    if (bounds) {
      const { columnOrder, rowOrder, merges } = sheetData

      return Object.values(merges).some((merge) => {
        const mb = getMergeBounds(merge, columnOrder, rowOrder)
        return isMergeOverlapping(mb, bounds)
      })
    }

    const activeId = getActiveCell(sheetId)

    return activeId in anchorMerges.value || activeId in coveredToAnchorMap.value
  })

  function hasPartialOverlap(bounds: SelectionBounds): boolean {
    const sheetData = sheetsDataStore.currentSheetData
    if (!sheetData)
      return false

    const { columnOrder, rowOrder, merges } = sheetData

    for (const merge of Object.values(merges)) {
      const mergeBounds = getMergeBounds(merge, columnOrder, rowOrder)

      if (!isMergeOverlapping(mergeBounds, bounds))
        continue

      if (!isMergeFullyContained(mergeBounds, bounds))
        return true
    }

    return false
  }

  async function deleteContainedMerges(bounds: SelectionBounds): Promise<void> {
    const sheetData = sheetsDataStore.currentSheetData
    if (!sheetData)
      return

    const { columnOrder, rowOrder } = sheetData
    const toDelete: string[] = []

    for (const merge of Object.values(sheetData.merges)) {
      if (isMergeFullyContained(getMergeBounds(merge, columnOrder, rowOrder), bounds)) {
        delete sheetData.merges[merge.mergeId]
        toDelete.push(merge.mergeId)
      }
    }

    await Promise.all(toDelete.map(id => mergeStorage.deleteMerge(id)))
  }

  async function clearSlaveValues(bounds: SelectionBounds): Promise<void> {
    const sheetData = sheetsDataStore.currentSheetData
    if (!sheetData)
      return

    const { columnOrder, rowOrder } = sheetData
    const colSpan = bounds.maxColumnIndex - bounds.minColumnIndex + 1
    const rowSpan = bounds.maxRowIndex - bounds.minRowIndex + 1

    for (let columnOffset = 0; columnOffset < colSpan; columnOffset++) {
      for (let rowOffset = 0; rowOffset < rowSpan; rowOffset++) {
        if (columnOffset === 0 && rowOffset === 0)
          continue

        const cellId = getCellId(
          columnOrder[bounds.minColumnIndex + columnOffset],
          rowOrder[bounds.minRowIndex + rowOffset],
        )

        const cell = sheetData.cells[cellId]

        if (cell?.value) {
          cell.value = ''
          await cellStorage.saveCell(toCellDto(cell))
        }
      }
    }
  }

  async function commitMerges(
    sheetId: string,
    sheetData: SheetData,
    merges: Merge[],
    bounds: SelectionBounds,
  ): Promise<void> {
    const { columnOrder, rowOrder } = sheetData

    for (const merge of merges) {
      sheetData.merges[merge.mergeId] = merge
    }

    const anchorCellId = getCellId(columnOrder[bounds.minColumnIndex], rowOrder[bounds.minRowIndex])
    const endCellId = getCellId(columnOrder[bounds.maxColumnIndex], rowOrder[bounds.maxRowIndex])

    setSelectionRange(sheetId, anchorCellId, endCellId)
    setActiveCell(sheetId, anchorCellId)

    await Promise.all(merges.map(merge => mergeStorage.saveMerge(merge)))
  }

  async function mergeCells(): Promise<void> {
    const sheetId = sheetsStore.currentSheetId
    const sheetData = sheetsDataStore.currentSheetData
    if (!sheetId || !sheetData)
      return

    const bounds = getContiguousSelectionBounds(sheetId)
    if (!bounds)
      return

    const { columnOrder, rowOrder } = sheetData
    const colSpan = bounds.maxColumnIndex - bounds.minColumnIndex + 1
    const rowSpan = bounds.maxRowIndex - bounds.minRowIndex + 1
    const anchorCellId = getCellId(columnOrder[bounds.minColumnIndex], rowOrder[bounds.minRowIndex])

    await deleteContainedMerges(bounds)
    await clearSlaveValues(bounds)

    const merge = generateMerge(sheetId, anchorCellId, colSpan, rowSpan)
    sheetData.merges[merge.mergeId] = merge

    clearSelection(sheetId)
    setActiveCell(sheetId, anchorCellId)

    await mergeStorage.saveMerge(merge)
  }

  async function mergeHorizontally(): Promise<void> {
    const sheetId = sheetsStore.currentSheetId
    const sheetData = sheetsDataStore.currentSheetData
    if (!sheetId || !sheetData)
      return

    const bounds = getContiguousSelectionBounds(sheetId)
    if (!bounds)
      return

    const { columnOrder, rowOrder } = sheetData
    const colSpan = bounds.maxColumnIndex - bounds.minColumnIndex + 1

    await deleteContainedMerges(bounds)

    const merges: Merge[] = []

    for (let rowOffset = 0; rowOffset <= bounds.maxRowIndex - bounds.minRowIndex; rowOffset++) {
      const rowBounds: SelectionBounds = {
        minColumnIndex: bounds.minColumnIndex,
        maxColumnIndex: bounds.maxColumnIndex,
        minRowIndex: bounds.minRowIndex + rowOffset,
        maxRowIndex: bounds.minRowIndex + rowOffset,
      }

      await clearSlaveValues(rowBounds)

      const anchorCellId = getCellId(columnOrder[bounds.minColumnIndex], rowOrder[bounds.minRowIndex + rowOffset])
      merges.push(generateMerge(sheetId, anchorCellId, colSpan, 1))
    }

    await commitMerges(sheetId, sheetData, merges, bounds)
  }

  async function mergeVertically(): Promise<void> {
    const sheetId = sheetsStore.currentSheetId
    const sheetData = sheetsDataStore.currentSheetData
    if (!sheetId || !sheetData)
      return

    const bounds = getContiguousSelectionBounds(sheetId)
    if (!bounds)
      return

    const { columnOrder, rowOrder } = sheetData
    const rowSpan = bounds.maxRowIndex - bounds.minRowIndex + 1

    await deleteContainedMerges(bounds)

    const merges: Merge[] = []

    for (let columnOffset = 0; columnOffset <= bounds.maxColumnIndex - bounds.minColumnIndex; columnOffset++) {
      const columnBounds: SelectionBounds = {
        minColumnIndex: bounds.minColumnIndex + columnOffset,
        maxColumnIndex: bounds.minColumnIndex + columnOffset,
        minRowIndex: bounds.minRowIndex,
        maxRowIndex: bounds.maxRowIndex,
      }

      await clearSlaveValues(columnBounds)

      const anchorCellId = getCellId(columnOrder[bounds.minColumnIndex + columnOffset], rowOrder[bounds.minRowIndex])
      merges.push(generateMerge(sheetId, anchorCellId, 1, rowSpan))
    }

    await commitMerges(sheetId, sheetData, merges, bounds)
  }

  async function unmergeCells(): Promise<void> {
    const sheetId = sheetsStore.currentSheetId
    const sheetData = sheetsDataStore.currentSheetData
    if (!sheetId || !sheetData)
      return

    const { columnOrder, rowOrder } = sheetData
    const bounds = getContiguousSelectionBounds(sheetId)

    if (bounds) {
      const toDelete: string[] = []

      for (const merge of Object.values(sheetData.merges)) {
        if (isMergeOverlapping(getMergeBounds(merge, columnOrder, rowOrder), bounds)) {
          delete sheetData.merges[merge.mergeId]
          toDelete.push(merge.mergeId)
        }
      }

      const anchorCellId = getCellId(columnOrder[bounds.minColumnIndex], rowOrder[bounds.minRowIndex])
      const endCellId = getCellId(columnOrder[bounds.maxColumnIndex], rowOrder[bounds.maxRowIndex])

      setSelectionRange(sheetId, anchorCellId, endCellId)
      setActiveCell(sheetId, anchorCellId)

      await Promise.all(toDelete.map(id => mergeStorage.deleteMerge(id)))

      return
    }

    const activeId = getActiveCell(sheetId)
    const anchorCellId = coveredToAnchorMap.value[activeId] ?? activeId

    const merge = anchorMerges.value[anchorCellId]
    if (!merge)
      return

    const { columnLetter, rowNumber } = parseCellId(anchorCellId)
    const columnIndex = columnOrder.indexOf(columnLetter)
    const rowIndex = rowOrder.indexOf(rowNumber)
    const endCellId = getCellId(
      columnOrder[columnIndex + merge.colSpan - 1],
      rowOrder[rowIndex + merge.rowSpan - 1],
    )

    delete sheetData.merges[merge.mergeId]

    setSelectionRange(sheetId, anchorCellId, endCellId)
    setActiveCell(sheetId, anchorCellId)

    await mergeStorage.deleteMerge(merge.mergeId)
  }

  return {
    anchorMerges,
    coveredToAnchorMap,
    mergeCoveredSet,
    activeCellMergeRange,
    canMerge,
    canMergeHorizontally,
    canMergeVertically,
    canUnmerge,
    mergeCells,
    mergeHorizontally,
    mergeVertically,
    unmergeCells,
  }
})
