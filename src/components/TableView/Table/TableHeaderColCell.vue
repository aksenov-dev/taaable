<script setup lang="ts">
interface Props {
  text: string
}

const { text } = defineProps<Props>()
</script>

<template>
  <div
    role="columnheader"
    class="text-small text-gray-5 bg-gray-1 border-gray-3 sticky top-0 z-3 flex h-6 w-25 min-w-6 cursor-default
    items-center justify-center border-r border-b select-none"
  >
    {{ text }}
  </div>
</template>
