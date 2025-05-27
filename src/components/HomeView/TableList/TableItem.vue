<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, useTemplateRef, watch } from 'vue'

import { useRouter } from 'vue-router'
import { useElementBounding, useThrottleFn, useFocus } from '@vueuse/core'

import type { MainViewVariant } from '@/shared/types'
import type { DropdownMenuOffset } from '@/shared/ui'

import { useTablesStore } from '@/stores/tables'
import { formatTimestampToStringDate } from '@/shared/utils'

import { IconDelete, IconEdit, IconFile, IconFileBig, IconMoreVertical } from '@/shared/ui'
import { DropdownMenu, DropdownMenuItem, TextInput } from '@/shared/ui'

interface Props {
  tableId: string
  title: string
  date: number
  variant: MainViewVariant
}

const emit = defineEmits<{
  rename: [value: string]
  delete: []
}>()

const { tableId, title, date, variant } = defineProps<Props>()

const router = useRouter()
const tablesStore = useTablesStore()

const tableItemRef = useTemplateRef('table-item')
const { width, height, top, left, update } = useElementBounding(tableItemRef)

const input = shallowRef()
const { focused } = useFocus(input, { initialValue: true })

const isMenuOpen = ref(false)
const isEditMode = ref(false)

const stringDate = computed(() => formatTimestampToStringDate(date))

const menuOffset = computed<DropdownMenuOffset>(() => {
  if (variant === 'list') {
    return { offsetX: left.value + width.value + 4, offsetY: top.value - 2 }
  }

  return { offsetX: left.value + width.value - 54, offsetY: top.value + height.value + 4 }
})

const toggleMenu = useThrottleFn(() => (isMenuOpen.value = !isMenuOpen.value), 200)

const setEditMode = () => {
  isEditMode.value = true
  toggleMenu()
  nextTick(() => (focused.value = true))
}

const renameTable = (value: string) => {
  emit('rename', value)
  isEditMode.value = false
}

const removeTable = () => {
  emit('delete')
  isEditMode.value = false
  toggleMenu()
}

const goToTable = () => router.push({ name: 'Table', params: { tableId } })

watch(top, () => (isMenuOpen.value = false))
watch(() => tablesStore.filteredTableList, () => nextTick(() => update()))
</script>

<template>
  <div
    ref="table-item"
    class="group/item hover:bg-gray-1 flex min-w-0 rounded-sm p-5 transition-colors select-none hover:cursor-pointer"
    :class="{
      'h-15 gap-3': variant === 'list',
      'h-67.5 basis-1/3 flex-col gap-1': variant === 'grid'
    }"
    @click="goToTable"
  >
    <div
      class="flex min-w-0 grow gap-2"
      :class="{
        'items-center': variant === 'list',
        'flex-col': variant === 'grid'
      }"
    >
      <div
        class="border-gray-2 border-0 transition-colors"
        :class="{
          'flex grow items-center justify-center rounded-xs border-1 bg-white dark:bg-black': variant === 'grid'
        }"
      >
        <component
          :is="variant === 'list' ? IconFile : IconFileBig"
          class="group-hover/item:text-accent-1 transition-colors"
          :class="{
            'text-gray-6': variant === 'list',
            'text-gray-3': variant === 'grid'
          }"
        />
      </div>

      <TextInput
        ref="input"
        variant="title-preview"
        :model-value="title"
        :disabled="!isEditMode"
        class="text-black dark:text-white"
        :class="{
          '-mr-0.25 -ml-0.25': variant === 'list',
          '-mr-1.25 -ml-1.25 w-auto!': variant === 'grid'
        }"
        @click.stop
        @blur="isEditMode = false"
        @change="renameTable"
      />
    </div>

    <div class="flex h-5 items-center justify-between gap-3">
      <span class="text-medium text-gray-6 w-36">{{ stringDate }}</span>

      <IconMoreVertical
        class="text-gray-6 hover:text-accent-1 transition-colors"
        @click.stop="toggleMenu"
      />
    </div>

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
        @click="removeTable"
      />
    </DropdownMenu>
  </div>
</template>
