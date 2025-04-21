<script setup lang="ts">
import TheHeader from '@/components/Home/Header/TheHeader.vue'
import TableList from '@/components/Home/TableList/TableList.vue'
import TheFooter from '@/components/Home/TheFooter.vue'
</script>

<template>
  <div class="bg-gray-1 m-0 grid h-screen w-screen grid-rows-[123px_1fr_72px] p-8 transition-colors">
    <TheHeader />
    <TableList />
    <TheFooter />
  </div>
</template>
