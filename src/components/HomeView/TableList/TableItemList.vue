<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue'

import { IconFile, IconMoreVertical, TextInput } from '@/shared/ui'

import type { Emits, Props } from './types'

import TableItemMenu from './TableItemMenu.vue'
import { useTableItem } from './useTableItem'

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tableItemRef = useTemplateRef<HTMLDivElement>('table-item')
const input = shallowRef()

const {
  breakpoints,
  isMenuOpen,
  toggleMenu,
  isEditMode,
  stringDate,
  setEditMode,
  renameTable,
  removeTable,
  goToTable,
} = useTableItem(props, emit, tableItemRef, input)

const menuPlacement = computed(() => breakpoints.LG.value ? 'right-start' : 'bottom-end')

const menuOffsetValue = computed(() => {
  return breakpoints.LG.value
    ? { mainAxis: 4, crossAxis: -2 }
    : { mainAxis: 4, crossAxis: 0 }
})
</script>

<template>
  <div
    ref="table-item"
    class="group/item flex min-w-0 items-center gap-2 rounded-sm p-3 sm:p-5 h-15 transition-colors select-none
    hover:cursor-pointer"
    :class="[isMenuOpen ? 'bg-gray-1' : 'hover:bg-gray-1']"
    @click="goToTable"
  >
    <IconFile
      class="shrink-0 transition-colors"
      :class="[isMenuOpen ? 'text-accent-1' : 'text-gray-6 group-hover/item:text-accent-1']"
    />

    <div class="flex grow min-w-0 flex-col sm:flex-row sm:items-center sm:gap-3">
      <TextInput
        ref="input"
        variant="title-preview"
        :model-value="title"
        :disabled="!isEditMode"
        class="-mr-px -ml-px grow text-black dark:text-white"
        @click.stop
        @blur="isEditMode = false"
        @change="renameTable"
      />

      <span
        class="text-small sm:text-medium shrink-0 text-gray-6 sm:w-25 md:w-36 ml:w-25 lg:w-36 px-0.75 transition-colors"
      >
        {{ stringDate }}
      </span>
    </div>

    <IconMoreVertical
      class="text-gray-6 hover:text-accent-1 shrink-0 transition-colors"
      @click.stop="toggleMenu"
    />

    <TableItemMenu
      :is-open="isMenuOpen"
      :reference-element="tableItemRef"
      :placement="menuPlacement"
      :offset-value="menuOffsetValue"
      @close="toggleMenu"
      @rename="setEditMode"
      @delete="removeTable"
    />
  </div>
</template>
