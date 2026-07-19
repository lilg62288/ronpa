"""学校向け機能: 課題配布・生徒の発言記録のAI要約採点・先生への送信"""

import json
import random
import string
import time
from typing import Optional

from .debate import DEFAULT_LEVEL, MOCK_MODE, MODEL

if not MOCK_MODE:
    from .debate import _client

# インメモリ保存（MVP: 単一プロセス前提）
# code -> {theme, instructions, teacher_name, created_at, submissions: {出席番号: {...}}}
_assignments: dict[str, dict] = {}


def create_assignment(
    theme: str,
    instructions: str = "",
    teacher_name: str = "",
) -> dict:
    code = "".join(random.choices(string.digits, k=6))
    while code in _assignments:
        code = "".join(random.choices(string.digits, k=6))
    _assignments[code] = {
        "theme": theme,
        "instructions": instructions,
        "teacher_name": teacher_name,
        "created_at": time.time(),
        "submissions": {},
    }
    return {"code": code, "theme": theme, "instructions": instructions}


def get_assignment(code: str) -> Optional[dict]:
    a = _assignments.get(code)
    if not a:
        return None
    return {
        "code": code,
        "theme": a["theme"],
        "instructions": a["instructions"],
        "teacher_name": a["teacher_name"],
    }


_SCHOOL_JUDGE_PROMPT = """あなたは学校の授業でディベート・ディスカッションを指導する教育のプロです。

課題テーマ: {theme}
{instructions_block}

以下は、授業中のディベート/ディスカッションにおける出席番号{student_number}番の生徒の発言記録（音声認識による文字起こし）です。
この生徒の発言のみを対象に、次を行ってください。

1. summary: 発言内容の要約（先生が一目で把握できるよう、重要な主張・論点を3行以内で）
2. 4つの評価軸でそれぞれ10点満点の整数で採点
   - logic（論理性）: 主張と根拠のつながり、矛盾のなさ
   - persuasion（説得力）: 表現の明確さ、言葉選び
   - rebuttal（反論力）: 他者の意見への応答・反論の的確さ
   - structure（構成力）: 発言の組み立て、話の順序
3. good: 良かった点（生徒の成長を促す具体的な指摘）
4. improve: 改善点（次の授業で意識すべきことを具体的に）

音声認識の誤変換が含まれる可能性がありますが、文脈から意図を汲んでください。
発言が少ない場合は、その旨をsummaryに記載し、採点は発言内容の範囲で行ってください。

必ず次のJSON形式のみで出力してください:
{{"summary": "要約", "scores": {{"logic": 0, "persuasion": 0, "rebuttal": 0, "structure": 0}}, "good": "良かった点", "improve": "改善点"}}

発言記録:
{transcript}"""


def submit(
    code: str,
    student_number: int,
    transcript: str,
    student_name: str = "",
) -> Optional[dict]:
    a = _assignments.get(code)
    if not a:
        return None

    if MOCK_MODE:
        result = {
            "summary": "（モック要約）救急車の有料化に賛成の立場から、軽症利用の抑制と財源確保を主張。相手の「受診控え」への懸念には減免制度の存在を挙げて応答した。",
            "scores": {"logic": 7, "persuasion": 6, "rebuttal": 7, "structure": 6},
            "good": "（モック）根拠を挙げて主張する姿勢が身についています。相手の懸念に正面から応答できた点も良いです。",
            "improve": "（モック）主張の順序を「結論→理由→具体例」に整理すると、より伝わりやすくなります。",
        }
    else:
        instructions_block = (
            f"先生からの指示: {a['instructions']}" if a["instructions"] else ""
        )
        prompt = _SCHOOL_JUDGE_PROMPT.format(
            theme=a["theme"],
            instructions_block=instructions_block,
            student_number=student_number,
            transcript=transcript.strip() or "（発言記録なし）",
        )
        completion = _client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=800,
            temperature=0.3,
            response_format={"type": "json_object"},
        )
        result = json.loads(completion.choices[0].message.content or "{}")

    scores = result.get("scores", {})
    clamped = {
        k: max(0, min(10, int(scores.get(k, 0))))
        for k in ("logic", "persuasion", "rebuttal", "structure")
    }
    record = {
        "student_number": student_number,
        "student_name": student_name,
        "summary": result.get("summary", ""),
        "scores": clamped,
        "total": sum(clamped.values()),
        "good": result.get("good", ""),
        "improve": result.get("improve", ""),
        "transcript": transcript,
        "submitted_at": time.time(),
    }
    a["submissions"][str(student_number)] = record
    return record


def list_submissions(code: str) -> Optional[dict]:
    a = _assignments.get(code)
    if not a:
        return None
    subs = sorted(
        a["submissions"].values(), key=lambda s: s["student_number"]
    )
    return {
        "code": code,
        "theme": a["theme"],
        "instructions": a["instructions"],
        "count": len(subs),
        "submissions": subs,
    }
