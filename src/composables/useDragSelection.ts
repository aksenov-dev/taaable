import { computed, onBeforeUnmount, ref } from 'vue'

import { useActiveCell } from '@/composables/useActiveCell'
import { useSelection } from '@/composables/useSelection'

export function useDragSelection(getSheetId: () => string | null) {
  const { clearSelection, extendSelection, setSelectionRange } = useSelection()
  const { setActiveCell } = useActiveCell()

  const isDragActive = ref(false)
  const hasMoved = ref(false)

  let addMode = false
  let extendMode = false
  let rafId: number | null = null
  let extendAnchorId: string | null = null
  let dragStartCellId: string | null = null

  const isDragging = computed(() => isDragActive.value && hasMoved.value)

  function attachMask(): void {
    const mask = document.createElement('div')
    mask.classList.add('drag-select-mask')
    document.body.appendChild(mask)
    document.body.style.userSelect = 'none'
  }

  function detachMask(): void {
    document.querySelector('.drag-select-mask')?.remove()
    document.body.style.userSelect = ''
  }

  function onDragMove(event: MouseEvent): void {
    const sheetId = getSheetId()

    if (!dragStartCellId || !sheetId || rafId !== null)
      return

    const { clientX, clientY } = event
    const startCellId = dragStartCellId

    rafId = requestAnimationFrame(() => {
      rafId = null

      const el = document.elementFromPoint(clientX, clientY)
      const cellEl = el?.closest('[data-cell-id]') as HTMLElement | null
      const hoveredCellId = cellEl?.dataset.cellId

      if (!hoveredCellId)
        return

      if (hoveredCellId === startCellId) {
        if (hasMoved.value && !extendMode && !addMode) {
          clearSelection(sheetId)
          hasMoved.value = false
        }

        return
      }

      hasMoved.value = true

      if (extendMode) {
        extendSelection(sheetId, hoveredCellId, extendAnchorId ?? undefined)
      }
      else if (addMode) {
        extendSelection(sheetId, hoveredCellId, startCellId)
      }
      else {
        setSelectionRange(sheetId, startCellId, hoveredCellId)
      }
    })
  }

  function start(cellId: string, event: MouseEvent, append = false, extendAnchor: string | null = null): void {
    event.preventDefault()

    addMode = append
    extendMode = extendAnchor !== null
    extendAnchorId = extendAnchor
    dragStartCellId = cellId
    hasMoved.value = false
    isDragActive.value = true

    attachMask()

    window.addEventListener('mousemove', onDragMove)
    window.addEventListener('mouseup', stop)
  }

  function stop(): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }

    window.removeEventListener('mousemove', onDragMove)
    window.removeEventListener('mouseup', stop)

    detachMask()

    const sheetId = getSheetId()

    if (hasMoved.value && dragStartCellId && sheetId && !extendMode)
      setActiveCell(sheetId, dragStartCellId)

    dragStartCellId = null
    isDragActive.value = false
    hasMoved.value = false
    extendMode = false
    extendAnchorId = null
  }

  onBeforeUnmount(stop)

  return {
    isDragActive,
    isDragging,
    startDragSelection: start,
  }
}
