<script setup lang="ts">
import { computed } from 'vue'

import { useSettingsStore } from '@/stores/settings'
import { useTablesStore } from '@/stores/tables'

import TableItemGrid from './TableItemGrid.vue'
import TableItemList from './TableItemList.vue'

const settingsStore = useSettingsStore()
const tablesStore = useTablesStore()

const currentComponent = computed(() => settingsStore.settings.viewVariant === 'list' ? TableItemList : TableItemGrid)
</script>

<template>
  <div
    class="scrollbar mx-auto h-full max-h-max overflow-y-auto rounded-lg bg-white
    w-full ml:max-w-[calc(100%-304px)] ml:w-170 transition-colors dark:bg-black"
  >
    <main
      class="min-h-21 bg-white p-2 sm:p-3 transition-colors dark:bg-black"
      :class="{ 'flex flex-wrap': settingsStore.settings.viewVariant === 'grid' }"
    >
      <template v-if="tablesStore.filteredTables.length">
        <component
          :is="currentComponent"
          v-for="table in tablesStore.filteredTables"
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
