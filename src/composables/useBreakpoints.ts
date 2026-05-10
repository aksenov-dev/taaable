import { useBreakpoints as vueUseBreakpoints } from '@vueuse/core'

import { BREAKPOINTS } from '@/shared/constants'

export function useBreakpoints() {
  return vueUseBreakpoints(BREAKPOINTS)
}
