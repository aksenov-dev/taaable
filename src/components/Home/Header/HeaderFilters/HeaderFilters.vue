<script setup lang="ts">
import { useMainStore } from '@/stores/main'

import SortType from '@/components/Home/Header/HeaderFilters/SortType.vue'
import ViewType from '@/components/Home/Header/HeaderFilters/ViewType.vue'

const { settings, setViewVariant } = useMainStore()
</script>

<template>
  <div class="mt-8 flex justify-between">
    <div class="flex gap-3">
      <span class="text-medium text-gray-6">Сортировка:</span>

      <SortType title="По названию" :is-active="true" />
      <SortType title="По дате просмотра" :is-active="false" />
    </div>

    <div class="flex items-center gap-3">
      <ViewType
        variant="list"
        :is-active="settings.viewVariant === 'list'"
        @click="setViewVariant"
      />

      <ViewType
        variant="grid"
        :is-active="settings.viewVariant === 'grid'"
        @click="setViewVariant"
      />
    </div>
  </div>
</template>
