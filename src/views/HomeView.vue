<script setup lang="ts">
import HomeHeader from '@/components/Home/Header/HomeHeader.vue'
import TableList from '@/components/Home/TableList/TableList.vue'
import HomeFooter from '@/components/Home/HomeFooter.vue'
</script>

<template>
  <div class="bg-gray-1 grid h-screen w-screen grid-rows-[123px_1fr_72px] p-8 transition-colors">
    <HomeHeader />
    <TableList />
    <HomeFooter />
  </div>
</template>
