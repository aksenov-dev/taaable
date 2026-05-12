<script setup lang="ts">
import type { OffsetOptions, Placement } from '@floating-ui/vue'

import { DropdownMenu, DropdownMenuItem, IconDelete, IconEdit } from '@/shared/ui'

defineProps<{
  isOpen: boolean
  referenceElement: HTMLElement | null
  placement: Placement
  offsetValue: OffsetOptions
}>()

const emit = defineEmits<{
  close: []
  rename: []
  delete: []
}>()
</script>

<template>
  <DropdownMenu
    :is-open="isOpen"
    :reference-element="referenceElement"
    :placement="placement"
    :offset-value="offsetValue"
    @close="emit('close')"
  >
    <DropdownMenuItem
      title="Переименовать"
      :icon="IconEdit"
      @click="emit('rename')"
    />

    <DropdownMenuItem
      title="Удалить"
      :icon="IconDelete"
      @click="emit('delete')"
    />
  </DropdownMenu>
</template>
