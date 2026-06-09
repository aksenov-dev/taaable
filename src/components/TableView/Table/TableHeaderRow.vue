<script setup lang="ts">
import type { ColumnsData } from '@/shared/types'

import { useSelection } from '@/composables/useSelection'

import TableHeaderColumnCell from '@/components/TableView/Table/TableHeaderColumnCell.vue'

const { columnOrder, columns, activeMergeColumnLetters } = defineProps<{
  columnOrder: ColumnsData['columnOrder']
  columns: ColumnsData['columns']
  activeMergeColumnLetters: Set<string>
}>()

const { isColumnInSelection } = useSelection()
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
    :is-active="activeMergeColumnLetters.has(columnLetter) || isColumnInSelection(columnLetter)"
  />
</template>
