<template>
  <div v-bind="$attrs" class="slide-section-content">
    <slot />
  </div>
</template>
<script setup lang="ts"></script>

<style scoped>
.slide-section-content {
  background: #00000044;
  width: 100%;
  height: 100%;
  border: 1px solid #ffffff22;
  border-radius: 0.5rem;
}
</style>
