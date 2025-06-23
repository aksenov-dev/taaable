<script setup lang="ts">
interface Props {
  isVisible: boolean
}

const { isVisible } = defineProps<Props>()
</script>

<template>
  <div
    v-show="isVisible"
    class="absolute inset-0 z-9999 bg-white/80 backdrop-blur-[2px] transition-opacity dark:bg-black/80"
    :class="{ 'opacity-100': isVisible, 'opacity-0 pointer-events-none': !isVisible }"
  ></div>
</template>
