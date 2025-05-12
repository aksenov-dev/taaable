<script setup lang="ts">
import TableHeaderRow from '@/components/TableView/Table/TableHeaderRow.vue'
import TableRow from '@/components/TableView/Table/TableRow.vue'
</script>

<template>
  <div class="scrollbar border-gray-3 relative overflow-auto border-t border-b transition-all">
    <div role="grid" class="relative grid w-fit grid-cols-[44px_repeat(26,1fr)] grid-rows-[24px_repeat(100,auto)]">
      <TableHeaderRow />

      <TableRow
        v-for="row of 100"
        :key="row"
        :row="row"
      />
    </div>
  </div>
</template>
