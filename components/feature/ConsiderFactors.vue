<template>
  <div class="flex consider-factors">
    <SectionCard class="factor-item" v-for="(factor, idx) in factorItems" :key="idx">
      <h5 class="font-bold">{{ factor.title }}</h5>
      <ul class="mt-4">
        <li v-for="(description, idx) in factor.descriptions" :key="idx" class="text-sm">{{ description }}</li>
      </ul>
    </SectionCard>
  </div>
</template>
<script setup lang="ts">
const factorItems = [
  {
    title: '今の開発フェーズは？',
    descriptions: [
      '必要な機能すら模索中ならスキーマの優先度は低いかもしれない',
      '開発初期？後期？保守フェーズ？',
      '後期、保守フェーズに後からスキーマ運用に切り替えるのはROIが上がりづらい',
    ],
  },
  {
    title: '何を真実のソースとするか',
    descriptions: ['実装よりもスキーマを優先させる運用が重要', 'OpenAPI? GraphQL? gRPC?'],
  },
  {
    title: 'スキーマ保守コストは飲み込めるか？',
    descriptions: ['OpenAPIを直接書くのはかなり大変', 'TypeSpecを使うなら学習コストを考慮'],
  },
  {
    title: '開発プロセスの合意は得られているか？',
    descriptions: [
      'スキーマを中心に据えた開発プロセスにチーム全体が合意しているか？',
      'BEチームはスキーマを最初に更新することに納得しているか？',
    ],
  },
] satisfies { title: string; descriptions?: string[] }[]
</script>
<style scoped>
.consider-factors {
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
  gap: 1rem;
}

.factor-item {
  padding: 3%;
  min-height: 12rem;
}
</style>
