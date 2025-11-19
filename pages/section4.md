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

### パフォーマンスや他言語の方が向いている処理はある

    - Node.jsはシングルスレッド処理であることを理解する
    - CPUバウンドな処理はどうか？

### エラーハンドリングがかなり辛い
    - Error Typeの識別
    - 

### 依存関係が増えやすい(標準Utilsが微妙なことがままある)

---

<SectionTitle title="メリット・デメリットを考慮した上で技術選定からコスト構造の設計までやれればベスト" />

---

<SectionTitle title="実際によく見る構成ではどうか？" />
