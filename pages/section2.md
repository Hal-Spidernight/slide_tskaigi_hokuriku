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

### Edge Case 1. OpenAPI 3.1.0からTypeScriptの型生成で`Record<string, never>`に変換される

OpenAPIからTypeScriptの型を生成する際には [openapi-typescript](https://github.com/openapi-ts/openapi-typescript)というライブラリを使う。
このライブラリでは`unevaluatedProperties`や`object`を`Record<string, never>`として変換してしまう。

````md magic-move {lines: true}
```yml
Unevaluated:
  type: object
  required:
    - sample3
  properties:
    sample3:
      type: object
```

```ts
{
  Unevaluated: {
    sample3: Record<string, never>
  }
}
```
````

<br/>

#### 解決策→ `additionalProperties` を使う

````md magic-move {lines: true}
```yml
Additional:
  type: object
  required:
    - sample1
  properties:
    sample1:
      type: object
      additionalProperties: {}
```

```ts
{
   Additional: {
      sample1: {
         [key: string]: unknown;
      };
   };
};
```
````

---

### Edge Case 2. TypeSpecからOpenAPI3.1.0に変換する際、`Record<unknown>`や空Objectが `unevaluatedProperties` として評価されてしまう

### 解説

TypeSpecでOpenAPI 3.1.0以上を指定した場合、modelプロパティに型がunknownな連想配列が含まれていると `unevaluatedProperties` として解釈される。

````md magic-move {lines: true}
```tsp
model Sample {
    bar: {};
    bar2: Record<unknown>;
    bar3: {
      ...Record<unknown>;
    };
}
```

```yml
bar:
  type: object
  unevaluatedProperties: {}
bar2:
   type: object
   unevaluatedProperties: {}
bar3:
   type: object
   unevaluatedProperties: {}
```

```ts
//unknownではなくneverとして評価されてしまい、使い勝手が悪い
{
   bar: Record<string, never>;
   bar2: Record<string, never>;
   bar3: Record<string, never>;
}
```
````

---

### 解決策→OpenAPI 3.0.0のemitterを利用する

<br/>

2025.11現在、公式ドキュメント通りに機能しないためTypeSpec Emitterの不具合である可能性が高い。

3.0.0に戻すと解消するので様子見。

```yml {*|6-7}
emit:
  - "@typespec/openapi3"
options:
  "@typespec/openapi3":
    emitter-output-dir: "{cwd}/schemas"
    openapi-versions:
      - 3.0.0
```

<p class="text-xs" v-drag="[68,463,631,56]">
https://typespec.io/docs/getting-started/typespec-for-openapi-dev/#additionalpropertiesunevaluatedproperties
</p>

---

## 3. 局所最適化によるコストシフト

e.g. FEにとってTypeSpecの運用が楽だとしてもBEにとっては旨みが少なく、学習コストとメンテコストが嵩んでしまう

### 考察

- SDDで得られる「ベネフィット」と運用にかかる「コスト」を計りにかけられているか
- チーム全体として効率化に繋がっているか
- <span v-mark.blue.circle>BEエンジニアに対し、実装優先ではいけない理由を十分に説明できるか</span>
- 妥協点は見つけられるが、ベネフィットとコストはトレードオフになることを理解する

<h4 class="mt-12 pa-2 border-1px text-center whitespace-pre-wrap">{{"プロジェクトの時間軸とリソースによってトレードオフ構造がシフトするため、\r\n一辺倒に解決することは難しい"}}</h4>
