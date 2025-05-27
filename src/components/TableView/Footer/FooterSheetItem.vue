<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { useElementBounding, useFocus, useThrottleFn } from '@vueuse/core'

import { type DropdownMenuOffset } from '@/shared/ui'

import { IconChevronDown, IconDelete, IconEdit } from '@/shared/ui'
import { DropdownMenu, DropdownMenuItem, TextInput } from '@/shared/ui'

interface Props {
  title: string
  isActive: boolean
  isSingleSheet: boolean
}

const emit = defineEmits<{
  rename: [value: string]
  delete: []
  click: []
}>()

const { title, isActive, isSingleSheet } = defineProps<Props>()

const sheetItemRef = useTemplateRef('sheet-item')
const { left, top, update } = useElementBounding(sheetItemRef)

const input = shallowRef()
const { focused } = useFocus(input, { initialValue: true })

const isMenuOpen = ref(false)
const isEditMode = ref(false)

const menuOffset = computed<DropdownMenuOffset>(() => {
  return { offsetX: left.value, offsetY: top.value - 81 }
})

const toggleMenu = useThrottleFn(() => (isMenuOpen.value = !isMenuOpen.value), 200)

const setEditMode = () => {
  isEditMode.value = true
  toggleMenu()
  nextTick(() => (focused.value = true))
}

const renameSheet = (value: string) => {
  emit('rename', value)
  isEditMode.value = false
}

const removeSheet = () => {
  emit('delete')
  isEditMode.value = false
  toggleMenu()
}

watch(isMenuOpen, () => nextTick(() => update()))
</script>

<template>
  <div
    ref="sheet-item"
    class="flex min-w-0 items-center gap-0.5 rounded-b-sm px-1 select-none transition"
    :class="{
      'shadow-brand-1 bg-white text-black dark:bg-black dark:text-white': isActive,
      'bg-gray-2 text-gray-6 cursor-pointer hover:text-black dark:hover:text-white': !isActive
    }"
    @click="emit('click')"
  >
    <TextInput
      ref="input"
      variant="sheet"
      :model-value="title"
      :disabled="!isEditMode"
      :max-length="50"
      auto-width
      :class="{
        'ml-1.25 border-none': !isEditMode,
        'pr-5.75 pl-1': isEditMode
      }"
      @click.stop
      @blur="isEditMode = false"
      @change="renameSheet"
    />

    <IconChevronDown
      v-if="!isEditMode"
      class="mr-1 shrink-0 cursor-pointer transition-colors"
      @click.stop="toggleMenu"
    />

    <DropdownMenu
      :is-open="isMenuOpen"
      :offset="menuOffset"
      @close="toggleMenu"
    >
      <DropdownMenuItem
        title="Переименовать"
        :icon="IconEdit"
        @click="setEditMode"
      />

      <DropdownMenuItem
        title="Удалить"
        :icon="IconDelete"
        :disabled="isSingleSheet"
        @click="removeSheet"
      />
    </DropdownMenu>
  </div>
</template>
