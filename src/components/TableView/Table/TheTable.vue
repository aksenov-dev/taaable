<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue'

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
import TableCellEditor from '@/components/TableView/Table/TableCellEditor.vue'

const { getActiveCell, setActiveCell } = useActiveCell()
const { editingCellId, activateEditor, stopEditing } = useCellEditing()

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

const handleCellEditorBlur = (e: FocusEvent, cellId: string, value: string) => {
  sheetsDataStore.updateCellValue(cellId, value)
  stopEditing()
}

watch([tableContainerRef, () => sheetsStore.currentSheetId], () => {
  if (tableContainerRef.value) tableContainerRef.value.focus()
  stopEditing()
})
</script>

<template>
  <div
    v-if="sheetsDataStore.currentSheetData"
    ref="table-container"
    tabindex="0"
    class="scrollbar border-gray-3 overflow-auto border-t border-b outline-none"
  >
    <div
      role="grid"
      class="grid w-fit"
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
        @cell-dblclick="({ event, cellId }) => activateEditor(cellId, { event })"
        @cell-mousedown="handleCellMouseDown"
      />

      <TableCellEditor
        v-if="editingCellId"
        :table-container="tableContainerRef"
        @blur="handleCellEditorBlur"
      />
    </div>
  </div>
</template>
