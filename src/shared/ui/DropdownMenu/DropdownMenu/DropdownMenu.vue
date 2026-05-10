<script setup lang="ts">
import { toRef, useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core'

import { useFloatingMenu } from '@/composables/useFloatingMenu'

import type { Props } from './types'

const {
  isOpen,
  referenceElement,
  placement = 'bottom-start',
  offsetValue = 0,
} = defineProps<Props>()

const emit = defineEmits(['close'])

const menuRef = useTemplateRef('menu')

const referenceRef = toRef(() => referenceElement)

const { floatingStyles } = useFloatingMenu(referenceRef, menuRef, {
  placement: () => placement,
  offsetValue: () => offsetValue,
})

onClickOutside(menuRef, () => emit('close'))
</script>

<template>
  <Transition
    enter-from-class="opacity-0"
    enter-active-class="transition-opacity duration-200 ease-in-out"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-active-class="transition-opacity duration-150 ease-in"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      ref="menu"
      class="shadow-brand-1 z-1000 min-h-10 min-w-42 rounded-sm bg-white p-1 transition-colors dark:bg-black"
      :style="floatingStyles"
    >
      <slot />
    </div>
  </Transition>
</template>
