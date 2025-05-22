<script setup lang="ts">
import type { Props } from './types'

const emit = defineEmits(['click'])

const { icon, title } = defineProps<Props>()
</script>

<template>
  <div
    class="group hover:bg-gray-1 flex h-8.75 cursor-pointer items-center gap-2.5 rounded-xs bg-white px-3 py-2
    transition-colors select-none dark:bg-black"
    @click.prevent="emit('click')"
  >
    <component :is="icon" class="text-gray-6 group-hover:text-accent-1 transition-colors" />
    <span class="text-medium text-black dark:text-white">{{ title }}</span>
  </div>
</template>
