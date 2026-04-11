import { ref } from 'vue'

export function useResizeRuler() {
  const isResizeRulerVisible = ref(false)
  const resizeRulerPosition = ref(0)

  function show(position: number): void {
    isResizeRulerVisible.value = true
    resizeRulerPosition.value = position
  }

  function hide(): void {
    isResizeRulerVisible.value = false
    resizeRulerPosition.value = 0
  }

  return {
    isResizeRulerVisible,
    resizeRulerPosition,
    show,
    hide,
  }
}
