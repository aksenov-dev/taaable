<script setup lang="ts">
import { useMainStore } from '@/stores/main'

import TableItem from '@/components/Home/TableList/TableItem.vue'

const { settings } = useMainStore()
</script>

<template>
  <div class="scrollbar mx-auto h-full max-h-max w-[680px] rounded-lg bg-white dark:bg-black transition-all overflow-y-auto">
    <main
      class="min-h-21 bg-white p-3 transition-colors dark:bg-black"
      :class="{ 'flex flex-wrap': settings.viewVariant === 'grid' }"
    >
      <p v-if="false" class="text-medium text-gray-6 p-5">Ничего не найдено</p>

      <TableItem title="Бюджет на 2025 год" date="9 янв 2025 г." :variant="settings.viewVariant" />
      <TableItem title="Новая таблица" date="11 янв 2025 г." :variant="settings.viewVariant" />
      <TableItem
        title="Смета плоскостной компонентной формы нового типа и формата"
        date="25 дек 2024 г."
        :variant="settings.viewVariant"
      />
      <TableItem title="Просветление лирического форшлага" date="2 ноя 2024 г." :variant="settings.viewVariant" />
      <TableItem title="Новая таблица 2" date="20 авг 2024 г." :variant="settings.viewVariant" />
      <TableItem title="Новая таблица 2" date="20 авг 2024 г." :variant="settings.viewVariant" />
      <TableItem title="Новая таблица 2" date="20 авг 2024 г." :variant="settings.viewVariant" />
    </main>
  </div>
</template>
