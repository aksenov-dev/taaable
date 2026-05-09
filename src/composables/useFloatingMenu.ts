import { computed } from 'vue'
import type { Ref } from 'vue'

import { autoUpdate, offset, shift, useFloating } from '@floating-ui/vue'
import type { OffsetOptions, Placement } from '@floating-ui/vue'

interface FloatingMenuConfig {
  placement?: () => Placement
  offsetValue?: () => OffsetOptions
  autoUpdate?: boolean
}

export function useFloatingMenu(
  referenceRef: Ref<HTMLElement | null>,
  floatingRef: Ref<HTMLElement | null>,
  config: FloatingMenuConfig = {},
) {
  const { placement, offsetValue, autoUpdate: enableAutoUpdate = true } = config

  const getOffsetValue = offsetValue ?? (() => 0)

  const middleware = computed(() => [
    offset(getOffsetValue()),
    shift({ padding: 8 }),
  ])

  const { floatingStyles, update, middlewareData, placement: computedPlacement } = useFloating(
    referenceRef,
    floatingRef,
    {
      placement,
      middleware,
      strategy: 'fixed',
      whileElementsMounted: enableAutoUpdate ? autoUpdate : undefined,
    },
  )

  return {
    floatingStyles,
    update,
    middlewareData,
    computedPlacement,
  }
}
