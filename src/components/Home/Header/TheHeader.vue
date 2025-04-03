<script setup lang="ts">
import { DarkThemeToggle, IconGrid } from '@/shared/ui'
</script>

<template>
  <header class="flex justify-between">
    <div class="flex h-7 items-center">
      <IconGrid class="mr-2 h-6 w-6 text-black" />
      <span class="text-extra-large">Taaable</span>
    </div>

    <div class="w-[680px]"></div>

    <DarkThemeToggle :isDark="false" />
  </header>
</template>
