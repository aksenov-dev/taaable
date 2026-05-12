<script setup lang="ts">
import { computed } from 'vue'

import type { MainSortVariant } from '@/shared/types'

import { useBreakpoints } from '@/composables/useBreakpoints'

import { IconChevronDown } from '@/shared/ui'

const { variant, isActive } = defineProps<{
  variant: MainSortVariant
  isActive: boolean
}>()

const emit = defineEmits(['click'])

const { SM } = useBreakpoints()

const sortBtnText = computed(() => {
  if (variant === 'title') {
    return SM.value ? 'По названию' : 'Название'
  }

  return SM.value ? 'По дате просмотра' : 'Дата просмотра'
})

function sortClick() {
  if (isActive)
    return

  emit('click', variant)
}
</script>

<template>
  <div
    class="flex items-center sm:gap-1 transition-colors select-none"
    :class="{
      'cursor-default text-black dark:text-white': isActive,
      'text-gray-6 hover:text-accent-1 cursor-pointer': !isActive,
    }"
    @click="sortClick"
  >
    <span class="text-medium">
      {{ sortBtnText }}
    </span>

    <IconChevronDown />
  </div>
</template>
