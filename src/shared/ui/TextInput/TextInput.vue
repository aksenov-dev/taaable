<script setup lang="ts">
import { type Props } from './types'

const model = defineModel<string>({ default: '' })

const { type = 'text', disabled = false, placeholder = '', variant = 'default' } = defineProps<Props>()
</script>

<template>
  <input
    v-model="model"
    :disabled="disabled"
    :placeholder="placeholder"
    :type="type"
    :class="variant"
  />
</template>

<style scoped>
@reference '@/index.css';

input {
  @apply text-medium placeholder:text-gray-5 focus:border-accent-1 w-full appearance-none border text-black
  transition-colors outline-none placeholder:transition-colors dark:text-white;
}

.default {
  @apply hover:border-gray-1 h-5 rounded-xs border-transparent px-1;
}

.search {
  @apply text-gray-5 border-gray-3 bg-gray-2 hover:text-gray-6 h-10 rounded-lg bg-[url(@/assets/search.svg)]
  bg-[right_15px_top_9px] bg-no-repeat pr-12 pl-4 focus:text-black dark:bg-[url(@/assets/search-dark.svg)]
  dark:focus:text-white;
}
</style>
