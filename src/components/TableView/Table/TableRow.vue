<script setup lang="ts">
import { computed } from 'vue'

import type { Cell, CellsData, ColumnsData, Row } from '@/shared/types'

import { getCellId, parseCellId } from '@/shared/utils'

import TableHeaderRowCell from '@/components/TableView/Table/TableHeaderRowCell.vue'
import TableCell from '@/components/TableView/Table/TableCell.vue'

interface Props {
  columnOrder: ColumnsData['columnOrder']
  rowNumber: string
  row: Row
  cells: CellsData['cells']
  activeCellId: Cell['cellId']
  editingCellId: Cell['cellId'] | null
}

const emit = defineEmits<{
  cellKeydown: [e: KeyboardEvent]
  cellMousedown: [value: string]
  cellDblclick: [value: string]
  cellBlur: []
}>()

const { columnOrder, rowNumber, row, cells, activeCellId } = defineProps<Props>()

const activeRowNumber = computed(() => parseCellId(activeCellId).rowNumber)
</script>

<template>
  <TableHeaderRowCell
    :row-number="rowNumber"
    :row="row"
    :is-active="activeRowNumber === rowNumber"
  />

  <TableCell
    v-for="columnLetter in columnOrder"
    :key="getCellId(columnLetter, rowNumber)"
    :cell="cells[getCellId(columnLetter, rowNumber)]"
    :is-active="activeCellId === getCellId(columnLetter, rowNumber)"
    :is-editing="editingCellId === getCellId(columnLetter, rowNumber)"
    @keydown="emit('cellKeydown', $event)"
    @mousedown="emit('cellMousedown', getCellId(columnLetter, rowNumber))"
    @dblclick="emit('cellDblclick', getCellId(columnLetter, rowNumber))"
    @blur="emit('cellBlur')"
  />
</template>
