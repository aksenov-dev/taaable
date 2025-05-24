<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'

import HeaderFiltersSortType from '@/components/HomeView/Header/HeaderFilters/HeaderFiltersSortType.vue'
import HeaderFiltersViewType from '@/components/HomeView/Header/HeaderFilters/HeaderFiltersViewType.vue'

const settingsStore = useSettingsStore()
</script>

<template>
  <div class="mt-8 flex justify-between">
    <div class="flex gap-3">
      <span class="text-medium text-gray-6 select-none">Сортировка:</span>

      <HeaderFiltersSortType
        variant="title"
        :is-active="settingsStore.settings.sortVariant === 'title'"
        @click="settingsStore.setSortVariant"
      />

      <HeaderFiltersSortType
        variant="date"
        :is-active="settingsStore.settings.sortVariant === 'date'"
        @click="settingsStore.setSortVariant"
      />
    </div>

    <div class="flex items-center gap-3">
      <HeaderFiltersViewType
        variant="list"
        :is-active="settingsStore.settings.viewVariant === 'list'"
        @click="settingsStore.setViewVariant"
      />

      <HeaderFiltersViewType
        variant="grid"
        :is-active="settingsStore.settings.viewVariant === 'grid'"
        @click="settingsStore.setViewVariant"
      />
    </div>
  </div>
</template>
