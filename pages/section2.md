## 考えるべきポイント

<ConsiderFactors/>

---

<SectionTitle :title="'スキーマ駆動開発でよく起きる問題'"/>

---

## 1. 早すぎた適用🧟

開発初期やプロダクトの本質的な作り込みに注力する時期にスキーマの構築を進め、開発サイクルが鈍化してしまう状態

<br/>

#### 考察

1. PoCやMVPのフェーズでは仕様が頻繁に変わるため都度スキーマをメンテするのは手間になりやすい
2. スキーマを利用して得られる恩恵が何かを再確認する

<br/>

#### 解決するためのポイント

1. スキーマ運用を適用するのはAPIのリリースサイクルが安定してから
2. チームタスクの優先順位を確認し、「今やるべきか」を判断する
   - コミュニケーションコストがかさんできたら適用できるタイミング

---

## 2. OpenAPIのメンテコストが高い

OpenAPIの定義は長くなりがちで、Schemaコンポーネントのパス構造も少し癖がある。

<br/>

### 考察

1. OpenAPIはjson,ymlで書いた際に神ファイルになりがち
   - 分割する際のクセが強い
2. コンポーネント別にファイルを分割するとトラッキングできなくなることも
3. OpenAPIは生でメンテナンスしない方が良いかもしれない

<br/>

### 解決するためのポイント

1. TypeSpecか実装から生成する
   - TypeSpecなら関心ごとを分離しやすく、Linterも十分に機能する
   - BEのエコシステムを活用するのも１つの手

---

### 2-a. EdgeCase: OpenAPI 3.1.0で空Object定義すると `unevaluatedProperties` として評価されてしまう

### 解説

TypeSpecでOpenAPI 3.1.0以上を指定した場合、modelプロパティに空オブジェクトを指定すると `unevaluatedProperties` として解釈される。

````md magic-move {lines: true}
```tsp
model Sample {
    bar: {};
}
```

```yml
bar:
  type: object
  unevaluatedProperties: {}
```

```ts
interface bar = Record<never> //unknownではなくneverとして評価されてしまい、使い勝手が悪い
```
````

---

### 解決策→`Record<unknown>`を明示する

<br/>

````md magic-move {lines: true}
```tsp
model Sample {
    bar: Record<unknown>;
}
```

```yml
bar:
  type: object
  additionalProperties: {}
```

```ts
interface bar = Record<unknown> //additionalPropertiesならunknownとして解釈される
```
````

<p class="text-xs" v-drag="[68,463,631,56]">
https://typespec.io/docs/getting-started/typespec-for-openapi-dev/#additionalpropertiesunevaluatedproperties
</p>

---

## 3. 局所最適化によるコストシフト

---

## 問題の考察

---

## 解決案

### 一口に解決することは難しい→時間とリソースによってトレードオフの構造がシフトするため
