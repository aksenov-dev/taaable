<script setup lang="ts">
import { onMounted } from 'vue'

import { useTablesStore } from '@/stores/tables'

import { LoadingOverlay } from '@/shared/ui'
import HomeHeader from '@/components/HomeView/Header/HomeHeader.vue'
import HomeFooter from '@/components/HomeView/HomeFooter.vue'
import TableList from '@/components/HomeView/TableList/TableList.vue'

const tablesStore = useTablesStore()

onMounted(async () => {
  await tablesStore.getTables()
})
</script>

<template>
  <LoadingOverlay :is-visible="tablesStore.isLoading" />

  <div
    class="bg-gray-1 grid h-dvh w-screen p-4 sm:p-8 transition-colors
    grid-rows-[135px_1fr_56px] ml:grid-rows-[123px_1fr_72px] sm:grid-rows-[184px_1fr_72px]"
  >
    <HomeHeader />
    <TableList />
    <HomeFooter />
  </div>
</template>
