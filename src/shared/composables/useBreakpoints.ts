import { ref, computed } from 'vue'
import { BREAKPOINTS } from '@/shared/constants/Breackpoints'

export const useBreakpoints = () => {
  const viewportWidth = ref(window.innerWidth)

  window.addEventListener('resize', () => {
    viewportWidth.value = window.innerWidth
  })

  return computed(() => ({
    isXs: viewportWidth.value < BREAKPOINTS.SM,
    isSm: viewportWidth.value >= BREAKPOINTS.SM,
    isMd: viewportWidth.value >= BREAKPOINTS.MD,
    isLg: viewportWidth.value >= BREAKPOINTS.LG,
    isXl: viewportWidth.value >= BREAKPOINTS.XL,
    isXxl: viewportWidth.value >= BREAKPOINTS.XXL
  }))
}
