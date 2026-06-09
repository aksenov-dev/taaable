<script setup lang="ts">
import { computed } from 'vue'

import type { Cell, CellsData, ColumnsData, Merge } from '@/shared/types'

import { getCellId } from '@/shared/utils'

import { useSelection } from '@/composables/useSelection'

import TableCell from '@/components/TableView/Table/TableCell.vue'
import TableHeaderRowCell from '@/components/TableView/Table/TableHeaderRowCell.vue'

const {
  columnOrder,
  rowNumber,
  cells,
  activeCellId,
  isEditing,
  mergeCoveredSet,
  anchorMerges,
  activeMergeRowNumbers,
} = defineProps<{
  columnOrder: ColumnsData['columnOrder']
  rowNumber: string
  cells: CellsData['cells']
  activeCellId: Cell['cellId']
  isEditing: boolean
  mergeCoveredSet: Set<string>
  anchorMerges: Record<string, Merge>
  activeMergeRowNumbers: Set<string>
}>()

const emit = defineEmits<{
  cellDblclick: [cellId: string, event: MouseEvent]
  cellMousedown: [cellId: string, event: MouseEvent]
}>()

const { isInSelection, isRowInSelection } = useSelection()

const cellIds = computed(() => columnOrder.map(columnLetter => getCellId(columnLetter, rowNumber)))
const visibleCellIds = computed(() => cellIds.value.filter(id => !mergeCoveredSet.has(id)))
</script>

<template>
  <TableHeaderRowCell
    :row-number="rowNumber"
    :is-active="activeMergeRowNumbers.has(rowNumber) || isRowInSelection(rowNumber)"
  />

  <TableCell
    v-for="cellId in visibleCellIds"
    :key="cellId"
    :cell="cells[cellId]"
    :is-active="activeCellId === cellId"
    :is-editing="isEditing"
    :is-in-selection="isInSelection(cellId)"
    :col-span="anchorMerges[cellId]?.colSpan"
    :row-span="anchorMerges[cellId]?.rowSpan"
    @dblclick="event => emit('cellDblclick', cellId, event)"
    @mousedown="event => emit('cellMousedown', cellId, event)"
  />
</template>
