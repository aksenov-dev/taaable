<script setup lang="ts">
import { computed, reactive, useTemplateRef, watch } from 'vue'

import { CELL_SIZE } from '@/shared/constants'
import { useActiveCell } from '@/composables/useActiveCell'
import { useCellEditing } from '@/composables/useCellEditing'
import { useSheetScrollPosition } from '@/composables/useSheetScrollPosition'
import { useScrollActiveCell } from '@/composables/useScrollActiveCell'
import { useKeyboardNavigation } from '@/composables/useKeyboardNavigation'
import { useRowResize } from '@/composables/useRowResize'
import { useColumnResize } from '@/composables/useColumnResize'
import { useResizeRuler } from '@/composables/useResizeRuler'
import { useSheetsStore } from '@/stores/sheets'
import { useSheetsDataStore } from '@/stores/sheetsData'

import TableHeaderRow from '@/components/TableView/Table/TableHeaderRow.vue'
import TableRow from '@/components/TableView/Table/TableRow.vue'
import TableCellEditor from '@/components/TableView/Table/TableCellEditor.vue'
import TableRowResizer from '@/components/TableView/Table/TableRowResizer.vue'
import TableColumnResizer from '@/components/TableView/Table/TableColumnResizer.vue'

const { getActiveCell, setActiveCell } = useActiveCell()
const { editingCellId, activateEditor, stopEditing } = useCellEditing()

const tableContainerRef = useTemplateRef('table-container')
const tableScroll = reactive({ left: 0, top: 0 })

useSheetScrollPosition(tableContainerRef)
useScrollActiveCell(tableContainerRef)
useKeyboardNavigation(tableContainerRef)

const resizeRuler = useResizeRuler()
const { isResizeRulerVisible, resizeRulerPosition } = resizeRuler

const { resizingRowNumber, startRowResize } = useRowResize(resizeRuler, tableContainerRef)
const { resizingColumnLetter, startColumnResize } = useColumnResize(resizeRuler, tableContainerRef)

const sheetsStore = useSheetsStore()
const sheetsDataStore = useSheetsDataStore()

const columnCount = computed(() => sheetsDataStore.currentSheetData?.columnOrder.length ?? 0)
const rowCount = computed(() => sheetsDataStore.currentSheetData?.rowOrder.length ?? 0)
const activeCellId = computed(() => getActiveCell(sheetsStore.currentSheetId))

const gridTemplateRows = computed(() => {
  const header = `${CELL_SIZE.HEADER.COL_HEIGHT}px`
  if (!sheetsDataStore.currentSheetData) return `${header} repeat(${rowCount.value}, auto)`

  const rows = sheetsDataStore.currentSheetData.rows
  const rowOrder = sheetsDataStore.currentSheetData.rowOrder

  return `${header} ${rowOrder.map(order => rows[order].isAutoHeight ? 'auto' : rows[order].height + 'px').join(' ')}`
})

const onTableScroll = (e: Event): void => {
  const target = e.target as HTMLElement
  tableScroll.left = target.scrollLeft
  tableScroll.top = target.scrollTop
}

const handleCellMouseDown = (cellId: string): void => {
  if (sheetsStore.currentSheetId) {
    setActiveCell(sheetsStore.currentSheetId, cellId)
  }
}

const handleCellEditorBlur = (e: FocusEvent, cellId: string, value: string): void => {
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
    class="scrollbar border-gray-3 overflow-auto border-t border-b outline-none relative"
    @scroll="onTableScroll"
  >
    <TableRowResizer
      v-for="rowNumber in sheetsDataStore.currentSheetData.rowOrder.slice(0, -1)"
      :key="rowNumber"
      :row-number="rowNumber"
      :row="sheetsDataStore.currentSheetData.rows[rowNumber]"
      :position="resizeRulerPosition"
      :table-scroll-left="tableScroll.left"
      :ruler-visible="isResizeRulerVisible && rowNumber === resizingRowNumber"
      @mousedown="startRowResize"
      @dblclick="sheetsDataStore.resetRowAutoHeight"
    />

    <TableColumnResizer
      v-for="columnLetter in sheetsDataStore.currentSheetData.columnOrder.slice(0, -1)"
      :key="columnLetter"
      :column-letter="columnLetter"
      :column="sheetsDataStore.currentSheetData.columns[columnLetter]"
      :position="resizeRulerPosition"
      :ruler-visible="isResizeRulerVisible && columnLetter === resizingColumnLetter"
      @mousedown="startColumnResize"
      @dblclick="sheetsDataStore.fitColumnWidthToContent"
    />

    <div
      role="grid"
      class="grid w-fit"
      :style="{
        gridTemplateColumns: `${CELL_SIZE.HEADER.ROW_WIDTH}px repeat(${columnCount}, 1fr)`,
        gridTemplateRows
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
