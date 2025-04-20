<script setup lang="ts">
import { IconChevronDown } from '@/shared/ui'

interface Props {
  title: string
  isActive: boolean
}

const { title, isActive } = defineProps<Props>()
</script>

<template>
  <div
    class="flex items-center gap-1 transition-colors select-none"
    :class="{
      'cursor-default text-black dark:text-white': isActive,
      'text-gray-6 hover:text-accent-1 active:text-gray-6 cursor-pointer': !isActive
    }"
  >
    <span class="text-medium">{{ title }}</span>
    <IconChevronDown />
  </div>
</template>
