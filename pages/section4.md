<SectionTitle title="PLAN-A: TypeScript環境で固める" />

---

## フロントエンド、バックエンドどちらともTypeScriptを使う

### フロントエンド→TypeScript,Nuxt

### バックエンド→Node.js(TypeScript)

### TypeSpecやOpenAPIはソース管理せず、自動生成のみ

---

### Appendix: HonoによるRPC運用

---

### RPCとは？

---

### 実装イメージ

---
transition: fade
---

<SectionTitle :title="'FE,BEどちらともTypeScriptなら同じスキルセットで\r\nメンテできるのでコストパフォーマンスが高い！'"/>

---
transition: fade
---

<SectionTitle title="〜第３部 完〜" />

---
transition: fade
---

<SectionTitle title="...🤔" />

---
transition: fade
---

<SectionTitle title="これができたら苦労しない" />

---

## バックエンドにTypeScriptを選ぶ時の注意点

### 処理によっては他言語の方が向いている場合がある

    - Node.jsはシングルスレッド処理であることを理解する
    - イベントループとスレッドの違い
    - CPUバウンドな処理をメインスレッドで行わせるのは大変
        - 暗号化
        - 画像処理
        - 膨大なデータ処理(数百万回規模のループ等)
        - バッチを適切に動かすには工夫がいる
            - Worker ThreadsやStream活用
        - 数値計算・機械学習等
            - Worker Threadsを使う
            - RustやGoでモジュールを作る
    - どうしても重い処理をやる必要があるならマルチスレッド化が必要
        - Worker Threads の特徴を理解する

---

### エラーハンドリングが辛いことがある

    - Error Typeの識別
        - なんだかんだカスタムエラー型を作ることが多い
    - Promiseのスタックトレースが消える問題
        - ハンドリングの仕方によってerror.stackが消えるのでだいぶ気を付ける必要がある(昔よりはマシらしい)

---

### 長期運用に向かない側面がある

    - BEでは長期運用の負担を下げることが好まれる傾向がある(FEとはかなり文化的背景が違う)
    - Node.js/TypeScript BEの潮流は速いので継続的なメンテが必要
        - これが許容できるなら別に良いかもしれない
    -

###### 参考: [TypeScriptをバックエンドで使わない理由](https://zenn.dev/putcho/articles/32ee8d7ed8ce15)

---
transition: fade
---

<SectionTitle title="メリット・デメリットを考慮した上で技術選定からコスト構造の設計までやれればベスト" />

---
transition: fade
---

<SectionTitle title="実際によく見る構成ではどうか？" />
