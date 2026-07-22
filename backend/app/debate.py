"""ディベート対戦・AI採点のコアロジック（GPT-4o連携）"""

import json
import os
import random
import uuid
from typing import Optional

from dotenv import load_dotenv

load_dotenv()

_raw_key = os.getenv("OPENAI_API_KEY", "")
# プレースホルダ（"ここにキーを..." 等の非ASCII文字や短すぎる値）は未設定として扱う
OPENAI_API_KEY = _raw_key if _raw_key.isascii() and len(_raw_key) > 20 else ""
MOCK_MODE = not OPENAI_API_KEY

if not MOCK_MODE:
    from openai import OpenAI

    _client = OpenAI(api_key=OPENAI_API_KEY)

MODEL = "gpt-4o"

# テーマバンク（設計書: 就活/時事/ビジネス/学術）
THEME_BANK: dict[str, list[str]] = {
    "就活": [
        "新卒一括採用は廃止すべきか",
        "就職活動でのAI面接導入は拡大すべきか",
        "大学の成績は採用選考で重視されるべきか",
    ],
    "時事": [
        "日本は救急車を有料化すべきか",
        "レジ袋の有料化は継続すべきか",
        "選挙のインターネット投票を導入すべきか",
    ],
    "ビジネス": [
        "リモートワークを標準とすべきか",
        "副業は全面解禁すべきか",
        "週休3日制を導入すべきか",
    ],
    "学術": [
        "AIに著作権を認めるべきか",
        "小学校からのプログラミング教育は必修であるべきか",
        "動物実験は原則禁止すべきか",
    ],
}

# 英語モード用テーマバンク
THEME_BANK_EN: dict[str, list[str]] = {
    "Careers": [
        "Should companies abolish simultaneous mass hiring of new graduates?",
        "Should AI-based interviews be expanded in recruiting?",
        "Should university grades matter more in hiring decisions?",
    ],
    "Current Affairs": [
        "Should ambulance services charge a fee?",
        "Should single-use plastic bag fees be continued?",
        "Should online voting be introduced in national elections?",
    ],
    "Business": [
        "Should remote work become the standard?",
        "Should side jobs be fully liberalized?",
        "Should companies adopt a four-day workweek?",
    ],
    "Academia": [
        "Should AI-generated works be granted copyright?",
        "Should programming education be mandatory from elementary school?",
        "Should animal testing be banned in principle?",
    ],
}

