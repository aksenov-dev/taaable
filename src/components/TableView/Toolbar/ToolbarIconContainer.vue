<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  icon: Component
  title: string
  isActive?: boolean
  disabled?: boolean
}

const { icon, title, isActive = false, disabled = false } = defineProps<Props>()
</script>

<template>
  <div
    :title="title"
    class="group hover:shadow-brand-1 active:shadow-brand-1 flex h-7 w-7 items-center justify-center rounded-sm
    transition hover:cursor-pointer hover:bg-white active:bg-white dark:hover:bg-black dark:active:bg-black"
    :class="{ 'pointer-events-none': disabled }"
  >
    <component
      :is="icon"
      class="group-hover:text-accent-1 group-active:text-gray-6 h-4.5 w-4.5 transition-colors"
      :class="{
        'text-gray-4': disabled,
        'text-gray-6': !isActive && !disabled,
        'text-black dark:text-white': isActive && !disabled
      }"
    />
  </div>
</template>
