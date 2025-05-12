<script setup lang="ts">
import { TextInput } from '@/shared/ui'
</script>

<template>
  <div class="flex">
    <TextInput
      variant="range"
      model-value="B2"
    />

    <span class="bg-gray-3 w-0.25 shrink-0 transition-colors"></span>

    <TextInput
      variant="formula"
      model-value="12345"
    />
  </div>
</template>
