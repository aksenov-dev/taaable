<script setup lang="ts">
import { computed } from 'vue'

import type { Cell, CellsData, ColumnsData, Row } from '@/shared/types'

import { getCellId, parseCellId } from '@/shared/utils'

import TableHeaderRowCell from '@/components/TableView/Table/TableHeaderRowCell.vue'
import TableCell from '@/components/TableView/Table/TableCell.vue'

interface Props {
  columnOrder: Readonly<ColumnsData['columnOrder']>
  rowNumber: string
  row: Row
  cells: CellsData['cells']
  activeCellId: Cell['cellId']
}

const emit = defineEmits<{
  cellDblclick: [{ event: MouseEvent, cellId: string }]
  cellMousedown: [value: string]
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
    @dblclick="payload => emit('cellDblclick', payload)"
    @mousedown="emit('cellMousedown', getCellId(columnLetter, rowNumber))"
  />
</template>
