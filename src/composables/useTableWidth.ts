import { onMounted, onUnmounted, ref } from 'vue'

export function useTableWidth(tableContainer: HTMLDivElement | null) {
  const tableWidth = ref(0)

  const updateWidth = () => {
    if (!tableContainer) return
    tableWidth.value = tableContainer.clientWidth
  }

  onMounted(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
  })

  onUnmounted(() => window.removeEventListener('resize', updateWidth))

  return {
    tableWidth
  }
}
