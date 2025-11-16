<template>
  <SectionCard>
    <h2 class="flex justify-center items-center h-100">{{ title }}</h2>
  </SectionCard>
</template>
<script setup lang="ts">
import SectionCard from './SectionCard.vue'

defineProps<{
  title: string
}>()
</script>
