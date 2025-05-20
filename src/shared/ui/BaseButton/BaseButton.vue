<script setup lang="ts">
import type { Props } from './types'

const emit = defineEmits(['click'])

const { icon, text } = defineProps<Props>()
</script>

<template>
  <button
    class="bg-accent-1 text-medium active:bg-accent-1 hover:bg-accent-2 inline-flex h-10 cursor-pointer
    items-center gap-2 rounded-lg px-4 text-white transition-colors"
    @click="emit('click')"
  >
    <component :is="icon" />
    <span>{{ text }}</span>
  </button>
</template>
