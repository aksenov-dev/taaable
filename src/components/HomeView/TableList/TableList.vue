<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import { useTablesStore } from '@/stores/tables'

import TableItem from '@/components/HomeView/TableList/TableItem.vue'

const settingsStore = useSettingsStore()
const tablesStore = useTablesStore()
</script>

<template>
  <div class="scrollbar mx-auto h-full max-h-max w-[680px] overflow-y-auto rounded-lg bg-white dark:bg-black">
    <main
      class="min-h-21 bg-white p-3 transition-colors dark:bg-black"
      :class="{ 'flex flex-wrap': settingsStore.settings.viewVariant === 'grid' }"
    >
      <template v-if="tablesStore.filteredTableList.length">
        <TableItem
          v-for="table in tablesStore.filteredTableList"
          :key="table.tableId"
          :table-id="table.tableId"
          :title="table.title"
          :date="table.viewedAt"
          :variant="settingsStore.settings.viewVariant"
          @rename="tablesStore.renameTable(table.tableId, $event)"
          @delete="tablesStore.deleteTable(table.tableId)"
        />
      </template>

      <p v-else class="text-medium text-gray-6 p-5">
        {{ tablesStore.filterText ? 'Ничего не найдено' : 'Нет таблиц' }}
      </p>
    </main>
  </div>
</template>
