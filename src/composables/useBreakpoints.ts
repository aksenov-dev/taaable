import { ref, computed, onMounted, onUnmounted } from 'vue'
import { BREAKPOINTS } from '@/shared/constants'

export const useBreakpoints = () => {
  const viewportWidth = ref(window.innerWidth)

  const onResize = (): void => {
    viewportWidth.value = window.innerWidth
  }

  onMounted(() => window.addEventListener('resize', onResize))
  onUnmounted(() => window.removeEventListener('resize', onResize))

  return computed(() => ({
    isXs: viewportWidth.value < BREAKPOINTS.SM,
    isSm: viewportWidth.value >= BREAKPOINTS.SM,
    isMd: viewportWidth.value >= BREAKPOINTS.MD,
    isLg: viewportWidth.value >= BREAKPOINTS.LG,
    isXl: viewportWidth.value >= BREAKPOINTS.XL,
    isXxl: viewportWidth.value >= BREAKPOINTS.XXL
  }))
}
