<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

import { useSheetsDataMergesStore } from '@/stores/sheetsData/merges'
import { useMenuToggle } from '@/composables/useMenuToggle'

import { DropdownMenu, DropdownMenuItem, IconGroup } from '@/shared/ui'

import ToolbarIconContainer from './ToolbarIconContainer.vue'

const mergesStore = useSheetsDataMergesStore()

const menuTriggerRef = useTemplateRef<HTMLElement>('menu-trigger')

const { isMenuOpen, toggleMenu } = useMenuToggle()

const isDisabled = computed(() => {
  return !mergesStore.canMerge && !mergesStore.canMergeHorizontally
    && !mergesStore.canMergeVertically && !mergesStore.canUnmerge
})

async function handleMergeAll() {
  await mergesStore.mergeCells()
  toggleMenu()
}

async function handleMergeHorizontally() {
  await mergesStore.mergeHorizontally()
  toggleMenu()
}

async function handleMergeVertically() {
  await mergesStore.mergeVertically()
  toggleMenu()
}

async function handleUnmerge() {
  await mergesStore.unmergeCells()
  toggleMenu()
}
</script>

<template>
  <ToolbarIconContainer
    ref="menu-trigger"
    :icon="IconGroup"
    title="Объединить ячейки"
    :is-menu-open="isMenuOpen"
    :is-active="mergesStore.canUnmerge"
    :disabled="isDisabled"
    @click="toggleMenu"
  />

  <DropdownMenu
    :is-open="isMenuOpen"
    :reference-element="menuTriggerRef"
    placement="bottom-start"
    :offset-value="4"
    @close="toggleMenu"
  >
    <DropdownMenuItem
      title="Объединить все"
      :disabled="!mergesStore.canMerge"
      @click="handleMergeAll"
    />

    <DropdownMenuItem
      title="Объединить по горизонтали"
      :disabled="!mergesStore.canMergeHorizontally"
      @click="handleMergeHorizontally"
    />

    <DropdownMenuItem
      title="Объединить по вертикали"
      :disabled="!mergesStore.canMergeVertically"
      @click="handleMergeVertically"
    />

    <DropdownMenuItem
      title="Отменить объединение"
      :disabled="!mergesStore.canUnmerge"
      @click="handleUnmerge"
    />
  </DropdownMenu>
</template>
