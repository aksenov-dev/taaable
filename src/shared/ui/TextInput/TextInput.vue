<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from 'vue'
import { useAutoInputWidth } from '@/composables/useAutoInputWidth'

import type { Props } from './types'

const emit = defineEmits<{
  blur: []
  input: [value: string]
  change: [value: string]
}>()

const {
  variant,
  type = 'text',
  disabled = false,
  placeholder = '',
  autoWidth = false,
  maxLength = 500
} = defineProps<Props>()

const model = defineModel<string>({ default: '' })
const inputRef = useTemplateRef('input')

const onEnter = () => inputRef.value?.blur()

const { updateWidth } = useAutoInputWidth(inputRef, () => autoWidth)

watch([model, () => disabled], () => {
  if (autoWidth) nextTick(() => updateWidth())
})
</script>

<template>
  <input
    ref="input"
    v-model="model"
    :class="variant"
    :disabled="disabled"
    :placeholder="placeholder"
    :type="type"
    :maxlength="maxLength"
    @blur="emit('blur')"
    @input="emit('input', model)"
    @change="emit('change', model)"
    @keydown.enter="onEnter"
  />
</template>

<style scoped>
@reference '@/index.css';

input {
  @apply text-medium placeholder:text-gray-5 focus:border-accent-1 w-full appearance-none border transition-colors
  outline-none placeholder:select-none;
}

.search {
  @apply text-gray-5 border-gray-3 bg-gray-2 hover:text-gray-6 h-10 rounded-lg bg-[url(@/assets/search.svg)]
  bg-[right_15px_top_9px] bg-no-repeat pr-12 pl-4 focus:text-black dark:bg-[url(@/assets/search-dark.svg)]
  dark:focus:text-white;
}

.title {
  @apply text-large hover:border-gray-4 focus:border-accent-1 field-sizing-content h-7 truncate rounded-sm
  border-transparent pr-1.25 pl-1.25 text-black hover:bg-white focus:bg-white dark:text-white
  dark:hover:bg-black dark:focus:bg-black;
}

.title-preview {
  @apply h-5 rounded-xs border-transparent pr-1 pl-1 transition-none disabled:pointer-events-none disabled:truncate;
}

.sheet {
  @apply h-5 rounded-xs border-transparent text-black disabled:pointer-events-none disabled:truncate disabled:px-0
  disabled:text-inherit dark:text-white;
}

.font-size {
  @apply text-medium border-gray-3 hover:border-gray-4 focus:border-accent-1 w-10 rounded-sm bg-white text-center
  text-black dark:bg-black dark:text-white;
}

.range, .formula {
  @apply h-7 border-none bg-white pr-2 pl-2 text-black dark:bg-black dark:text-white;
}

.range {
  @apply w-20;
}
</style>
