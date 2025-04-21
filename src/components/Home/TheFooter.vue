<script setup lang="ts">
import { BaseButton, IconPlus } from '@/shared/ui'
</script>

<template>
  <footer class="flex items-end justify-between">
    <a
      href="#"
      class="mb-1.25 block h-7.5 w-25 bg-[url(@/assets/partner.svg)] bg-no-repeat transition-[background]
      dark:bg-[url(@/assets/partner-dark.svg)]"
    ></a>
    <BaseButton text="Создать таблицу" :icon="IconPlus" />
  </footer>
</template>
