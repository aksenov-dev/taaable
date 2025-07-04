import { readonly, ref } from 'vue'

import type { CellEditorPosition } from '@/shared/types'

type ActivateEditorOptions =
  | { event: MouseEvent; initialInput?: string }
  | { element: HTMLElement; initialInput?: string }

const editingCellId = ref<string | null>(null)
const cellEditorPosition = ref<CellEditorPosition>({ top: 0, left: 0, width: 0, height: 0 })
const initialInput = ref<string | undefined>(undefined)

export const useCellEditing = () => {
  const startEditing = (cellId: string): void => {
    editingCellId.value = cellId
  }

  const stopEditing = (): void => {
    editingCellId.value = null
    initialInput.value = undefined
  }

  const calculateEditorPosition = (element: HTMLElement): void => {
    const rect = element.getBoundingClientRect()

    cellEditorPosition.value = {
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width,
      height: rect.height
    }
  }

  const activateEditor = (cellId: string, options: ActivateEditorOptions) => {
    let element: HTMLElement

    if ('event' in options) {
      element = options.event.currentTarget as HTMLElement
    } else {
      element = options.element
    }

    initialInput.value = options.initialInput

    calculateEditorPosition(element)
    startEditing(cellId)
  }

  return {
    editingCellId: readonly(editingCellId),
    cellEditorPosition: readonly(cellEditorPosition),
    initialInput: readonly(initialInput),
    startEditing,
    stopEditing,
    activateEditor
  }
}
