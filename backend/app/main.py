"""RONPA バックエンドAPI (FastAPI)"""

import os
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from . import debate, school  # debateのimportでload_dotenvが走る

# 本番ではデプロイ先フロントのURLをカンマ区切りで指定（例: https://ronpa.vercel.app）
_origins = [
    o.strip()
    for o in os.getenv(
        "FRONTEND_ORIGINS", "http://localhost:3000,http://localhost:3001"
    ).split(",")
    if o.strip()
]

app = FastAPI(title="RONPA API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


class StartRequest(BaseModel):
    category: Optional[str] = None
    theme: Optional[str] = None
    user_side: str = "肯定"
    level: str = "normal"  # easy | normal | hard | oni
    language: str = "ja"  # ja | en


class MessageRequest(BaseModel):
    debate_id: str
    message: str = Field(min_length=1, max_length=2000)


class ScoreRequest(BaseModel):
    debate_id: str


@app.get("/api/health")
def health():
    return {"status": "ok", "mock": debate.MOCK_MODE}


@app.post("/api/debate/start")
def start(req: StartRequest):
    try:
        return debate.start_debate(
            req.category, req.theme, req.user_side, req.level, req.language
        )
    except Exception as e:  # OpenAI障害・残高不足など
        raise HTTPException(status_code=502, detail=f"対戦の開始に失敗しました: {e}")


@app.post("/api/debate/message")
def message(req: MessageRequest):
    if not debate.get_session(req.debate_id):
        raise HTTPException(status_code=404, detail="debate not found")
    try:
        return debate.reply_to(req.debate_id, req.message)
    except Exception as e:  # OpenAI障害など
        raise HTTPException(status_code=502, detail=f"AI応答の生成に失敗しました: {e}")


@app.post("/api/debate/score")
def score(req: ScoreRequest):
    if not debate.get_session(req.debate_id):
        raise HTTPException(status_code=404, detail="debate not found")
    try:
        return debate.score_debate(req.debate_id)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI採点に失敗しました: {e}")


# ---------- 学校向け ----------


class SchoolCreateRequest(BaseModel):
    theme: str = Field(min_length=1, max_length=200)
    instructions: str = Field(default="", max_length=1000)
    teacher_name: str = Field(default="", max_length=50)


class SchoolSubmitRequest(BaseModel):
    code: str = Field(min_length=6, max_length=6)
    student_number: int = Field(ge=1, le=999)
    student_name: str = Field(default="", max_length=50)
    transcript: str = Field(max_length=50000)
    language: str = "ja"  # ja | en


@app.post("/api/school/assignments")
def school_create(req: SchoolCreateRequest):
    return school.create_assignment(req.theme, req.instructions, req.teacher_name)


@app.get("/api/school/assignments/{code}")
def school_get(code: str):
    a = school.get_assignment(code)
    if not a:
        raise HTTPException(status_code=404, detail="課題が見つかりません。コードを確認してください")
    return a


@app.post("/api/school/submissions")
def school_submit(req: SchoolSubmitRequest):
    try:
        record = school.submit(
            req.code,
            req.student_number,
            req.transcript,
            req.student_name,
            req.language,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI採点に失敗しました: {e}")
    if record is None:
        raise HTTPException(status_code=404, detail="課題が見つかりません")
    return record


@app.get("/api/school/assignments/{code}/submissions")
def school_list(code: str):
    result = school.list_submissions(code)
    if result is None:
        raise HTTPException(status_code=404, detail="課題が見つかりません")
    return result
