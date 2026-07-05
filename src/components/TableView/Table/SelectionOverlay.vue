<script setup lang="ts">
const { overlayStyle, showFillHandle = true } = defineProps<{
  overlayStyle: Record<string, string> | null
  showFillHandle?: boolean
}>()
</script>

<template>
  <div
    v-if="overlayStyle"
    class="selection-overlay"
    :class="{ 'has-fill-handle': showFillHandle }"
    :style="overlayStyle"
  />
</template>

<style scoped>
@reference '@/index.css';

.selection-overlay {
  @apply absolute pointer-events-none border border-accent-1 z-2 rounded-xs;
}

.selection-overlay.has-fill-handle:after {
  @apply content-[''] absolute size-2 rounded-full bg-accent-1 ring-[1px] ring-(--fill-handle-ring)
  -bottom-1 -right-1 z-10 cursor-crosshair pointer-events-auto;
}
</style>
