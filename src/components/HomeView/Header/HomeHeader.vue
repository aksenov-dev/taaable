<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'

import { DarkThemeToggle, IconGrid } from '@/shared/ui'
import HeaderFilters from '@/components/HomeView/Header/HeaderFilters/HeaderFilters.vue'
import HeaderSearch from '@/components/HomeView/Header/HeaderSearch.vue'

const settingsStore = useSettingsStore()
</script>

<template>
  <header class="flex justify-between gap-x-10 gap-y-8 md:flex-wrap ml:flex-nowrap">
    <div class="flex h-7 w-28 items-center text-black transition-colors dark:text-white shrink-0">
      <IconGrid class="mr-2 h-6 w-6" />
      <span class="text-extra-large select-none">Taaable</span>
    </div>

    <div class="w-full ml:max-w-170 md:order-1 ml:order-0">
      <HeaderSearch />
      <HeaderFilters />
    </div>

    <div class="flex w-28 justify-end shrink-0">
      <DarkThemeToggle
        :is-dark="settingsStore.settings.isDarkTheme"
        @toggle="settingsStore.setDarkTheme"
      />
    </div>
  </header>
</template>
