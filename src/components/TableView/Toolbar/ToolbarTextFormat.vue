<script setup lang="ts">
import { modKey } from '@/shared/utils/platform'

import { useSheetsDataCellsStore } from '@/stores/sheetsData/cells'

import { IconBold, IconItalic, IconStrike } from '@/shared/ui'
import ToolbarIconContainer from '@/components/TableView/Toolbar/ToolbarIconContainer.vue'

const cellsStore = useSheetsDataCellsStore()
</script>

<template>
  <ToolbarIconContainer
    :icon="IconBold"
    :title="`Полужирный (${modKey}B)`"
    :is-active="cellsStore.isAllBold"
    @click="cellsStore.toggleSelectionStyle('bold')"
  />

  <ToolbarIconContainer
    :icon="IconItalic"
    :title="`Курсив (${modKey}I)`"
    :is-active="cellsStore.isAllItalic"
    @click="cellsStore.toggleSelectionStyle('italic')"
  />

  <ToolbarIconContainer
    :icon="IconStrike"
    :title="`Зачеркнутый (${modKey}S)`"
    :is-active="cellsStore.isAllStrikethrough"
    @click="cellsStore.toggleSelectionStyle('strikethrough')"
  />
</template>