# 難易度レベル定義
LEVELS: dict[str, dict] = {
    "easy": {
        "label": "簡単",
        "style": (
            "あなたは初心者に付き合う優しい練習相手です。"
            "反論は1論点ずつ、平易な言葉で2〜3文の短さで行ってください。"
            "ときどき、あえて根拠の弱い主張をして相手に反論のチャンスを残してください。"
            "相手の発言の良い点にも一言触れて、議論を続けやすい空気を作ってください。"
        ),
        "temperature": 0.9,
        "opening": "私が相手です。肩の力を抜いて、まずはあなたの意見を聞かせてください。",
        "style_en": (
            "You are a gentle practice partner for beginners. "
            "Rebut one point at a time, in plain language, within 2-3 sentences. "
            "Occasionally make deliberately weak arguments to leave openings for the opponent. "
            "Briefly acknowledge what the opponent did well to keep the discussion welcoming."
        ),
        "opening_en": "I'm your practice partner. Relax, and tell me your opinion first.",
    },
    "normal": {
        "label": "普通",
        "style": (
            "あなたは標準的な実力のディベーターです。"
            "データや事実などの根拠を挙げて論理的に反論し、"
            "相手の主張の弱点（根拠不足、論点のすり替え、矛盾）を1〜2点、具体的に突いてください。"
        ),
        "temperature": 0.8,
        "opening": "私が対戦相手です。まずはあなたの立論をどうぞ。根拠を添えて主張してください。",
        "style_en": (
            "You are a debater of average competitive skill. "
            "Rebut logically with data and facts, and point out 1-2 specific weaknesses "
            "in the opponent's argument (lack of evidence, shifting the point, contradictions)."
        ),
        "opening_en": "I'm your opponent. Please present your opening argument with supporting evidence.",
    },
    "hard": {
        "label": "難しい",
        "style": (
            "あなたは全国大会レベルの鋭いディベーターです。"
            "統計・事例・専門知識を積極的に引用し、"
            "相手の論理の飛躍・根拠不足・定義の曖昧さを複数論点で執拗に突いてください。"
            "相手の反論を予測して先回りする論陣を張ってください。"
        ),
        "temperature": 0.7,
        "opening": "始めましょう。立論をどうぞ。曖昧な根拠は全て突かせてもらいます。",
        "style_en": (
            "You are a sharp national-tournament-level debater. "
            "Actively cite statistics, cases, and expert knowledge, and relentlessly attack "
            "logical leaps, missing evidence, and vague definitions across multiple points. "
            "Anticipate the opponent's rebuttals and preempt them."
        ),
        "opening_en": "Let's begin. Present your argument — I will challenge every vague claim you make.",
    },
    "oni": {
        "label": "鬼",
        "style": (
            "あなたは無敗の論破王です。冷徹かつ完璧な論理で、"
            "相手の主張に含まれる全ての穴（前提の誤り、根拠の欠如、論理の飛躍、定義の曖昧さ、隠れた価値判断）を漏れなく列挙して突き崩してください。"
            "想定される再反論も先回りして潰し、答えにくい鋭い質問で追い詰めてください。"
            "一切妥協しないこと。ただし人格攻撃はせず、あくまで論理のみで圧倒してください。"
        ),
        "temperature": 0.6,
        "opening": "……始めますか。あなたの立論の一言一句、全てが採点対象だと思ってください。どうぞ。",
        "style_en": (
            "You are an undefeated debate champion. With cold, flawless logic, enumerate and "
            "dismantle every hole in the opponent's claims (false premises, missing evidence, "
            "logical leaps, vague definitions, hidden value judgments). "
            "Preempt and crush anticipated counterarguments, and corner the opponent with "
            "hard-to-answer questions. Never compromise — but never attack the person; "
            "overwhelm with logic alone."
        ),
        "opening_en": "...Shall we begin? Every single word of your argument will be scrutinized. Go ahead.",
    },
}

DEFAULT_LEVEL = "normal"

# インメモリのセッション保存（MVP: 単一プロセス前提）
_sessions: dict[str, dict] = {}

MAX_TURNS = 40  # 履歴の暴走防止


def start_debate(
    category: Optional[str] = None,
    theme: Optional[str] = None,
    user_side: str = "肯定",
    level: str = DEFAULT_LEVEL,
    language: str = "ja",
) -> dict:
    language = "en" if language == "en" else "ja"
    if not theme:
        bank = THEME_BANK_EN if language == "en" else THEME_BANK
        cat = category if category in bank else random.choice(list(bank))
        theme = random.choice(bank[cat])
        category = cat
    user_side = "肯定" if user_side != "否定" else "否定"
    ai_side = "否定" if user_side == "肯定" else "肯定"
    if level not in LEVELS:
        level = DEFAULT_LEVEL

    debate_id = uuid.uuid4().hex
    session = {
        "theme": theme,
        "category": category or "時事",
        "user_side": user_side,
        "ai_side": ai_side,
        "level": level,
        "language": language,
        "messages": [],  # [{"role": "user"|"ai", "content": str}]
    }
    _sessions[debate_id] = session

    # 肯定側が先攻。AIが肯定側なら、AIの立論から始める
    if ai_side == "肯定":
        argument = _first_argument(session)
        session["messages"].append({"role": "ai", "content": argument})
        if language == "en":
            opening = f"I will argue the Pro side. As the first speaker, here is my opening argument.\n\n{argument}"
        else:
            opening = f"私は肯定側を担当します。先攻として立論します。\n\n{argument}"
    elif language == "en":
        opening = f"I will argue the Con side. {LEVELS[level]['opening_en']}"
    else:
        opening = f"私は{ai_side}側を担当します。{LEVELS[level]['opening']}"

    return {
        "debate_id": debate_id,
        "theme": theme,
        "category": category,
        "user_side": user_side,
        "ai_side": ai_side,
        "level": level,
        "level_label": LEVELS[level]["label"],
        "language": language,
        "opening": opening,
    }


