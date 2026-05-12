<script setup lang="ts">
import { computed } from 'vue'

import { useBreakpoints } from '@/composables/useBreakpoints'

import { IconChevronDown } from '@/shared/ui'

const { variant, direction, isActive } = defineProps<{
  variant: 'title' | 'date'
  direction: 'asc' | 'desc'
  isActive: boolean
}>()

const emit = defineEmits<{
  click: [variant: 'title' | 'date']
}>()

const { SM } = useBreakpoints()

const sortBtnText = computed(() => {
  if (variant === 'title') {
    return SM.value ? 'По названию' : 'Название'
  }

  return SM.value ? 'По дате просмотра' : 'Дата просмотра'
})
</script>

<template>
  <div
    class="flex items-center sm:gap-1 transition-colors select-none cursor-pointer"
    :class="{
      'text-black dark:text-white': isActive,
      'text-gray-6 hover:text-accent-1': !isActive,
    }"
    @click="emit('click', variant)"
  >
    <span class="text-medium">
      {{ sortBtnText }}
    </span>

    <IconChevronDown
      class="transition-transform"
      :class="{ 'rotate-180 translate-y-px': isActive && direction === 'desc' }"
    />
  </div>
</template>
