<script setup lang="ts">
import TableHeader from '@/components/TableView/TableHeader.vue'
import TheToolbar from '@/components/TableView/Toolbar/TheToolbar.vue'
import TheFormula from '@/components/TableView/TheFormula.vue'
import TheTable from '@/components/TableView/Table/TheTable.vue'
import TableFooter from '@/components/TableView/TableFooter.vue'
</script>

<template>
  <div class="bg-gray-1 grid h-screen w-screen grid-rows-[100px_28px_1fr_44px] transition-colors">
    <div class="border-b-gray-3 flex flex-col justify-between border-b p-4 transition-colors">
      <TableHeader />
      <TheToolbar />
    </div>

    <TheFormula />
    <TheTable />
    <TableFooter />
  </div>
</template>
