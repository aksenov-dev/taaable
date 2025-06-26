import { readonly, ref } from 'vue'

const editingCellId = ref<string | null>(null)

export const useCellEditing = () => {
  const startEditing = (cellId: string): void => {
    editingCellId.value = cellId
  }

  const stopEditing = (): void => {
    editingCellId.value = null
  }

  return {
    editingCellId: readonly(editingCellId),
    startEditing,
    stopEditing
  }
}
