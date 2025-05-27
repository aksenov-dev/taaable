<script setup lang="ts">
import { useSheetStore } from '@/stores/sheet'

import FooterSheetItem from '@/components/TableView/Footer/FooterSheetItem.vue'
import FooterIconContainer from '@/components/TableView/Footer/FooterIconContainer.vue'

import { IconPlus } from '@/shared/ui'

const sheetStore = useSheetStore()
</script>

<template>
  <div class="flex h-7 max-w-[calc(100vw-110px)] gap-1.5">
    <FooterSheetItem
      v-for="sheet in sheetStore.sheets"
      :key="sheet.sheetId"
      :title="sheet.title"
      :is-active="sheetStore.currentSheetId === sheet.sheetId"
      :is-single-sheet="sheetStore.sheets.length === 1"
      @click="sheetStore.setCurrentSheet(sheet.sheetId)"
      @rename="sheetStore.renameSheet(sheet.sheetId, $event)"
      @delete="sheetStore.deleteSheet(sheet.sheetId)"
    />

    <FooterIconContainer>
      <IconPlus @click="sheetStore.createSheet" />
    </FooterIconContainer>
  </div>
</template>
