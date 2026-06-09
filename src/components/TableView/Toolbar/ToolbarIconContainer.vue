<script setup lang="ts">
import type { Component } from 'vue'

const { icon, title, isActive = false, isMenuOpen = false, disabled = false } = defineProps<{
  icon: Component
  title: string
  isActive?: boolean
  isMenuOpen?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <div
    :title="title"
    class="group hover:shadow-brand-1 active:shadow-brand-1 flex h-7 w-7 items-center justify-center rounded-sm
    transition hover:cursor-pointer hover:bg-white active:bg-white dark:hover:bg-black dark:active:bg-black"
    :class="{
      'pointer-events-none': disabled,
      'shadow-brand-1 bg-white dark:bg-black': isMenuOpen,
    }"
    @mousedown.prevent
  >
    <component
      :is="icon"
      class="group-hover:text-accent-1 group-active:text-gray-6 h-4.5 w-4.5 transition-colors"
      :class="{
        'text-gray-4': disabled,
        'text-gray-6': !isActive && !isMenuOpen && !disabled,
        'text-black dark:text-white': isActive && !isMenuOpen && !disabled,
        'text-accent-1': isMenuOpen && !disabled,
      }"
    />
  </div>
</template>
