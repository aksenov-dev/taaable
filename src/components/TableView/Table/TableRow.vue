<script setup lang="ts">
import TableHeaderRowCell from '@/components/TableView/Table/TableHeaderRowCell.vue'
import TableCell from '@/components/TableView/Table/TableCell.vue'

interface Props {
  row: number
}

const { row } = defineProps<Props>()
</script>

<template>
  <TableHeaderRowCell :row="row" />

  <TableCell
    v-for="col in 26"
    :key="col"
    :row="row"
    :col="col"
  />
</template>
