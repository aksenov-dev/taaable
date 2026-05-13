<script setup lang="ts">
import { computed } from 'vue'

import { useSettingsStore } from '@/stores/settings'
import { useBreakpoints } from '@/composables/useBreakpoints'

import HeaderFiltersSortType from '@/components/HomeView/Header/HeaderFilters/HeaderFiltersSortType.vue'
import HeaderFiltersViewType from '@/components/HomeView/Header/HeaderFilters/HeaderFiltersViewType.vue'

const settingsStore = useSettingsStore()
const { SM } = useBreakpoints()

const sortVariant = computed(() => settingsStore.settings.sortVariant)
const sortDirection = computed(() => sortVariant.value.endsWith('asc') ? 'asc' : 'desc')

function onSortClick(field: 'title' | 'date') {
  if (sortVariant.value.startsWith(field)) {
    const dir = sortVariant.value.endsWith('asc') ? 'desc' : 'asc'
    settingsStore.setSortVariant(`${field}-${dir}`)
  }
  else {
    settingsStore.setSortVariant(`${field}-asc`)
  }
}
</script>

<template>
  <div class="my-4 sm:my-8 flex justify-between">
    <div class="flex gap-2 sm:gap-3">
      <span
        v-if="SM"
        class="text-medium text-gray-6 select-none transition-colors"
      >
        Сортировка:
      </span>

      <HeaderFiltersSortType
        variant="title"
        :is-active="sortVariant.startsWith('title')"
        :direction="sortDirection"
        @click="onSortClick"
      />

      <HeaderFiltersSortType
        variant="date"
        :is-active="sortVariant.startsWith('date')"
        :direction="sortDirection"
        @click="onSortClick"
      />
    </div>

    <div class="flex items-center gap-2 sm:gap-3">
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
