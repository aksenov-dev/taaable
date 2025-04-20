<script setup lang="ts">
import { type Props } from './types'

const emit = defineEmits(['toggle'])

const { isDark } = defineProps<Props>()
</script>

<template>
  <div class="relative flex h-7 w-13.5 items-center">
    <span class="relative">
      <input
        type="checkbox"
        class="peer border-gray-3 bg-gray-2 before:shadow-brand-1 relative z-1 block h-7 w-13.5 cursor-pointer
        appearance-none rounded-[25%/50%] border [transition:border-color_0.3s,background-color_0.3s]
        before:block before:h-6.5 before:w-6.5 before:rounded-[50%] before:bg-white before:content-['']
        before:[transition:box-shadow_0.15s,background-color_0.3s,transform_0.3s]
        checked:before:transform-[translateX(25px)] focus:outline-transparent dark:before:bg-black"
        role="switch"
        :checked="isDark"
        @change="emit('toggle', ($event.target as HTMLInputElement).checked)"
      />
      <span
        class="pointer-events-none absolute top-1.25 left-1.25 z-1 block h-4.5 w-4.5 transform-[rotate(-45deg)]
        bg-[url(@/assets/sun.svg)] [transition:transform_0.3s,background_0.15s]
        peer-checked:transform-[translateX(25px)] peer-checked:bg-[url(@/assets/moon.svg)]"
      >
      </span>
    </span>
  </div>
</template>
