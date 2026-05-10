import type { OffsetOptions, Placement } from '@floating-ui/vue'

export interface Props {
  isOpen: boolean
  referenceElement: HTMLElement | null
  placement?: Placement
  offsetValue?: OffsetOptions
}
