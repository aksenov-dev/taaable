<script setup lang="ts">
import { useTableListStore } from '@/stores/tableList'
import { TextInput } from '@/shared/ui'

const tableListStore = useTableListStore()
</script>

<template>
  <TextInput
    v-model.trim="tableListStore.filterText"
    variant="search"
    placeholder="Название таблицы"
  />
</template>
