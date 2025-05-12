<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'

import SortType from '@/components/HomeView/Header/HeaderFilters/SortType.vue'
import ViewType from '@/components/HomeView/Header/HeaderFilters/ViewType.vue'

const settingsStore = useSettingsStore()
</script>

<template>
  <div class="mt-8 flex justify-between">
    <div class="flex gap-3">
      <span class="text-medium text-gray-6">Сортировка:</span>

      <SortType
        variant="title"
        :is-active="settingsStore.settings.sortVariant === 'title'"
        @click="settingsStore.setSortVariant"
      />

      <SortType
        variant="date"
        :is-active="settingsStore.settings.sortVariant === 'date'"
        @click="settingsStore.setSortVariant"
      />
    </div>

    <div class="flex items-center gap-3">
      <ViewType
        variant="list"
        :is-active="settingsStore.settings.viewVariant === 'list'"
        @click="settingsStore.setViewVariant"
      />

      <ViewType
        variant="grid"
        :is-active="settingsStore.settings.viewVariant === 'grid'"
        @click="settingsStore.setViewVariant"
      />
    </div>
  </div>
</template>
