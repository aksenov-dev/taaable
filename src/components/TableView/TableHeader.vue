<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'

import { DarkThemeToggle, IconGrid, TextInput } from '@/shared/ui'

const settingsStore = useSettingsStore()
</script>

<template>
  <header class="flex justify-between gap-4">
    <div class="flex h-7 max-w-[calc(100vw-110px)] items-center transition-colors dark:text-white">
      <IconGrid class="text-accent-1 mr-1.5 h-5 w-5 shrink-0" />

      <TextInput
        model-value="Новая таблица"
        variant="title"
        auto-width
        class="min-w-25"
      />
    </div>

      <DarkThemeToggle
        :is-dark="settingsStore.settings.isDarkTheme"
        @toggle="settingsStore.setDarkTheme"
      />
  </header>
</template>
