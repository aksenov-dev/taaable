<script setup lang="ts">
import { computed } from 'vue'

import type { Cell, CellsData, ColumnsData } from '@/shared/types'

import { getCellId, parseCellId } from '@/shared/utils'

import TableCell from '@/components/TableView/Table/TableCell.vue'
import TableHeaderRowCell from '@/components/TableView/Table/TableHeaderRowCell.vue'

interface Props {
  columnOrder: ColumnsData['columnOrder']
  rowNumber: string
  cells: CellsData['cells']
  activeCellId: Cell['cellId']
}

const { columnOrder, rowNumber, cells, activeCellId } = defineProps<Props>()

const emit = defineEmits<{
  cellDblclick: [{ event: MouseEvent, cellId: string }]
  cellMousedown: [value: string]
}>()

const activeRowNumber = computed(() => parseCellId(activeCellId).rowNumber)
</script>

<template>
  <TableHeaderRowCell
    :row-number="rowNumber"
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
