<SectionTitle title="PLAN-A: TypeScript環境で固める" />

---

## フロントエンド、バックエンドどちらともTypeScriptを使う

<br/>

- フロントエンド→TypeScript,Nuxt
- バックエンド→Hono(TypeScript)
- TypeSpecやOpenAPIはソース管理せず、<span v-mark.red.circle>RPCで型を連携する</span>
- APIドキュメントはバックエンドの実装からOpenAPIを生成->Redocly

---

### Appendix: HonoによるRPC運用

https://hono.dev/docs/guides/rpc#client

<br/>

引用:

```text

The RPC feature allows sharing of the API specifications between the server and the client.
First, export the typeof your Hono app (commonly called AppType)—or just the routes you want available to the client—from your server code.

RPC 機能を使うと、サーバーとクライアントの間で API 仕様を共有できます。
まず、Hono アプリの typeof（一般的に AppType と呼ばれる）— もしくはクライアント側で利用可能にしたいルートだけ — をサーバー側のコードからエクスポートします。
```

---

#### 実装イメージ(Hono)

````md magic-move {lines: true}
```ts
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { z } from 'zod'
import { describeRoute, resolver, openAPIRouteHandler, validator } from 'hono-openapi'

const app = new Hono()

const UserParams = z.object({
  name: z.string().min(2).describe('The name of the user'),
  email: z.string().describe('The email of the user'),
  age: z.coerce.number().min(0).optional().describe('The age of the user'),
})

const UserResponse = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  age: z.number().optional(),
  createdAt: z.string(),
})
```

```ts
const routes = app.post(
  '/api/users',
  describeRoute({
    description: 'ユーザー情報を取得するAPI',
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': { schema: resolver(UserResponse) },
        },
      },
    },
  }),
  validator('json', UserParams),
  async (c) => {
    const { name, email, age } = c.req.valid('json')
    const user = {
      id: crypto.randomUUID(),
      name,
      email,
      age,
      createdAt: new Date().toISOString(),
    } satisfies z.infer<typeof UserResponse>

    return c.json(user, 201)
  }
)
```

```ts
const documentation = {
  openapi: '3.1.0',
  info: {
    title: 'My API',
    version: '0.0.1',
  },
}

app.get('/docs', openAPIRouteHandler(app, { documentation }))

serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  }
)

export default app

export type AppType = typeof routes
```
````

---

#### 実装イメージ(Nuxt)

<div v-drag="[460,170,391,264]">
    <img width="300" class="mx-auto" src="/images/hono_rpc_1.png"/>
    <p>型を生成しなくてもバックエンドから推論される</p>
</div>

````md magic-move {lines: true}
```vue
<template>
  <div>...</div>
</template>
<script setup lang="ts">
import { hc } from 'hono/client'
import type { AppType } from '../backend/index'

const client = hc<AppType>('http://localhost:3001/')

onMounted(async () => {
  const response = await client.api.users
    .$post({
      json: {
        name: 'Taro Yamada',
        email: 'sssssss@gmail.com',
        age: 25,
      },
    })
    .then((res) => res.json())

  console.log(response.name)
})
</script>
```
````

---
transition: fade
---

<SectionTitle :title="'FE,BEどちらともTypeScriptなら同じスキルセットで\r\nメンテできるのでコストパフォーマンスが高い！'"/>

---
transition: fade
---

<SectionTitle title="BEにはNode.jsを積極的に採用しよう！"/>

<div v-click v-drag="[796,398,88,96]" class="text-center font-bold w-75">
  <h3 >終</h3>
  <hr class="my-2"/>
  <p class="my-0">H  A  L</p>
</div>

---
transition: fade
---

<SectionTitle title="...🤔" />

---

## バックエンドにTypeScriptを選ぶ時の注意点

<br/>

### 要件によっては他言語の方が向いている場合がある

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
        - ハンドリングの仕方によってerror.stackが消えるのでだいぶ気を付ける必要がある

<br/>

### 長期運用に向かない側面を持つ

    - BEでは長期運用の負担を下げることが好まれる傾向がある(FEとはかなり文化的背景が違う)
    - Node.js/TypeScript BEの潮流は速いので継続的なメンテが必要
        - これが許容できるかどうか

<a v-drag="[53,498,264,20,0]" class="text-xs" href="https://zenn.dev/putcho/articles/32ee8d7ed8ce15" target="_blank">参考: TypeScriptをバックエンドで使わない理由</a>

---
transition: fade
---

<SectionTitle :title="'メリット・デメリットを考慮した上で技術選定から \r\n コスト構造の設計までやれればベスト'" />

---
transition: fade
---

<SectionTitle title="実際によく見る構成ではどうか？" />
