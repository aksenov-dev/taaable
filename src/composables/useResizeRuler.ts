import { ref } from 'vue'

export const useResizeRuler = () => {
  const isResizeRulerVisible = ref(false)
  const resizeRulerPosition = ref(0)

  const show = (position: number): void => {
    isResizeRulerVisible.value = true
    resizeRulerPosition.value = position
  }

  const hide = (): void => {
    isResizeRulerVisible.value = false
    resizeRulerPosition.value = 0
  }

  return {
    isResizeRulerVisible,
    resizeRulerPosition,
    show,
    hide
  }
}
