<script setup lang="ts">
import { useSheetsStore } from '@/stores/sheets'

import FooterSheetItem from '@/components/TableView/Footer/FooterSheetItem.vue'
import FooterIconContainer from '@/components/TableView/Footer/FooterIconContainer.vue'

import { IconPlus } from '@/shared/ui'

const sheetsStore = useSheetsStore()
</script>

<template>
  <div class="flex h-7 max-w-[calc(100vw-110px)] gap-1.5">
    <FooterSheetItem
      v-for="sheet in sheetsStore.sheets"
      :key="sheet.sheetId"
      :title="sheet.title"
      :is-active="sheetsStore.currentSheetId === sheet.sheetId"
      :is-single-sheet="sheetsStore.sheets.length === 1"
      @click="sheetsStore.setCurrentSheet(sheet.sheetId)"
      @rename="sheetsStore.renameSheet(sheet.sheetId, $event)"
      @delete="sheetsStore.deleteSheet(sheet.sheetId)"
    />

    <FooterIconContainer>
      <IconPlus @click="sheetsStore.createSheet" />
    </FooterIconContainer>
  </div>
</template>
