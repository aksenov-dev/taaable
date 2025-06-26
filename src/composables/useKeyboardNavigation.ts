import { onMounted, onUnmounted } from 'vue'

import type { Ref } from 'vue'

import { useActiveCell } from '@/composables/useActiveCell'
import { useCellEditing } from '@/composables/useCellEditing'
import { useSheetsStore } from '@/stores/sheets'
import { useSheetsDataStore } from '@/stores/sheetsData'
import { parseCellId, getCellId } from '@/shared/utils'

export const useKeyboardNavigation = (containerRef: Ref<HTMLDivElement | null>) => {
  const sheetsStore = useSheetsStore()
  const sheetsDataStore = useSheetsDataStore()

  const { getActiveCell, setActiveCell } = useActiveCell()
  const { editingCellId, startEditing, stopEditing } = useCellEditing()

  const exitEditingMode = () => {
    stopEditing()
    containerRef.value?.focus()
  }

  const handleKeydown = (event: KeyboardEvent) => {
    if (!sheetsStore.currentSheetId) return
    if (!containerRef.value || !containerRef.value.contains(document.activeElement)) return

    const editModeNavigationKeys = ['Tab', 'Enter', 'Escape']
    if (editingCellId.value && !editModeNavigationKeys.includes(event.key)) return

    const currentCellId = getActiveCell(sheetsStore.currentSheetId)
    const { columnLetter, rowNumber } = parseCellId(currentCellId)

    const columnOrder = sheetsDataStore.currentSheetData?.columnOrder ?? []
    const rowOrder = sheetsDataStore.currentSheetData?.rowOrder ?? []

    const colIndex = columnOrder.indexOf(columnLetter)
    const rowIndex = rowOrder.indexOf(rowNumber)

    if (colIndex === -1 || rowIndex === -1) return

    let newColIndex = colIndex
    let newRowIndex = rowIndex
    let handled = true

    const shift = event.shiftKey
    const ctrl = event.ctrlKey || event.metaKey

    switch (event.key) {
      case 'ArrowUp':
        newRowIndex = ctrl ? 0 : Math.max(0, rowIndex - 1)
        break
      case 'ArrowDown':
        newRowIndex = ctrl ? rowOrder.length - 1 : Math.min(rowOrder.length - 1, rowIndex + 1)
        break
      case 'ArrowLeft':
        newColIndex = ctrl ? 0 : Math.max(0, colIndex - 1)
        break
      case 'ArrowRight':
        newColIndex = ctrl ? columnOrder.length - 1 : Math.min(columnOrder.length - 1, colIndex + 1)
        break
      case 'Tab':
        exitEditingMode()
        newColIndex = Math.max(0, Math.min(columnOrder.length - 1, colIndex + (shift ? -1 : 1)))
        break
      case 'Enter':
        if (editingCellId.value) {
          exitEditingMode()
          newRowIndex = Math.min(rowOrder.length - 1, rowIndex + (shift ? -1 : 1))
        } else {
          startEditing(currentCellId)
        }
        break
      case 'Escape':
        exitEditingMode()
        break

      default: handled = false
    }

    if (handled) {
      event.preventDefault()

      const newCol = columnOrder[newColIndex]
      const newRow = rowOrder[newRowIndex]

      if (newCol && newRow) {
        const newCellId = getCellId(newCol, newRow)
        setActiveCell(sheetsStore.currentSheetId, newCellId)
      }
    }
  }

  onMounted(() => window.addEventListener('keydown', handleKeydown))
  onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
}
