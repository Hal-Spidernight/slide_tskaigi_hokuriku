## 考えるべきポイント

<ConsiderFactors/>
<SectionTitle v-click style="position:absolute;top:0;left:0; background:#000b" :title="'そのSDD、FE・設計の負荷を\r\nBEにシフトしているだけになっていませんか？'"/>

---

<SectionTitle :title="'スキーマ駆動開発でよく起きる問題'"/>

---
class: font-bold
---

## 1. 局所最適化によるコストシフト

e.g. FEにとってTypeSpecの運用が楽だとしてもBEにとっては旨みが少なく、

学習コストとメンテコストが嵩んでしまう

<br/>

### 考察

- SDDで得られる「ベネフィット」と運用にかかる「コスト」を計りにかけられているか
- チーム全体として効率化に繋がっているか
- <span v-mark.blue.circle>BEエンジニアに対し、実装優先ではいけない理由を十分に説明できるか</span>
- 妥協点は見つけられるが、ベネフィットとコストはトレードオフになることを理解する

<h4 class="mt-12 pa-2 border-1px text-center whitespace-pre-wrap">{{"プロジェクトの時間軸とリソースによってトレードオフ構造がシフトするため、\r\n一辺倒に解決することは難しい"}}</h4>

---
class: font-bold
---

## 2. 早すぎた適用🧟

開発初期やプロダクトの本質的な作り込みに注力する時期にスキーマの構築を進め、

開発サイクルが鈍化してしまう状態

<br/>

#### 考察

1. PoCやMVPのフェーズでは仕様が頻繁に変わるため都度スキーマをメンテするのは手間になりやすい
2. スキーマを利用して得られる恩恵が何かを再確認する

<br/>

#### 解決するためのポイント

1. スキーマ運用を適用するのはAPIのリリースサイクルが安定してから
2. チームタスクの優先順位を確認し、<span v-mark.red>「今やるべきか」を判断する</span>
   - コミュニケーションコストがかさんできたら適用できるタイミング(コストについては後述)

---
# src: ./section2-edge-case.md
class: font-bold
---

## 3. そもそもOpenAPIのメンテコストが高い

OpenAPIの定義は長くなりがちで、スケールするほど認知負荷が高まる。

<br/>

### 考察

1. OpenAPIはjson,ymlで書いた際に神ファイルになっていることが多い
   - 分割するのも限界がある
   - 十分な追跡は期待できない
2. コンポーネント別にファイルを分割するとトラッキングできなくなることも
3. <span v-mark.yellow>OpenAPIは生でメンテナンスしない方が良いかもしれない</span>

<br/>

### 解決するためのポイント

1. [TypeSpec](https://typespec.io/)か実装から生成する
   - TypeSpecなら関心ごとを分離しやすく、Linterも十分に機能する
   - BEのエコシステムを活用するのも１つの手

<SectionTitle v-click :title="'これらの課題を解決する糸口は\r\nSDDの流動的なコスト構造にある'" style="position:absolute;top:0;left:0;background:#000c"/>

