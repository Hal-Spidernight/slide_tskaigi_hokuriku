<template>
  <SectionCard>
    <h2 class="my-8 flex justify-center items-center h-100 font-bold">{{ title }}</h2>
  </SectionCard>
</template>
<script setup lang="ts">
import SectionCard from './SectionCard.vue'

defineProps<{
  title: string
}>()
</script>
