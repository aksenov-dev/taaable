<script setup lang="ts">
import { useTemplateRef } from 'vue'

import { useTableStore } from '@/stores/table'
import { useMenuToggle } from '@/composables/useMenuToggle.ts'

import { DropdownMenu, DropdownMenuItem, IconDelete, IconMoreHorizontal } from '@/shared/ui'
import FooterIconContainer from '@/components/TableView/Footer/FooterIconContainer.vue'

const menuTriggerRef = useTemplateRef<HTMLElement>('menu-trigger')

const { isMenuOpen, toggleMenu } = useMenuToggle()

const tableStore = useTableStore()

async function removeTable() {
  await tableStore.deleteTable()
  await toggleMenu()
}
</script>

<template>
  <FooterIconContainer
    ref="menu-trigger"
    @click="toggleMenu"
  >
    <IconMoreHorizontal />
  </FooterIconContainer>

  <DropdownMenu
    :is-open="isMenuOpen"
    :reference-element="menuTriggerRef"
    placement="top-end"
    :offset-value="4"
    @close="toggleMenu"
  >
    <DropdownMenuItem
      title="Удалить таблицу"
      :icon="IconDelete"
      @click="removeTable"
    />
  </DropdownMenu>
</template>
