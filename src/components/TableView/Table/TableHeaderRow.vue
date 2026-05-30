<script setup lang="ts">
import { computed } from 'vue'

import type { Cell, ColumnsData } from '@/shared/types'

import { parseCellId } from '@/shared/utils'

import { useSelection } from '@/composables/useSelection'

import TableHeaderColumnCell from '@/components/TableView/Table/TableHeaderColumnCell.vue'

const { columnOrder, columns, activeCellId } = defineProps<{
  columnOrder: ColumnsData['columnOrder']
  columns: ColumnsData['columns']
  activeCellId: Cell['cellId']
}>()

const { isColumnInSelection } = useSelection()

const activeColumnLetter = computed(() => parseCellId(activeCellId).columnLetter)
</script>

<template>
  <div
    role="none"
    class="bg-gray-1 border-gray-3 sticky top-0 left-0 z-4 border-r border-b"
  />

  <TableHeaderColumnCell
    v-for="columnLetter in columnOrder"
    :key="columnLetter"
    :column-letter="columnLetter"
    :column="columns[columnLetter]"
    :is-active="activeColumnLetter === columnLetter || isColumnInSelection(columnLetter)"
  />
</template>