def _mock_first_argument(s: dict, en: bool) -> str:
    if en:
        return (
            f"(Demo) I affirm: \"{s['theme']}\". "
            "Three reasons: first, the social benefit is significant; second, it is cost-effective; "
            "third, it aligns with global trends. Your rebuttal, please."
        )
    return (
        f"（デモ応答）「{s['theme']}」に肯定側として賛成します。"
        "理由は3点。第一に社会的便益が大きいこと、第二に費用対効果が高いこと、"
        "第三に国際的な潮流に合致することです。反論をどうぞ。"
    )


def _first_argument(s: dict) -> str:
    """AIが先攻（肯定側）の場合の立論を生成する"""
    level = LEVELS.get(s.get("level", DEFAULT_LEVEL), LEVELS[DEFAULT_LEVEL])
    en = s.get("language") == "en"
    if MOCK_MODE:
        return _mock_first_argument(s, en)
    trigger = (
        "(Moderator) The debate begins. As the Pro side, please present your opening argument."
        if en
        else "（進行係）ディベートを開始します。肯定側のあなたから立論をどうぞ。"
    )
    try:
        completion = _client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": _opponent_system_prompt(s)},
                {"role": "user", "content": trigger},
            ],
            max_tokens=400,
            temperature=level["temperature"],
        )
        return (completion.choices[0].message.content or "").strip()
    except Exception as e:  # OpenAI残高不足・障害時はデモ応答にフォールバック
        print(f"[debate] OpenAI unavailable, using demo reply: {e}")
        return _mock_first_argument(s, en)


def get_session(debate_id: str) -> Optional[dict]:
    return _sessions.get(debate_id)


def _opponent_system_prompt(s: dict) -> str:
    level = LEVELS.get(s.get("level", DEFAULT_LEVEL), LEVELS[DEFAULT_LEVEL])
    if s.get("language") == "en":
        ai_side = "Pro" if s["ai_side"] == "肯定" else "Con"
        user_side = "Pro" if s["user_side"] == "肯定" else "Con"
        return (
            "You are an English-debate opponent.\n"
            f"Topic: {s['theme']}\n"
            f"You argue the {ai_side} side; your opponent (the user) argues the {user_side} side.\n"
            f"Debating style: {level['style_en']}\n"
            "Common rules:\n"
            "- Keep each reply within about 120 English words\n"
            "- Never abandon your assigned position\n"
            "- No personal attacks"
        )
    return (
        "あなたは日本語ディベートの対戦相手です。\n"
        f"テーマ: {s['theme']}\n"
        f"あなたは{s['ai_side']}側、相手（ユーザー）は{s['user_side']}側です。\n"
        f"議論スタイル: {level['style']}\n"
        "共通ルール:\n"
        "- 1回の発言は日本語で250字以内に収める\n"
        "- 自分の立場は絶対に曲げない\n"
        "- 人格攻撃はしない"
    )


def reply_to(debate_id: str, message: str) -> dict:
    s = _sessions[debate_id]
    en = s.get("language") == "en"
    if len(s["messages"]) >= MAX_TURNS:
        ended_msg = (
            "We have argued enough. Let's move on to the judging."
            if en
            else "議論は十分に尽くされました。採点に進みましょう。"
        )
        return {"reply": ended_msg, "ended": True}

    s["messages"].append({"role": "user", "content": message})

    level = LEVELS.get(s.get("level", DEFAULT_LEVEL), LEVELS[DEFAULT_LEVEL])
    if MOCK_MODE:
        reply = _mock_reply(s, en)
    else:
        try:
            history = [
                {"role": "assistant" if m["role"] == "ai" else "user", "content": m["content"]}
                for m in s["messages"]
            ]
            completion = _client.chat.completions.create(
                model=MODEL,
                messages=[{"role": "system", "content": _opponent_system_prompt(s)}, *history],
                max_tokens=400,
                temperature=level["temperature"],
            )
            reply = (completion.choices[0].message.content or "").strip()
        except Exception as e:  # OpenAI残高不足・障害時はデモ応答へ
            print(f"[debate] OpenAI unavailable, using demo reply: {e}")
            reply = _mock_reply(s, en)

    s["messages"].append({"role": "ai", "content": reply})
    return {"reply": reply, "ended": False}


