from fastapi import FastAPI
from fastapi.openapi.utils import get_openapi
from pydantic import BaseModel, Field
from datetime import datetime

app = FastAPI(
    title=settings.APP_NAME,
    openapi_url="/api/v1/openapi.json"
)
…

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    app.openapi_schema = get_openapi(
        title=settings.APP_NAME,
        version="1.0.0",
        description="サンプルAPI",
        routes=app.routes,
        openapi_version="3.1.0",
    )
    return app.openapi_schema

app.openapi = custom_openapi

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