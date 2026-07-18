"""RONPA バックエンドAPI (FastAPI)"""

from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from . import debate

app = FastAPI(title="RONPA API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class StartRequest(BaseModel):
    category: Optional[str] = None
    theme: Optional[str] = None
    user_side: str = "肯定"
    level: str = "normal"  # easy | normal | hard | oni


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
    return debate.start_debate(req.category, req.theme, req.user_side, req.level)


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
