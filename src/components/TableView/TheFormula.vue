<script setup lang="ts">
import { computed } from 'vue'

import { useActiveCell } from '@/composables/useActiveCell'
import { useSheetsStore } from '@/stores/sheets'
import { TextInput } from '@/shared/ui'

const { getActiveCell } = useActiveCell()

const sheetsStore = useSheetsStore()

const activeCellId = computed(() => getActiveCell(sheetsStore.currentSheetId))
</script>

<template>
  <div class="flex">
    <TextInput
      variant="range"
      disabled
      :model-value="activeCellId.replace(':', '')"
    />

    <span class="bg-gray-3 w-0.25 shrink-0 transition-colors"></span>

    <TextInput
      variant="formula"
      model-value=""
    />
  </div>
</template>
