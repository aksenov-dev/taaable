<script setup lang="ts">
import TheHeader from '@/components/Home/Header/TheHeader.vue'
</script>

<template>
  <div class="bg-gray-1 m-0 grid h-screen w-screen grid-rows-[123px_1fr_72px] p-8 transition-colors">
    <TheHeader />

    <div class="content">
      <main>
        <h3>Main</h3>
      </main>
    </div>

    <footer>Footer</footer>
  </div>
</template>
