<template>
  <div class="flex consider-factors">
    <SectionCard
      v-for="(factor, idx) in factorItems"
      :key="idx"
      class="factor-item"
      v-click
      v-motion
      :initial="{ y: -50 }"
      :enter="{ y: 0 }"
      :leave="{ y: 50 }"
    >
      <h3 class="font-bold">{{ factor.title }}</h3>
      <ul class="mt-4 text-xs">
        <li v-for="(description, idx) in factor.descriptions" :key="idx">{{ description }}</li>
      </ul>
    </SectionCard>
  </div>
</template>
<script setup lang="ts">
import SectionCard from '../../SectionCard.vue'

const factorItems = [
  {
    title: '今の開発フェーズは？',
    descriptions: [
      '必要な機能すら模索中ならスキーマの優先度は低い',
      '開発初期？後期？保守フェーズ？',
      '後期、保守フェーズに後からスキーマ運用に切り替えるのはROIが上がりづらい',
    ],
  },
  {
    title: '何を「信頼できる唯一の情報源」とするか',
    descriptions: ['OpenAPI? TypeSpec? 実装？', '実装よりもスキーマを優先させる運用が重要'],
  },
  {
    title: 'スキーマ保守コストは飲み込めるか？',
    descriptions: [
      'OpenAPIを直接書くのはかなり大変',
      'TypeSpecを使うなら学習コストを考慮',
      '小規模チームだとベネフィットとのバランスが微妙',
      'WebSocketやgRPC,GraphQLなどREST以外のAPIは？',
    ],
  },
  {
    title: '開発プロセスの合意は得られているか？',
    descriptions: [
      'スキーマを中心に据えた開発プロセスにチーム全体が合意しているか？',
      'BEチームへの負荷増加をどう説明するか？',
    ],
  },
] satisfies { title: string; descriptions?: string[] }[]
</script>
<style scoped>
.consider-factors {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 1rem;
}

.factor-item {
  padding: 3%;
  min-height: 12rem;
}
</style>
