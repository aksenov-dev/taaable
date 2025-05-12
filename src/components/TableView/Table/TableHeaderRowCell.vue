<script setup lang="ts">
interface Props {
  row: number
}

const { row } = defineProps<Props>()
</script>

<template>
  <div
    role="rowheader"
    class="text-small text-gray-5 bg-gray-1 border-gray-3 sticky left-0 z-2 flex h-6 min-h-6 cursor-default
    items-center justify-center border-r border-b select-none"
  >
    {{ row }}
  </div>
</template>