def _mock_reply(s: dict, en: bool) -> str:
    mock_by_level = {
        "easy": "（デモ応答・簡単）なるほど、いい視点ですね。ただ、費用の面はどうでしょう？もう少し詳しく聞かせてください。",
        "normal": f"（デモ応答・普通）その主張には根拠が不足しています。{s['theme']}について、費用対効果の観点から反論します。具体的なデータを示していただけますか？",
        "hard": "（デモ応答・難しい）その論には3つの飛躍があります。第一に定義が曖昧、第二に因果と相関の混同、第三に反例の無視です。順に反証します。",
        "oni": "（デモ応答・鬼）前提から誤っています。あなたの主張は根拠・論理・定義の全てに穴があります。まず、その統計の出典と調査年を即答できますか？",
    }
    mock_by_level_en = {
        "easy": "(Demo/Easy) That's an interesting point! But what about the cost side? Tell me more.",
        "normal": f"(Demo/Normal) Your claim lacks evidence. Regarding \"{s['theme']}\", I rebut from a cost-effectiveness standpoint. Can you show concrete data?",
        "hard": "(Demo/Hard) Your argument makes three leaps: vague definitions, confusing correlation with causation, and ignoring counterexamples. I will refute each in turn.",
        "oni": "(Demo/Oni) Your premise itself is flawed. Every part of your claim — evidence, logic, definitions — has holes. First: can you instantly cite the source and year of that statistic?",
    }
    table = mock_by_level_en if en else mock_by_level
    return table[s.get("level", DEFAULT_LEVEL)]


_JUDGE_PROMPT = """あなたはプロのディベート審査員です。

テーマ: {theme}
ユーザーは{user_side}側、AIは{ai_side}側です。

以下の対戦ログを読み、**ユーザー（{user_side}側）の発言のみ**を対象に、次の4つの評価軸でそれぞれ10点満点の整数で採点してください。
- logic（論理性）: 主張に矛盾がないか、根拠（データや事実）に基づいているか、三段論法等の論理構造が成立しているか
- persuasion（説得力）: 表現の明確さ、聞き手の感情や納得感に訴えかける修辞技法、言葉選びの適切さ
- rebuttal（反論力）: 相手の主張の弱点を的確に突いているか、論点のすり替えを行わず正面から回答しているか
- structure（構成力）: 導入→本論→結論の構成が整っているか、発言量の配分が適切か

さらに、良かった点と改善点を具体的かつ辛口にフィードバックし、総評と勝敗判定を行ってください。

必ず次のJSON形式のみで出力してください:
{{"scores": {{"logic": 0, "persuasion": 0, "rebuttal": 0, "structure": 0}}, "good": "良かった点", "improve": "改善点", "summary": "総評", "winner": "user または ai"}}

対戦ログ:
{log}"""


_JUDGE_PROMPT_EN = """You are a professional debate judge.

Topic: {theme}
The user argues the {user_side} side; the AI argues the {ai_side} side.

Read the debate log below and, judging **only the user's ({user_side} side) statements**, score each of these four criteria as an integer out of 10.
- logic: consistency of claims, grounding in data/facts, sound logical structure
- persuasion: clarity of expression, rhetorical effectiveness, word choice
- rebuttal: precisely attacking the opponent's weaknesses, answering head-on without dodging
- structure: intro-body-conclusion organization, appropriate allocation of speech

Then give concrete, brutally honest feedback on strengths and areas to improve, an overall comment, and a win/loss verdict.
Write all feedback in English.

Respond ONLY in this JSON format:
{{"scores": {{"logic": 0, "persuasion": 0, "rebuttal": 0, "structure": 0}}, "good": "strengths", "improve": "areas to improve", "summary": "overall comment", "winner": "user or ai"}}

Debate log:
{log}"""


