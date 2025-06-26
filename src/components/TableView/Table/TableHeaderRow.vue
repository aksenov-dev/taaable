<script setup lang="ts">
import { computed } from 'vue'

import type { Cell, ColumnsData } from '@/shared/types'

import { parseCellId } from '@/shared/utils'

import TableHeaderColCell from '@/components/TableView/Table/TableHeaderColCell.vue'

interface Props {
  columnOrder: ColumnsData['columnOrder']
  columns: ColumnsData['columns']
  activeCellId: Cell['cellId']
}

const { columnOrder, columns, activeCellId } = defineProps<Props>()

const activeColumnLetter = computed(() => parseCellId(activeCellId).columnLetter)
</script>

<template>
  <div class="bg-gray-1 border-gray-3 sticky top-0 left-0 z-4 border-r border-b" role="none"></div>

  <TableHeaderColCell
    v-for="columnLetter in columnOrder"
    :key="columnLetter"
    :column-letter="columnLetter"
    :column="columns[columnLetter]"
    :is-active="activeColumnLetter === columnLetter"
  />
</template>
