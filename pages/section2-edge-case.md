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
  bar: Record<string, never>
  bar2: Record<string, never>
  bar3: Record<string, never>
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
  - '@typespec/openapi3'
options:
  '@typespec/openapi3':
    emitter-output-dir: '{cwd}/schemas'
    openapi-versions:
      - 3.0.0
```

<p class="text-xs" v-drag="[68,463,631,56]">
https://typespec.io/docs/getting-started/typespec-for-openapi-dev/#additionalpropertiesunevaluatedproperties
</p>