def _mock_score(en: bool) -> dict:
    if en:
        return {
            "scores": {"logic": 7, "persuasion": 6, "rebuttal": 8, "structure": 7},
            "good": "(Demo) Sharp counterarguments that answered the opponent's points head-on.",
            "improve": "(Demo) Claims lack numerical evidence. Restate your conclusion at the end.",
            "summary": "(Demo) Solid but missing a decisive blow. Strengthen your evidence base.",
            "winner": "user",
        }
    return {
        "scores": {"logic": 7, "persuasion": 6, "rebuttal": 8, "structure": 7},
        "good": "（デモ採点）反論の切り返しが的確で、相手の論点に正面から答えられていた。",
        "improve": "（デモ採点）数値根拠が不足しており、主張の裏付けが弱い。結論の再提示も忘れずに。",
        "summary": "（デモ採点）堅実だが決定打に欠ける。根拠の厚みが今後の課題。",
        "winner": "user",
    }


def score_debate(debate_id: str) -> dict:
    s = _sessions[debate_id]
    en = s.get("language") == "en"

    if MOCK_MODE:
        result = _mock_score(en)
    else:
        if en:
            side_en = {"肯定": "Pro", "否定": "Con"}
            log = "\n".join(
                f"[{side_en[s['user_side']] if m['role'] == 'user' else side_en[s['ai_side']]}"
                f"{' / User' if m['role'] == 'user' else ' / AI'}] {m['content']}"
                for m in s["messages"]
            )
            prompt = _JUDGE_PROMPT_EN.format(
                theme=s["theme"],
                user_side=side_en[s["user_side"]],
                ai_side=side_en[s["ai_side"]],
                log=log or "(no statements)",
            )
        else:
            log = "\n".join(
                f"[{s['user_side'] if m['role'] == 'user' else s['ai_side']}側"
                f"{'・ユーザー' if m['role'] == 'user' else '・AI'}] {m['content']}"
                for m in s["messages"]
            )
            prompt = _JUDGE_PROMPT.format(
                theme=s["theme"],
                user_side=s["user_side"],
                ai_side=s["ai_side"],
                log=log or "（発言なし）",
            )
        try:
            completion = _client.chat.completions.create(
                model=MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=800,
                temperature=0.3,
                response_format={"type": "json_object"},
            )
            result = json.loads(completion.choices[0].message.content or "{}")
        except Exception as e:  # OpenAI残高不足・障害時はデモ採点へ
            print(f"[debate] OpenAI unavailable, using demo score: {e}")
            result = _mock_score(en)

    scores = result.get("scores", {})
    clamped = {
        k: max(0, min(10, int(scores.get(k, 0))))
        for k in ("logic", "persuasion", "rebuttal", "structure")
    }
    level = s.get("level", DEFAULT_LEVEL)
    return {
        "theme": s["theme"],
        "user_side": s["user_side"],
        "level": level,
        "level_label": LEVELS[level]["label"],
        "language": s.get("language", "ja"),
        "scores": clamped,
        "total": sum(clamped.values()),
        "good": result.get("good", ""),
        "improve": result.get("improve", ""),
        "summary": result.get("summary", ""),
        "winner": result.get("winner", "ai"),
        "turns": len(s["messages"]),
    }


# ---------- 対人戦（人 vs 人）の採点 ----------

_VERSUS_PROMPT = """あなたはプロのディベート審査員です。以下のテーマで行われた「肯定側」対「否定側」のディベートを審査してください。

テーマ: {theme}

対戦ログ:
{log}

両者を次の4軸でそれぞれ10点満点の整数で採点し、勝者を判定してください。
- logic（論理性）, persuasion（説得力）, rebuttal（反論力）, structure（構成力）
それぞれに良かった点・改善点を具体的かつ辛口にフィードバックし、総評も述べてください。

必ず次のJSON形式のみで出力してください:
{{"winner": "肯定" または "否定", "affirmative": {{"scores": {{"logic": 0, "persuasion": 0, "rebuttal": 0, "structure": 0}}, "good": "良かった点", "improve": "改善点"}}, "negative": {{"scores": {{"logic": 0, "persuasion": 0, "rebuttal": 0, "structure": 0}}, "good": "良かった点", "improve": "改善点"}}, "comment": "総評"}}"""

