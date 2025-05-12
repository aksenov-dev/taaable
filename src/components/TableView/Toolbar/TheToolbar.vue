<script setup lang="ts">
import ToolbarIconContainer from '@/components/TableView/Toolbar/ToolbarIconContainer.vue'
import ToolbarVerticalDivider from '@/components/TableView/Toolbar/ToolbarVerticalDivider.vue'

import {
  IconUndo,
  IconRedo,
  IconMinus,
  IconPlus,
  IconBold,
  IconItalic,
  IconStrike,
  IconPalette,
  IconColorFill,
  IconBorderAll,
  IconGroup,
  IconAlignLeft,
  IconAlignCenter,
  IconAlignRight,
  IconVerticalAlignTop,
  IconVerticalAlignCenter,
  IconVerticalAlignBottom,
  TextInput
} from '@/shared/ui'
</script>

<template>
  <div class="flex h-7 gap-1.5">
    <ToolbarIconContainer :icon="IconUndo" title="Отменить" />
    <ToolbarIconContainer :icon="IconRedo" title="Повторить" />

    <ToolbarVerticalDivider />

    <ToolbarIconContainer :icon="IconMinus" title="Уменьшить размер шрифта" />
    <TextInput variant="font-size" :model-value="'12'" />
    <ToolbarIconContainer :icon="IconPlus" title="Увеличить размер шрифта" />

    <ToolbarVerticalDivider />

    <ToolbarIconContainer :icon="IconBold" title="Полужирный" />
    <ToolbarIconContainer :icon="IconItalic" title="Курсив" />
    <ToolbarIconContainer :icon="IconStrike" title="Зачеркнутый" />
    <ToolbarIconContainer :icon="IconPalette" title="Цвет текста" />

    <ToolbarVerticalDivider />

    <ToolbarIconContainer :icon="IconColorFill" title="Цвет заливки" />
    <ToolbarIconContainer :icon="IconBorderAll" title="Границы" />
    <ToolbarIconContainer :icon="IconGroup" title="Объединить ячейки" />

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
