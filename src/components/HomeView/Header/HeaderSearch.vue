<script setup lang="ts">
import { useTablesStore } from '@/stores/tables'
import { TextInput } from '@/shared/ui'

const tablesStore = useTablesStore()
</script>

<template>
  <TextInput
    v-model.trim="tablesStore.filterText"
    variant="search"
    placeholder="Название таблицы"
  />
</template>
