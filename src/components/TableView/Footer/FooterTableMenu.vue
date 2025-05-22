<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import { useElementBounding, useThrottleFn } from '@vueuse/core'
import { useTableStore } from '@/stores/table'

import type { DropdownMenuOffset } from '@/shared/ui'

import { DropdownMenu, DropdownMenuItem, IconDelete, IconMoreHorizontal } from '@/shared/ui'
import FooterIconContainer from '@/components/TableView/Footer/FooterIconContainer.vue'

const tableMenuRef = useTemplateRef('table-menu')
const { top, right } = useElementBounding(tableMenuRef)

const isMenuOpen = ref(false)

const tableStore = useTableStore()

const menuOffset = computed<DropdownMenuOffset>(() => {
  return { offsetX: right.value - 174, offsetY: top.value - 46 }
})

const toggleMenu = useThrottleFn(() => (isMenuOpen.value = !isMenuOpen.value), 200)

const removeTable = async () => {
  await tableStore.deleteTable()
  await toggleMenu()
}
</script>

<template>
  <div ref="table-menu">
    <FooterIconContainer @click="toggleMenu">
      <IconMoreHorizontal />
    </FooterIconContainer>

    <DropdownMenu
      :is-open="isMenuOpen"
      :offset="menuOffset"
      @close="toggleMenu"
    >
      <DropdownMenuItem
        title="Удалить таблицу"
        :icon="IconDelete"
        @click="removeTable"
      />
    </DropdownMenu>
  </div>
</template>
