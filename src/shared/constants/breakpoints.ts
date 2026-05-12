import type { Breakpoints } from '@vueuse/core'

export const BREAKPOINTS = {
  SM: 576,
  MD: 768,
  ML: 896,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const satisfies Breakpoints
