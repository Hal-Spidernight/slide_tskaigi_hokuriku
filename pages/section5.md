<SectionTitle title="PLAN-B: 異種間言語連携のハイブリッド戦略" />

---

## 戦略の前提

- 「銀の弾丸」は存在しない
- ユースケースの特徴ごとに「こうしたらゲインが出やすいのではないか」という提案

<br/>

### 時間軸やチーム規模、プロダクトの状況によって大きく変わるため、

### いくつかの事例別に適用方法を紹介

---

## A. 新規プロダクトのMVPが見えているスケール案件

<br/>

### 技術スタック

| 分野         | 言語/FW                |
| ------------ | ---------------------- |
| FE           | Nuxt                   |
| BE           | Python >=3.10, FastAPI |
| スキーマ定義 | なし                   |

<br/>

### ポイント

- PMFが見えているとはいえ、まだスピード感を持った開発が要求される
- 既に実装したAPIの仕様が大幅に変わる可能性は低い
- 新たに実装するAPIの数自体は少ない
  - アジャイル開発の場合、１フェーズで大量に機能をリリースすることは珍しい

---

## Aへの提案： FastAPIのRouter実装を調整してOpenAPIファイル&TypeScriptの型を生成

<br/>

1. FE,BEの開発を非同期で行うためにまずIFの合意をとる
2. BEエンジニアがAPIエントリポイントとmodelを定義する
3. OpenAPI向けの設定をFastAPI Appに追加し、生成
4. 生成されたOpenAPI SpecからTypeScriptの型ファイルを生成

※3,4はスクリプト等で自動化する

<br/>

```mermaid
graph LR
    B[BE: APIエントリポイントとmodelの定義];
    B --> C[FastAPI AppにOpenAPI設定を追加];
    C --> D{OpenAPI 生成};
    D --> E1[TypeScript  型ファイル生成];
    E1 --> E2[生成された型を元にAPI連携部実装];
    E2 --> E3[APIとの連携];
    D --> F1[エントリポイントのIFに適合するよう実装];
    F1 --> F2[APIの提供];
    F2 --> E3;

    subgraph FE
        E1
        E2
        E3
    end

    subgraph BE
        F1
        F2
    end


```

---

### e.g.

````md magic-move {lines: true}
```python
from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi

app = FastAPI(
    title="サンプルAPI",
    openapi_url="/api/v1/openapi.json"
)
…

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    app.openapi_schema = get_openapi(
        title="サンプルAPI",
        version="1.0.0",
        description="サンプルのAPIです",
        routes=app.routes,
        openapi_version="3.1.0",
    )
    return app.openapi_schema

app.openapi = custom_openapi

```

```python
from pydantic import BaseModel, Field
from datetime import datetime

class SampleRequest(BaseModel):
    id: str = Field("",summary="サンプルID",description="サンプルAPIのID")
    params: list[str] | None = Field(None, summary="サンプルパラメータ", description="サンプルAPIのパラメータ")

class SampleResponse(BaseModel):
    name: str = Field("",summary="名前",description="IDに紐づく名称")
    created_at: datetime
    updated_at: datetime

@app.get("/example",response_model=SampleResponse)
def read_root(sample_request:SampleRequest):
    now = datetime.now()
    return {
        "name": "サンプル 太郎",
        "created_at": now,
        "updated_at": now
        }
```
````

---

````md magic-move {lines: true}
```json
//openapi.json
{
  "openapi": "3.1.0",
  "info": { "title": "サンプルAPI", "description": "サンプルのAPIです", "version": "1.0.0" },
  "paths": {
    "/example": {
      "get": {
        "summary": "Read Root",
        "operationId": "read_root_example_get",
        "requestBody": {
          "content": { "application/json": { "schema": { "$ref": "#/components/schemas/SampleRequest" } } },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/SampleResponse" } } }
          },
          "422": {
            "description": "Validation Error",
            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/HTTPValidationError" } } }
          }
        }
      }
    }
  },
  …
```

```json
    "components": {
        "schemas": {
        "HTTPValidationError": {
            "properties": {
            "detail": { "items": { "$ref": "#/components/schemas/ValidationError" }, "type": "array", "title": "Detail" }
            },
            "type": "object",
            "title": "HTTPValidationError"
        },
        "SampleRequest": {
            "properties": {
            "id": {
                "type": "string",
                "title": "Id",
                "description": "サンプルAPIのID",
                "default": "",
                "summary": "サンプルID"
            },
            "params": {
                "anyOf": [{ "items": { "type": "string" }, "type": "array" }, { "type": "null" }],
                "title": "Params",
                "description": "サンプルAPIのパラメータ",
                "summary": "サンプルパラメータ"
            }
            },
            "type": "object",
            "title": "SampleRequest"
        },
```

```json
        "SampleResponse": {
            "properties": {
            "name": {
                "type": "string",
                "title": "Name",
                "description": "IDに紐づく名称",
                "default": "",
                "summary": "名前"
            },
            "created_at": { "type": "string", "format": "date-time", "title": "Created At" },
            "updated_at": { "type": "string", "format": "date-time", "title": "Updated At" }
            },
            "type": "object",
            "required": ["created_at", "updated_at"],
            "title": "SampleResponse"
        },
        "ValidationError": {
            "properties": {
                "loc": {
                "items": { "anyOf": [{ "type": "string" }, { "type": "integer" }] },
                "type": "array",
                "title": "Location"
                },
                "msg": { "type": "string", "title": "Message" },
                "type": { "type": "string", "title": "Error Type" }
            },
            "type": "object",
            "required": ["loc", "msg", "type"],
            "title": "ValidationError"
            }
        }
    }
}
```
````

---

## 特徴

