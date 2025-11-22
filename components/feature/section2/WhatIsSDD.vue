<template>
  <SectionCard>
    <h2 class="my-4 ml-6">フロントエンド・バックエンドの開発でよく起きる問題</h2>
    <ul class="ml-8 mt-8 problems">
      <li
        v-for="(el, idx) in problems"
        :key="idx"
        class="my-4"
        v-click
        v-motion
        :initial="{ y: -20 }"
        :enter="{ y: 0 }"
        :leave="{ y: 20 }"
      >
        {{ el }}
      </li>
    </ul>
    <h2
      class="h-[10rem] flex justify-center items-end text-center whitespace-pre-wrap underline"
      v-click
      v-motion
      :initial="{ y: -20 }"
      :enter="{ y: 0 }"
      :leave="{ y: 20 }"
    >
      {{ 'インターフェース(IF)の定義を最初に作ることで解消を図る \r\n → スキーマ駆動開発 (Schema Driven Development)' }}
    </h2>
  </SectionCard>
</template>
<script setup lang="ts">
import SectionCard from '../../SectionCard.vue'
import { useSlideContext } from '@slidev/client'

const { $slidev, $nav } = useSlideContext()

const problems = ['API側の変更に気付けず、フロントエンド側が破損', 'コミュニケーションコストの増大']
</script>
<style scoped>
.problems li {
  font-size: 1.5rem;
  list-style-type: disc;
}
</style>
