<script setup lang="ts">
import { computed } from 'vue'

import type { Cell, CellsData, ColumnsData } from '@/shared/types'

import { getCellId, parseCellId } from '@/shared/utils'

import { useSelection } from '@/composables/useSelection'

import TableCell from '@/components/TableView/Table/TableCell.vue'
import TableHeaderRowCell from '@/components/TableView/Table/TableHeaderRowCell.vue'

const { columnOrder, rowNumber, cells, activeCellId, isEditing } = defineProps<{
  columnOrder: ColumnsData['columnOrder']
  rowNumber: string
  cells: CellsData['cells']
  activeCellId: Cell['cellId']
  isEditing: boolean
}>()

const emit = defineEmits<{
  cellDblclick: [cellId: string, event: MouseEvent]
  cellMousedown: [cellId: string, event: MouseEvent]
}>()

const { isInSelection, isRowInSelection } = useSelection()

const activeRowNumber = computed(() => parseCellId(activeCellId).rowNumber)
const cellIds = computed(() => columnOrder.map(columnLetter => getCellId(columnLetter, rowNumber)))
</script>

<template>
  <TableHeaderRowCell
    :row-number="rowNumber"
    :is-active="activeRowNumber === rowNumber || isRowInSelection(rowNumber)"
  />

  <TableCell
    v-for="cellId in cellIds"
    :key="cellId"
    :cell="cells[cellId]"
    :is-active="activeCellId === cellId"
    :is-editing="isEditing"
    :is-in-selection="isInSelection(cellId)"
    @dblclick="event => emit('cellDblclick', cellId, event)"
    @mousedown="event => emit('cellMousedown', cellId, event)"
  />
</template>
