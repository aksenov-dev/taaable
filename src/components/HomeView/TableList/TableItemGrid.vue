<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue'

import { IconFileBig, IconMoreVertical, TextInput } from '@/shared/ui'

import type { Emits, Props } from './types'

import TableItemMenu from './TableItemMenu.vue'
import { useTableItem } from './useTableItem'

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const tableItemRef = useTemplateRef<HTMLDivElement>('table-item')
const input = shallowRef()

const {
  width,
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

const menuPlacement = computed(() => breakpoints.LG.value ? 'bottom-start' : 'bottom-end')

const menuOffsetValue = computed(() => {
  return breakpoints.LG.value
    ? { mainAxis: 4, crossAxis: width.value - 54 }
    : { mainAxis: 4, crossAxis: 0 }
})
</script>

<template>
  <div
    ref="table-item"
    class="group/item flex h-42.5 sm:h-67.5 min-w-0 basis-1/2 sm:basis-1/3 flex-col gap-1 rounded-sm p-3 sm:p-5
    select-none transition-colors hover:cursor-pointer"
    :class="[isMenuOpen ? 'bg-gray-1' : 'hover:bg-gray-1']"
    @click="goToTable"
  >
    <div class="flex min-w-0 grow flex-col gap-1 sm:gap-2">
      <div
        class="flex grow items-center justify-center rounded-xs border border-gray-2 bg-white transition-colors
        dark:bg-black"
      >
        <IconFileBig
          class="transition-colors w-15 h-15 sm:w-21 sm:h-21"
          :class="[isMenuOpen ? 'text-accent-1' : 'text-gray-3 group-hover/item:text-accent-1']"
        />
      </div>

      <TextInput
        ref="input"
        variant="title-preview"
        :model-value="title"
        :disabled="!isEditMode"
        class="-mr-1.25 -ml-1.25 w-auto! text-black dark:text-white"
        @click.stop
        @blur="isEditMode = false"
        @change="renameTable"
      />
    </div>

    <div class="flex h-5 items-center justify-between gap-3">
      <span class="text-small sm:text-medium text-gray-6 transition-colors">
        {{ stringDate }}
      </span>

      <IconMoreVertical
        class="text-gray-6 hover:text-accent-1 transition-colors"
        @click.stop="toggleMenu"
      />
    </div>

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