_VERSUS_PROMPT_EN = """You are a professional debate judge. Judge the following Pro vs Con debate on this topic.

Topic: {theme}

Debate log:
{log}

Score both sides on four criteria (0-10 integers each): logic, persuasion, rebuttal, structure. Then decide the winner.
Give concrete, brutally honest strengths and improvements for each side, plus an overall comment. Write all feedback in English.

Respond ONLY in this JSON format:
{{"winner": "肯定" or "否定", "affirmative": {{"scores": {{"logic": 0, "persuasion": 0, "rebuttal": 0, "structure": 0}}, "good": "strengths", "improve": "to improve"}}, "negative": {{"scores": {{"logic": 0, "persuasion": 0, "rebuttal": 0, "structure": 0}}, "good": "strengths", "improve": "to improve"}}, "comment": "overall"}}"""


def _mock_versus(en: bool) -> dict:
    side = lambda g, i: {  # noqa: E731
        "scores": {"logic": 7, "persuasion": 7, "rebuttal": 7, "structure": 7},
        "good": g,
        "improve": i,
    }
    if en:
        return {
            "winner": "肯定",
            "affirmative": side(
                "(Demo) Clear structure and well-grounded claims.",
                "(Demo) Push harder on rebuttals to seal the win.",
            ),
            "negative": side(
                "(Demo) Sharp counterpoints that pressured the opponent.",
                "(Demo) Back your claims with more concrete evidence.",
            ),
            "comment": "(Demo) A close, high-quality debate. Both sides argued well.",
        }
    return {
        "winner": "肯定",
        "affirmative": side(
            "（デモ採点）構成が明確で、根拠を伴う主張ができていた。",
            "（デモ採点）反駁をもう一歩踏み込めれば勝ちを確実にできる。",
        ),
        "negative": side(
            "（デモ採点）相手を追い込む鋭い切り返しがあった。",
            "（デモ採点）主張の裏付けとなる具体的な根拠を増やしたい。",
        ),
        "comment": "（デモ採点）僅差の好勝負。両者とも論を尽くしていた。",
    }


def score_versus(theme: str, transcript: list, language: str = "ja") -> dict:
    en = language == "en"
    if MOCK_MODE:
        result = _mock_versus(en)
    else:
        log = "\n".join(
            f"[{m.get('side', '')}・{m.get('name', '')}] {m.get('text', '')}"
            for m in transcript
        ) or ("(no statements)" if en else "（発言なし）")
        prompt = (_VERSUS_PROMPT_EN if en else _VERSUS_PROMPT).format(
            theme=theme, log=log
        )
        try:
            completion = _client.chat.completions.create(
                model=MODEL,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=900,
                temperature=0.3,
                response_format={"type": "json_object"},
            )
            result = json.loads(completion.choices[0].message.content or "{}")
        except Exception as e:
            print(f"[versus] OpenAI unavailable, using demo score: {e}")
            result = _mock_versus(en)

    def _clean(side: dict) -> dict:
        sc = side.get("scores", {})
        clamped = {
            k: max(0, min(10, int(sc.get(k, 0))))
            for k in ("logic", "persuasion", "rebuttal", "structure")
        }
        return {
            "scores": clamped,
            "total": sum(clamped.values()),
            "good": side.get("good", ""),
            "improve": side.get("improve", ""),
        }

    return {
        "theme": theme,
        "language": language,
        "winner": result.get("winner", "肯定"),
        "affirmative": _clean(result.get("affirmative", {})),
        "negative": _clean(result.get("negative", {})),
        "comment": result.get("comment", ""),
    }
