<script setup lang="ts">
import { type Props } from './types'

import { useTemplateRef } from 'vue'
import { onClickOutside } from '@vueuse/core'

const emit = defineEmits(['close'])

const { isOpen, offset } = defineProps<Props>()

const menuRef = useTemplateRef('menu')

onClickOutside(menuRef, () => emit('close'))
</script>

<template>
  <Transition
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
    enter-active-class="transition-opacity duration-300 ease-out"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-active-class="[transition:background-color_0.2s_ease-in,opacity_0.1s_ease-in]"
  >
    <div
      v-if="isOpen"
      ref="menu"
      class="shadow-brand-1 absolute top-0 left-0 z-1000 min-h-10 min-w-42 rounded-sm bg-white p-1 transition-colors
      dark:bg-black"
      :style="{ transform: `translate3d(${offset.offsetX}px, ${offset.offsetY}px, 0)` }"
    >
      <slot />
    </div>
  </Transition>
</template>
