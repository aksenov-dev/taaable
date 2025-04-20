<script setup lang="ts">
import { useMainStore } from '@/stores/main'

import { DarkThemeToggle, IconGrid } from '@/shared/ui'
import HeaderSearch from '@/components/Home/Header/HeaderSearch.vue'
import HeaderFilters from '@/components/Home/Header/HeaderFilters/HeaderFilters.vue'

const { settings, setDarkTheme } = useMainStore()
</script>

<template>
  <header class="flex justify-between">
    <div class="flex h-7 w-30 items-center text-black transition-colors dark:text-white">
      <IconGrid class="mr-2 h-6 w-6" />
      <span class="text-extra-large">Taaable</span>
    </div>

    <div class="w-[680px]">
      <HeaderSearch />
      <HeaderFilters />
    </div>

    <div class="flex w-30 justify-end">
      <DarkThemeToggle :is-dark="settings.isDarkTheme" @toggle="setDarkTheme" />
    </div>
  </header>
</template>
