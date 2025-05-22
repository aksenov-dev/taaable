<script setup lang="ts">
import { onMounted } from 'vue'
import { useTableListStore } from '@/stores/tableList'

import { LoadingOverlay } from '@/shared/ui'

import HomeHeader from '@/components/HomeView/Header/HomeHeader.vue'
import TableList from '@/components/HomeView/TableList/TableList.vue'
import HomeFooter from '@/components/HomeView/HomeFooter.vue'

const tableListStore = useTableListStore()

onMounted(async () => {
  await tableListStore.getTables()
})
</script>

<template>
  <LoadingOverlay v-if="tableListStore.isLoading" />

  <div class="bg-gray-1 grid h-screen w-screen grid-rows-[123px_1fr_72px] p-8 transition-colors">
    <HomeHeader />
    <TableList />
    <HomeFooter />
  </div>
</template>