- 先にrouter,modelを作ることでFEとの競合を抑える
- 既にある実装を再利用できるためオーバーヘッドが少ない
- OpenAPIの対応自体は数行の追加で可能
- modelの情報はFieldの引数に追加
- ymlを使う場合はPyYML等でparse

---

## B. レガシーシステムのAPIを整理して再定義し直す刷新案件

<br/>

### 技術スタック

| 分野 | 言語/FW |
| ---- | ------- |
| FE   | Nuxt    |
| BE   | Go      |

<br/>

### ポイント

- APIが果たすべき役割の本質はほとんど変わらない(粒度や切り口は変わる)
  - 機能廃止・縮小はある
- バックエンドはイチから構築し直す(現行コードの流用が困難であるケースを想定)
  - 現行の振る舞いを検証するため、<span v-mark="{ at: 1, color: 'rgba(221, 221, 0, 1)', type: 'circle' }">FEとの開発にタイムラグがある</span>

---

## Bへの提案： 開発フェーズの進度で優先比率を変える

<br/>

### 初期

1. TypeSpecで整理されたAPIを設計し、OpenAPI・IFを生成
2. FE,BEそれぞれでIFを利用して実装

<p v-drag="[596,125,332,54]" class="text-center font-bold" v-mark.red>構築や調査で実装までラグがあるうちは契約を優先する</p>

<br/>

### 中期

1. 以下の作業比率でAPI設計を進める
   - 新規APIの設計：70%
   - 既存Specの実装移行：30%

<p v-drag="[595,269,332,40]" class="text-center font-bold" v-mark.red>APIリリース安定後は実装を優先する</p>

<br/>

### 後期

Spec定義は全て廃止。実装優先にする

---

### イメージ

```mermaid {scale:0.6}
graph LR
    A[初期フェーズ] --> A_PRIORITY{優先度};

    subgraph 初期フェーズの作業
        A_PRIORITY -- 100% --> A1[**IF契約/設計**];
        A1 --> A2[TypeSpecでAPI設計/IF生成];
        A2 --> A3[IF利用実装（FE/BE）];
    end
```

```mermaid {scale:0.6}
graph LR
    A3[中期フェーズ] --> B_PRIORITY{優先度の比率};

        subgraph 中期フェーズの作業
            B_PRIORITY -- 70% --> B2[新規APIの実装/設計];
            B_PRIORITY -- 30% --> B3[既存Specの実装移行];
        end
```

```mermaid {scale:0.6}
graph LR
 B4[後期フェーズ] --> C1[**実装**];

    subgraph 後期フェーズの作業
        C1 --> C2[Spec定義を全て廃止];
        C2 --> C3[実装からスキーマ・型を生成]
    end
```

<div class="border-1px rounded-md pa-2" v-drag="[608,197,366,168]">
<h4>特徴</h4>
<ul class="text-md">
    <li>開発初期から初速が出やすい</li>
    <li>IF合意のための検証コストはかかる</li>
    <li>安定期以降メンテコストが抑えられる</li>
    <li>移行と新規設計の作業バランスに注意</li>
</ul>
</div>

---

### Appendix: OpenAPIからGoのIF生成

前提: Go@1.25.4, [oapi-codegen](https://github.com/oapi-codegen/oapi-codegen)を利用

````md magic-move {lines: true}
```json
//openapi.json
{
  "openapi": "3.0.0",
  "info": { "title": "サンプルAPI", "description": "サンプルのAPIです", "version": "1.0.0" },
  "paths": {
    "/example": {
      "get": {
        "summary": "Read Root",
        "operationId": "read_root_example_get",
        "requestBody": {
          "content": { "application/json": { "schema": { "$ref": "#/components/schemas/SampleRequest" } } },
          "required": true
        },
        "responses": {
          "200": {
            "description": "Successful Response",
            "content": { "application/json": { "schema": { "$ref": "#/components/schemas/SampleResponse" } } }
          },
          …
        }
      }
    }
  },
  …
}
```

```go
type SampleRequest struct {
	// Id サンプルAPIのID
	Id *string `json:"id,omitempty"`

	// Params サンプルAPIのパラメータ
	Params *SampleRequest_Params `json:"params"`
}

type SampleRequestParams0 = []string

// SampleRequest_Params サンプルAPIのパラメータ
type SampleRequest_Params struct {
	union json.RawMessage
}

type SampleResponse struct {
	CreatedAt time.Time `json:"created_at"`

	// Name IDに紐づく名称
	Name      *string   `json:"name,omitempty"`
	UpdatedAt time.Time `json:"updated_at"`
}
```
````

<p v-click.hide="1" v-drag="[253,135,493,49]"><u>oapi-codegenは現時点でOpenAPI3.1.0に完全対応していない</u></p>

---

## C. FE・BEどちらとも一人で面倒見る機能拡張案件

<br/>

### 技術スタック

| 分野 | 言語/FW |
| ---- | ------- |
| FE   | Nuxt    |
| BE   | Java    |

### ポイント

- 必ずしも個人開発でなく、feature別に割り振られるケースもある。
- 比較的開発サイクルは落ち着いている

---

## Cへの提案： 実装優先。

<br/>

### ただし担当機能APIが他で再利用される場合はIFクラスの実装を先行させる。

<br/>

１名で作業する場合、FE,BEのコンテキストを理解しているため

中間言語を用いたり合意形成のメリットが薄い。

一気に実装まで進めてしまった方が良い。

<br/>

ただし、実装するAPIを別featureで再利用したいケースもあるので関係者と確認しながらIF実装を先行させる。

---

## 特徴

- エンジニアは実装に注力できる
- コミュニケーション自体が少ない開発体制
- 他機能でも再利用するAPIは注意が必要
