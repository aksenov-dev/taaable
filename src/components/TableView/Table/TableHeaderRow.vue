<script setup lang="ts">
import TableHeaderColCell from '@/components/TableView/Table/TableHeaderColCell.vue'
</script>

<template>
  <div class="bg-gray-1 border-gray-3 sticky top-0 left-0 z-4 border-r border-b" role="none"></div>

  <TableHeaderColCell
    v-for="letter in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'"
    :key="letter"
    :text="letter"
  />
</template>
