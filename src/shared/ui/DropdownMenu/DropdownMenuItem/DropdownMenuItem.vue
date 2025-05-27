<script setup lang="ts">
import type { Props } from './types'

const emit = defineEmits(['click'])

const { title, icon, disabled = false } = defineProps<Props>()
</script>

<template>
  <div
    class="group hover:bg-gray-1 flex h-8.75 cursor-pointer items-center gap-2.5 rounded-xs bg-white px-3 py-2
    transition-colors select-none dark:bg-black"
    :class="{ 'pointer-events-none': disabled }"
    @click.stop="emit('click')"
  >
    <component
      :is="icon"
      class="group-hover:text-accent-1 transition-colors"
      :class="disabled ? 'text-gray-4': 'text-gray-6'"
    />

    <span class="text-medium" :class="disabled ? 'text-gray-4': 'text-black dark:text-white'">
      {{ title }}
    </span>
  </div>
</template>
