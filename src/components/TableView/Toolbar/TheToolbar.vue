<script setup lang="ts">
import {
  IconAlignCenter,
  IconAlignLeft,
  IconAlignRight,
  IconBorderAll,
  IconColorFill,
  IconMinus,
  IconPalette,
  IconPlus,
  IconRedo,
  IconUndo,
  IconVerticalAlignBottom,
  IconVerticalAlignCenter,
  IconVerticalAlignTop,
  TextInput,
} from '@/shared/ui'
import ToolbarIconContainer from '@/components/TableView/Toolbar/ToolbarIconContainer.vue'
import ToolbarMergeCells from '@/components/TableView/Toolbar/ToolbarMergeCells.vue'
import ToolbarTextFormat from '@/components/TableView/Toolbar/ToolbarTextFormat.vue'
import ToolbarVerticalDivider from '@/components/TableView/Toolbar/ToolbarVerticalDivider.vue'
</script>

<template>
  <div class="flex h-7 gap-1.5">
    <ToolbarIconContainer :icon="IconUndo" title="Отменить" />
    <ToolbarIconContainer :icon="IconRedo" title="Повторить" />

    <ToolbarVerticalDivider />

    <ToolbarIconContainer :icon="IconMinus" title="Уменьшить размер шрифта" />
    <TextInput variant="font-size" model-value="12" />
    <ToolbarIconContainer :icon="IconPlus" title="Увеличить размер шрифта" />

    <ToolbarVerticalDivider />

    <ToolbarTextFormat />
    <ToolbarIconContainer :icon="IconPalette" title="Цвет текста" />

    <ToolbarVerticalDivider />

    <ToolbarIconContainer :icon="IconColorFill" title="Цвет заливки" />
    <ToolbarIconContainer :icon="IconBorderAll" title="Границы" />
    <ToolbarMergeCells />

    <ToolbarVerticalDivider />

    <ToolbarIconContainer :icon="IconAlignLeft" title="Выравнивание по левому краю" />
    <ToolbarIconContainer :icon="IconAlignCenter" title="Выравнивание по центру" />
    <ToolbarIconContainer :icon="IconAlignRight" title="Выравнивание по правому краю" />

    <ToolbarVerticalDivider />

    <ToolbarIconContainer :icon="IconVerticalAlignTop" title="Выравнивание по верхнему краю" />
    <ToolbarIconContainer :icon="IconVerticalAlignCenter" title="Выравнивание по центру" />
    <ToolbarIconContainer :icon="IconVerticalAlignBottom" title="Выравнивание по нижнему краю" />
  </div>
</template>
