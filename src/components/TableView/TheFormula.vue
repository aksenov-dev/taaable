<script setup lang="ts">
import { computed } from 'vue'

import { useSheetsStore } from '@/stores/sheets'
import { useSheetsDataMergesStore } from '@/stores/sheetsData/merges'
import { useActiveCell } from '@/composables/useActiveCell'
import { useSelection } from '@/composables/useSelection'

import { TextInput } from '@/shared/ui'

const { getActiveCell } = useActiveCell()
const { hasSelection, getSelectionStart, getSelectionEnd } = useSelection()

const sheetsStore = useSheetsStore()
const mergesStore = useSheetsDataMergesStore()

const activeCellId = computed(() => getActiveCell(sheetsStore.currentSheetId))

const rangeLabel = computed(() => {
  const sheetId = sheetsStore.currentSheetId

  if (sheetId && hasSelection(sheetId)) {
    const start = getSelectionStart(sheetId)?.replace(':', '') ?? ''
    const end = getSelectionEnd(sheetId)?.replace(':', '') ?? ''

    return start === end ? start : `${start}:${end}`
  }

  return mergesStore.activeCellMergeRange ?? activeCellId.value.replace(':', '')
})
</script>

<template>
  <div class="flex">
    <TextInput
      variant="range"
      disabled
      :model-value="rangeLabel"
    />

    <span class="bg-gray-3 w-px shrink-0 transition-colors" />

    <TextInput
      variant="formula"
      model-value=""
    />
  </div>
</template>
