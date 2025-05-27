<script setup lang="ts">
import { onMounted } from 'vue'
import { useTablesStore } from '@/stores/tables'

import { LoadingOverlay } from '@/shared/ui'

import HomeHeader from '@/components/HomeView/Header/HomeHeader.vue'
import TableList from '@/components/HomeView/TableList/TableList.vue'
import HomeFooter from '@/components/HomeView/HomeFooter.vue'

const tablesStore = useTablesStore()

onMounted(async () => {
  await tablesStore.getTables()
})
</script>

<template>
  <LoadingOverlay v-if="tablesStore.isLoading" />

  <div class="bg-gray-1 grid h-screen w-screen grid-rows-[123px_1fr_72px] p-8 transition-colors">
    <HomeHeader />
    <TableList />
    <HomeFooter />
  </div>
</template>
