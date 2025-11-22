<template>
  <SectionCard class="flex justify-center items-center">
    <h2 class="text-center whitespace-pre-wrap flex justify-center items-center h-100 font-bold">{{ title }}</h2>
  </SectionCard>
</template>
<script setup lang="ts">
import SectionCard from './SectionCard.vue'

defineProps<{
  title: string
}>()
</script>
