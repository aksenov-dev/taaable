<script setup lang="ts">
import type { MainSortVariant } from '@/shared/types'
import { IconChevronDown } from '@/shared/ui'

interface Props {
  variant: MainSortVariant
  isActive: boolean
}

const emit = defineEmits(['click'])

const { variant, isActive } = defineProps<Props>()
</script>

<template>
  <div
    class="flex items-center gap-1 transition-colors select-none"
    :class="{
      'cursor-default text-black dark:text-white': isActive,
      'text-gray-6 hover:text-accent-1 cursor-pointer': !isActive
    }"
    @click="!isActive && emit('click', variant)"
  >
    <span class="text-medium">
      {{ variant === 'title' ? 'По названию' : 'По дате просмотра' }}
    </span>
    <IconChevronDown />
  </div>
</template>
