<script setup lang="ts">
import { useTemplateRef } from 'vue'

import { useMenuToggle } from '@/composables/useMenuToggle'

import { DropdownMenu, DropdownMenuItem, IconGroup } from '@/shared/ui'

import ToolbarIconContainer from './ToolbarIconContainer.vue'

const menuTriggerRef = useTemplateRef<HTMLElement>('menu-trigger')

const { isMenuOpen, toggleMenu } = useMenuToggle()
</script>

<template>
  <ToolbarIconContainer
    ref="menu-trigger"
    :icon="IconGroup"
    title="Объединить ячейки"
    :is-menu-open="isMenuOpen"
    @click="toggleMenu"
  />

  <DropdownMenu
    :is-open="isMenuOpen"
    :reference-element="menuTriggerRef"
    placement="bottom-start"
    :offset-value="4"
    @close="toggleMenu"
  >
    <DropdownMenuItem title="Объединить все" @click="toggleMenu" />
    <DropdownMenuItem title="Объединить по горизонтали" @click="toggleMenu" />
    <DropdownMenuItem title="Объединить по вертикали" @click="toggleMenu" />
    <DropdownMenuItem title="Отменить объединение" @click="toggleMenu" />
  </DropdownMenu>
</template>
