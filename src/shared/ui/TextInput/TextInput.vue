<script setup lang="ts">
import { type Props } from './types'

const emit = defineEmits<{
  blur: []
  input: [value: string]
  change: [value: string]
}>()

const { type = 'text', disabled = false, placeholder = '', variant = 'default' } = defineProps<Props>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <input
    v-model="model"
    :disabled="disabled"
    :placeholder="placeholder"
    :type="type"
    :class="variant"
    @blur="emit('blur')"
    @input="emit('input', model)"
    @change="emit('change', model)"
  />
</template>

<style scoped>
@reference '@/index.css';

input {
  @apply text-medium placeholder:text-gray-5 focus:border-accent-1 w-full appearance-none border text-black
  transition-colors outline-none placeholder:transition-colors dark:text-white;
}

.default {
  @apply h-5 rounded-xs border-transparent px-1 disabled:pointer-events-none disabled:truncate;
}

.search {
  @apply text-gray-5 border-gray-3 bg-gray-2 hover:text-gray-6 h-10 rounded-lg bg-[url(@/assets/search.svg)]
  bg-[right_15px_top_9px] bg-no-repeat pr-12 pl-4 focus:text-black dark:bg-[url(@/assets/search-dark.svg)]
  dark:focus:text-white;
}

.table-title {
  @apply text-large hover:border-gray-4 focus:border-accent-1 field-sizing-content h-7 truncate rounded-sm
  border-transparent pr-1.25 pl-1.25 hover:bg-white focus:bg-white dark:hover:bg-black dark:focus:bg-black;
}

.font-size {
  @apply text-medium border-gray-3 hover:border-gray-4 focus:border-accent-1 w-10 rounded-sm text-center text-black
  dark:text-white bg-white dark:bg-black;
}

.range, .formula {
  @apply h-7 border-none pr-2 pl-2 bg-white dark:bg-black;
}

.range {
  @apply w-20;
}
</style>
