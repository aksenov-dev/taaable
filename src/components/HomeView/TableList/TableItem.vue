<script setup lang="ts">
import { computed, nextTick, ref, shallowRef, useTemplateRef, watch } from 'vue'
import { useElementBounding, useFocus } from '@vueuse/core'
import { useRouter } from 'vue-router'

import type { MainViewVariant } from '@/shared/types'

import { formatTimestampToStringDate } from '@/shared/utils'

import { useTablesStore } from '@/stores/tables'
import { useBreakpoints } from '@/composables/useBreakpoints'
import { useMenuToggle } from '@/composables/useMenuToggle'

import {
  DropdownMenu,
  DropdownMenuItem,
  IconDelete,
  IconEdit,
  IconFile,
  IconFileBig,
  IconMoreVertical,
  TextInput,
} from '@/shared/ui'

interface Props {
  tableId: string
  title: string
  date: number
  variant: MainViewVariant
}

const { tableId, title, date, variant } = defineProps<Props>()

const emit = defineEmits<{
  rename: [value: string]
  delete: []
}>()

const router = useRouter()
const tablesStore = useTablesStore()

const tableItemRef = useTemplateRef('table-item')
const { width, top, update } = useElementBounding(tableItemRef)

const input = shallowRef()
const { focused } = useFocus(input, { initialValue: true })

const breakpoints = useBreakpoints()
const { isMenuOpen, toggleMenu } = useMenuToggle()

const isEditMode = ref(false)

const stringDate = computed(() => formatTimestampToStringDate(date))

const menuPlacement = computed(() => {
  if (variant === 'list') {
    if (breakpoints.LG.value)
      return 'right-start'

    return 'bottom-end'
  }

  if (breakpoints.LG.value)
    return 'bottom-start'

  return 'bottom-end'
})

const menuOffsetValue = computed(() => {
  if (variant === 'list') {
    if (breakpoints.LG.value)
      return { mainAxis: 4, crossAxis: -2 }

    return { mainAxis: 4, crossAxis: 0 }
  }

  if (breakpoints.LG.value)
    return { mainAxis: 4, crossAxis: width.value - 54 }

  return { mainAxis: 4, crossAxis: 0 }
})

function setEditMode() {
  isEditMode.value = true
  toggleMenu()
  nextTick(() => (focused.value = true))
}

function renameTable(value: string) {
  emit('rename', value)
  isEditMode.value = false
}

function removeTable() {
  emit('delete')
  isEditMode.value = false
  toggleMenu()
}

const goToTable = () => router.push({ name: 'Table', params: { tableId } })

watch(top, () => (isMenuOpen.value = false))
watch(() => tablesStore.filteredTables, () => nextTick(() => update()))
</script>

<template>
  <div
    ref="table-item"
    class="group/item hover:bg-gray-1 flex min-w-0 rounded-sm p-5 transition-colors select-none hover:cursor-pointer"
    :class="{
      'h-15 gap-3': variant === 'list',
      'h-67.5 basis-1/3 flex-col gap-1': variant === 'grid',
    }"
    @click="goToTable"
  >
    <div
      class="flex min-w-0 grow gap-2"
      :class="{
        'items-center': variant === 'list',
        'flex-col': variant === 'grid',
      }"
    >
      <div
        class="border-gray-2 border-0 transition-colors"
        :class="{
          'flex grow items-center justify-center rounded-xs border bg-white dark:bg-black': variant === 'grid',
        }"
      >
        <component
          :is="variant === 'list' ? IconFile : IconFileBig"
          class="group-hover/item:text-accent-1 transition-colors"
          :class="{
            'text-gray-6': variant === 'list',
            'text-gray-3': variant === 'grid',
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
          '-mr-px -ml-px': variant === 'list',
          '-mr-1.25 -ml-1.25 w-auto!': variant === 'grid',
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
      :reference-element="tableItemRef"
      :placement="menuPlacement"
      :offset-value="menuOffsetValue"
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
