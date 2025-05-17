<script setup lang="ts">
import FooterSheetItem from '@/components/TableView/Footer/FooterSheetItem.vue'
import FooterIconContainer from '@/components/TableView/Footer/FooterIconContainer.vue'

import { IconPlus } from '@/shared/ui'
</script>

<template>
  <div class="flex h-7 max-w-[calc(100vw-110px)] gap-1.5">
    <FooterSheetItem title="Лист 1" :is-active="true" />
    <FooterSheetItem title="Лист 2" />

    <FooterIconContainer>
      <IconPlus />
    </FooterIconContainer>
  </div>
</template>
