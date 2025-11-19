## サンプルコードの実行方法

## 前提

Python >=3.10

## 手順

1. venvを構築

```
python3 -m venv .venv
```

2. 以下コマンドを実行

```
pip install -r requirements.txt
```

3. uvicornを起動

```
uvicorn sample:app --reload
```

## OpenAPI定義の出力方法

手順通りに起動後、以下コマンドを実行

```
curl http://127.0.0.1:8000/api/v1/openapi.json > openapi.json
```
