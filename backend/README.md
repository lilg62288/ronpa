# RONPA Backend (FastAPI)

AI対戦・AI採点API（Phase 1 MVP）。GPT-4oと1対1のテキストディベートを行い、
設計書の4軸（論理性・説得力・反論力・構成力）で採点する。

## セットアップ

```bash
cd backend
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
cp .env.example .env   # OPENAI_API_KEY を設定
```

`OPENAI_API_KEY` が未設定の場合はモックモードで起動する（canned応答）。

## 起動

```bash
./venv/bin/uvicorn app.main:app --reload --port 8000
```

## エンドポイント

| Method | Path | 説明 |
|---|---|---|
| GET | `/api/health` | ヘルスチェック（`mock: true/false`） |
| POST | `/api/debate/start` | 対戦開始。`{category?, theme?, user_side?}` → `{debate_id, theme, ...}` |
| POST | `/api/debate/message` | ユーザー発言を送りAIの反論を得る。`{debate_id, message}` |
| POST | `/api/debate/score` | 対戦ログを4軸採点。`{debate_id}` → `{scores, total, good, improve, summary, winner}` |

セッションはインメモリ保存（MVP）。プロセス再起動で消える。
