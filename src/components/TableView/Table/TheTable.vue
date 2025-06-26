<script setup lang="ts">
import { computed, onMounted, useTemplateRef, watch } from 'vue'

import { CELL_SIZE } from '@/shared/constants'
import { useActiveCell } from '@/composables/useActiveCell'
import { useCellEditing } from '@/composables/useCellEditing'
import { useSheetScrollPosition } from '@/composables/useSheetScrollPosition'
import { useScrollActiveCell } from '@/composables/useScrollActiveCell'
import { useKeyboardNavigation } from '@/composables/useKeyboardNavigation'
import { useSheetsStore } from '@/stores/sheets'
import { useSheetsDataStore } from '@/stores/sheetsData'

import TableHeaderRow from '@/components/TableView/Table/TableHeaderRow.vue'
import TableRow from '@/components/TableView/Table/TableRow.vue'

const { getActiveCell, setActiveCell } = useActiveCell()
const { editingCellId, startEditing, stopEditing } = useCellEditing()

const sheetsStore = useSheetsStore()
const sheetsDataStore = useSheetsDataStore()

const tableContainerRef = useTemplateRef('table-container')
useSheetScrollPosition(tableContainerRef)
useScrollActiveCell(tableContainerRef)
useKeyboardNavigation(tableContainerRef)

const columnCount = computed(() => sheetsDataStore.currentSheetData?.columnOrder.length ?? 0)
const rowCount = computed(() => sheetsDataStore.currentSheetData?.rowOrder.length ?? 0)
const activeCellId = computed(() => getActiveCell(sheetsStore.currentSheetId))

const handleCellMouseDown = (cellId: string) => {
  if (sheetsStore.currentSheetId) {
    setActiveCell(sheetsStore.currentSheetId, cellId)
  }
}

const handleCellDblClick = (cellId: string) => startEditing(cellId)
const handleCellBlur = () => stopEditing()

watch([tableContainerRef, () => sheetsStore.currentSheetId], () => {
  if (tableContainerRef.value) tableContainerRef.value.focus()
  stopEditing()
})

onMounted(() => {

})
</script>

<template>
  <div
    v-if="sheetsDataStore.currentSheetData"
    ref='table-container'
    tabindex="0"
    class="scrollbar border-gray-3 relative overflow-auto border-t border-b outline-none"
  >
    <div
      role="grid"
      class="relative grid w-fit"
      :style="{
        gridTemplateColumns: `${CELL_SIZE.HEADER.ROW_WIDTH}px repeat(${columnCount}, 1fr)`,
        gridTemplateRows: `${CELL_SIZE.HEADER.COL_HEIGHT}px repeat(${rowCount}, auto)`
      }"
    >
      <TableHeaderRow
        :column-order="sheetsDataStore.currentSheetData.columnOrder"
        :columns="sheetsDataStore.currentSheetData.columns"
        :active-cell-id="activeCellId"
      />

      <TableRow
        v-for="rowNumber in sheetsDataStore.currentSheetData.rowOrder"
        :key="rowNumber"
        :column-order="sheetsDataStore.currentSheetData.columnOrder"
        :row-number="rowNumber"
        :row="sheetsDataStore.currentSheetData.rows[rowNumber]"
        :cells="sheetsDataStore.currentSheetData.cells"
        :active-cell-id="activeCellId"
        :editing-cell-id="editingCellId"
        @cell-mousedown="handleCellMouseDown"
        @cell-dblclick="handleCellDblClick"
        @cell-blur="handleCellBlur"
      />
    </div>
  </div>
</template>
