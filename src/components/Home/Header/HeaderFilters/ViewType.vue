<script setup lang="ts">
import type { MainViewVariant } from '@/shared/types'
import { IconGrid, IconList } from '@/shared/ui'

interface Props {
  variant: MainViewVariant
  isActive: boolean
}

const emit = defineEmits(['click'])

const { variant, isActive } = defineProps<Props>()
</script>

<template>
  <component
    :is="variant === 'list' ? IconList : IconGrid"
    class="transition-colors select-none"
    :class="{
      'cursor-default text-black select-none dark:text-white': isActive,
      'text-gray-6 hover:text-accent-1 active:text-gray-6 cursor-pointer': !isActive
    }"
    @click="!isActive && emit('click', variant)"
  />
</template>
