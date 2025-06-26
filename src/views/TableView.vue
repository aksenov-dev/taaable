<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useTableStore } from '@/stores/table'

import { LoadingOverlay } from '@/shared/ui'
import TableHeader from '@/components/TableView/TableHeader.vue'
import TheToolbar from '@/components/TableView/Toolbar/TheToolbar.vue'
import TheFormula from '@/components/TableView/TheFormula.vue'
import TheTable from '@/components/TableView/Table/TheTable.vue'
import TableFooter from '@/components/TableView/Footer/TableFooter.vue'

interface Props {
  tableId: string
  sheetId?: string
}

const { tableId, sheetId } = defineProps<Props>()

const tableStore = useTableStore()

onMounted(async () => await tableStore.getTable(tableId, sheetId))
onUnmounted(() => tableStore.clear())
</script>

<template>
  <LoadingOverlay :is-visible="tableStore.isLoading" />

  <div class="bg-gray-1 grid h-screen w-screen grid-rows-[100px_28px_1fr_43px] transition-colors">
    <div class="border-b-gray-3 flex flex-col justify-between border-b p-4 transition-colors">
      <TableHeader />
      <TheToolbar />
    </div>

    <TheFormula />
    <TheTable />
    <TableFooter />
  </div>
</template>
