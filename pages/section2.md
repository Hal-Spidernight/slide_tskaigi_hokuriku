## 考えるべきポイント

<ConsiderFactors/>
<SectionTitle v-click style="position:absolute;top:0;left:0; background:#000b" :title="'そのSDD、FE・設計の負荷を\r\nBEにシフトしているだけになっていませんか？'"/>

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
2. チームタスクの優先順位を確認し、<span v-mark.red>「今やるべきか」を判断する</span>
   - コミュニケーションコストがかさんできたら適用できるタイミング

---

## 2. OpenAPIのメンテコストが高い

OpenAPIの定義は長くなりがちで、Schemaコンポーネントのパス構造も少し癖がある。

<br/>

### 考察

1. OpenAPIはjson,ymlで書いた際に神ファイルになりがち
   - 分割する際のクセが強い
2. コンポーネント別にファイルを分割するとトラッキングできなくなることも
3. <span v-mark.yellow>OpenAPIは生でメンテナンスしない方が良いかもしれない</span>

<br/>

### 解決するためのポイント

1. TypeSpecか実装から生成する
   - TypeSpecなら関心ごとを分離しやすく、Linterも十分に機能する
   - BEのエコシステムを活用するのも１つの手

---

### Edge Case 1. OpenAPI 3.1.0 `unevaluatedProperties`を利用すると、TypeScriptの型生成で`Record<never>`に変換される

### 解説

OpenAPIからTypeScriptの型を生成する際には [openapi-typescript](https://github.com/openapi-ts/openapi-typescript)というライブラリを使う。
このライブラリではunevaluatedPropertiesを`Record<never>`として変換してしまい、使い勝手が悪いケースがある。

<br/>

### 解決策→ `additionalProperties` を使う

```ts
//Record<unknown> として評価される
```

---

### Edge Case 2. TypeSpec & OpenAPIで空Object定義すると `unevaluatedProperties` として評価されてしまう

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

e.g. FEにとってTypeSpecの運用が楽だとしてもBEにとっては旨みが少なく、学習コストとメンテコストが嵩んでしまう

### 考察

- SDDで得られる「ベネフィット」と運用にかかる「コスト」を計りにかけられているか
- チーム全体として効率化に繋がっているか
- BEエンジニアに対し、実装優先ではいけない理由を十分に説明できるか
- 妥協点は見つけられるが、ベネフィットとコストはトレードオフになることを理解する

<h4 class="mt-12 pa-2 border-1px text-center whitespace-pre-wrap">{{"プロジェクトの時間軸とリソースによってトレードオフ構造がシフトするため、\r\n一辺倒に解決することは難しい"}}</h4>
