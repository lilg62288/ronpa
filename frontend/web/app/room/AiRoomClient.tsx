"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { XIcon } from "@/components/icons";
import {
  RESULT_STORAGE_KEY,
  scoreDebate,
  sendDebateMessage,
  startDebate,
  type DebateLevel,
  type DebateSide,
  type DebateStart,
} from "@/lib/api";

type ChatMessage = { role: "user" | "ai"; content: string };

const LEVELS: {
  key: DebateLevel;
  en: string;
  label: string;
  desc: string;
  cardClass: string;
  chipClass: string;
}[] = [
  {
    key: "easy",
    en: "EASY",
    label: "簡単",
    desc: "肩慣らし。AIは優しく議論に付き合い、反論の余地を残してくれる。",
    cardClass: "border-green/40 hover:border-green",
    chipClass: "border-green/40 bg-green-soft text-green",
  },
  {
    key: "normal",
    en: "NORMAL",
    label: "普通",
    desc: "標準レベル。根拠のある反論が正面から返ってくる。",
    cardClass: "border-cyan/40 hover:border-cyan",
    chipClass: "border-cyan/40 bg-cyan-soft text-cyan",
  },
  {
    key: "hard",
    en: "HARD",
    label: "難しい",
    desc: "全国大会レベル。論理の飛躍や根拠の曖昧さを複数論点で執拗に突かれる。",
    cardClass: "border-gold/40 hover:border-gold",
    chipClass: "border-gold/40 bg-gold-soft text-gold",
  },
  {
    key: "oni",
    en: "ONI",
    label: "鬼",
    desc: "無敗の論破王。全ての穴を突かれ、再反論も先回りで潰される。覚悟せよ。",
    cardClass: "border-accent/40 hover:border-accent",
    chipClass: "border-accent/40 bg-accent-soft text-accent",
  },
];

function isLevel(v: string | undefined): v is DebateLevel {
  return !!v && LEVELS.some((l) => l.key === v);
}

function initialSideOf(v: string | undefined): DebateSide | null {
  if (v === "aff") return "肯定";
  if (v === "neg") return "否定";
  if (v === "random") return Math.random() < 0.5 ? "肯定" : "否定";
  return null;
}

export function AiRoomClient({
  initialLevel,
  initialSide,
}: {
  initialLevel?: string;
  initialSide?: string;
}) {
  const router = useRouter();
  const [level, setLevel] = useState<DebateLevel | null>(
    isLevel(initialLevel) ? initialLevel : null,
  );
  const [side, setSide] = useState<DebateSide | null>(() =>
    initialSideOf(initialSide),
  );
  const [spinning, setSpinning] = useState(false);
  const [spinFace, setSpinFace] = useState<DebateSide | null>(null);
  const [session, setSession] = useState<DebateStart | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // レベル・立場が決まったら対戦開始
  useEffect(() => {
    if (!level || !side) return;
    let cancelled = false;
    setError("");
    startDebate(level, side)
      .then((s) => {
        if (cancelled) return;
        setSession(s);
        setMessages([{ role: "ai", content: s.opening }]);
      })
      .catch((e) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [level, side]);

  // ルーレット: 肯定/否定を高速で切り替えてから確定
  const spinRoulette = () => {
    if (spinning) return;
    setSpinning(true);
    let count = 0;
    const iv = setInterval(() => {
      count++;
      setSpinFace((f) => (f === "肯定" ? "否定" : "肯定"));
      if (count >= 16) {
        clearInterval(iv);
        const final: DebateSide = Math.random() < 0.5 ? "肯定" : "否定";
        setSpinFace(final);
        setTimeout(() => setSide(final), 700);
      }
    }, 90);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = async () => {
    const text = input.trim();
    if (!text || !session || thinking) return;
    setInput("");
    setError("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setThinking(true);
    try {
      const res = await sendDebateMessage(session.debate_id, text);
      setMessages((m) => [...m, { role: "ai", content: res.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "送信に失敗しました");
    } finally {
      setThinking(false);
    }
  };

  const finish = async () => {
    if (!session || scoring) return;
    setError("");
    setScoring(true);
    try {
      const result = await scoreDebate(session.debate_id);
      sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
      router.push("/result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "採点に失敗しました");
      setScoring(false);
    }
  };

  const userTurns = messages.filter((m) => m.role === "user").length;
  const levelMeta = LEVELS.find((l) => l.key === level);

  // レベル選択画面
  if (!level) {
    return (
      <main className="flex min-h-dvh flex-col px-4 pt-6">
        <div className="flex items-center justify-between">
          <Link
            href="/battle"
            className="border border-line p-2 text-ink-3 hover:border-cyan/40"
          >
            <XIcon className="h-4 w-4" />
          </Link>
          <p className="text-[9px] font-medium tracking-[0.3em] text-cyan/70">
            AI DOJO / LEVEL SELECT
          </p>
          <span className="w-8" />
        </div>
        <h1 className="mt-6 text-center text-lg font-bold">相手のレベルを選択</h1>
        <p className="mt-1 text-center text-xs text-ink-3">
          AIの議論スタイルが変わります
        </p>
        <div className="mt-6 flex flex-col gap-3 pb-10">
          {LEVELS.map(({ key, en, label, desc, cardClass, chipClass }) => (
            <button
              key={key}
              onClick={() => setLevel(key)}
              className={`border bg-surface/80 p-4 text-left ${cardClass}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`clip-corner border px-3 py-1.5 font-display text-xs font-bold ${chipClass}`}
                >
                  {en}
                </span>
                <span className="text-base font-bold">{label}</span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-2">{desc}</p>
            </button>
          ))}
        </div>
      </main>
    );
  }

  // 立場選択画面（肯定 / 否定 / ルーレット）
  if (!side) {
    const faceOn = (s: DebateSide) => spinning && spinFace === s;
    return (
      <main className="flex min-h-dvh flex-col px-4 pt-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => !spinning && setLevel(null)}
            className="border border-line p-2 text-ink-3 hover:border-cyan/40"
          >
            <XIcon className="h-4 w-4" />
          </button>
          <p className="text-[9px] font-medium tracking-[0.3em] text-cyan/70">
            AI DOJO / SIDE SELECT
          </p>
          <span className="w-8" />
        </div>
        <h1 className="mt-6 text-center text-lg font-bold">立場を選択</h1>
        <p className="mt-1 text-center text-xs text-ink-3">
          肯定側が先攻で立論します。否定側を選ぶとAIが先に立論します
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            disabled={spinning}
            onClick={() => setSide("肯定")}
            className={`border bg-surface/80 p-5 text-center transition-colors hover:border-accent ${
              faceOn("肯定")
                ? "border-accent bg-accent-soft"
                : "border-accent/40"
            }`}
          >
            <p className="font-display text-[10px] tracking-[0.25em] text-accent">
              PRO
            </p>
            <p className="mt-1.5 text-xl font-bold text-accent">肯定側</p>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-2">
              先攻。あなたの立論から試合が始まる
            </p>
          </button>
          <button
            disabled={spinning}
            onClick={() => setSide("否定")}
            className={`border bg-surface/80 p-5 text-center transition-colors hover:border-blue ${
              faceOn("否定") ? "border-blue bg-blue-soft" : "border-blue/40"
            }`}
          >
            <p className="font-display text-[10px] tracking-[0.25em] text-blue">
              CON
            </p>
            <p className="mt-1.5 text-xl font-bold text-blue">否定側</p>
            <p className="mt-2 text-[11px] leading-relaxed text-ink-2">
              後攻。AIの立論への反駁から入る
            </p>
          </button>
        </div>
        <button
          disabled={spinning}
          onClick={spinRoulette}
          className="clip-corner mt-3 border border-gold/40 bg-gold-soft py-4 text-center text-sm font-bold text-gold hover:border-gold disabled:opacity-70"
        >
          {spinning ? "運命が決めています…" : "🎲 ルーレットで決める"}
        </button>
        <p className="mt-3 text-center text-[9px] tracking-widest text-ink-3">
          {spinning && spinFace
            ? `>>> ${spinFace}側 <<<`
            : "本番のグループ戦ではランダムに振り分けられます"}
        </p>
      </main>
    );
  }

  return (
    <main className="flex h-dvh flex-col">
      {/* ヘッダー */}
      <header className="border-b border-line bg-surface/90 px-4 pb-3 pt-4">
        <div className="flex items-center justify-between">
          <Link
            href="/battle"
            className="border border-line p-2 text-ink-3 hover:border-cyan/40"
          >
            <XIcon className="h-4 w-4" />
          </Link>
          <p className="text-[9px] font-medium tracking-[0.3em] text-cyan/70">
            AI DOJO / TEXT BATTLE
          </p>
          <button
            onClick={finish}
            disabled={scoring || userTurns === 0}
            className="clip-corner border border-gold/40 bg-gold-soft px-3 py-1.5 text-[10px] font-bold text-gold disabled:opacity-40"
          >
            {scoring ? "採点中…" : "終了して採点"}
          </button>
        </div>
        <p className="mt-3 text-center text-sm font-bold leading-snug">
          {session ? session.theme : "テーマを選定中…"}
        </p>
        <div className="mt-1.5 flex items-center justify-center gap-2 text-[10px] text-ink-3">
          {levelMeta && (
            <span
              className={`rounded-full border px-2 py-0.5 font-bold ${levelMeta.chipClass}`}
            >
              {levelMeta.label}
            </span>
          )}
          {session && (
            <span>
              あなた:{" "}
              <span className="font-bold text-accent">
                {session.user_side}側
              </span>
              {"　"}RONPA AI:{" "}
              <span className="font-bold text-blue">{session.ai_side}側</span>
            </span>
          )}
        </div>
      </header>

      {/* チャットログ */}
      <section className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) =>
          m.role === "ai" ? (
            <div key={i} className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-blue bg-surface-2 text-[10px] font-bold">
                AI
              </span>
              <div className="max-w-[80%] border border-line bg-surface/90 px-3.5 py-2.5 text-[13px] leading-relaxed text-ink">
                {m.content}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] border border-cyan/30 bg-cyan-soft px-3.5 py-2.5 text-[13px] leading-relaxed text-ink">
                {m.content}
              </div>
            </div>
          ),
        )}
        {thinking && (
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-blue bg-surface-2 text-[10px] font-bold">
              AI
            </span>
            <span className="animate-pulse text-xs text-ink-3">
              反論を構築中…
            </span>
          </div>
        )}
        {error && (
          <p className="border border-accent/40 bg-accent-soft px-3.5 py-2.5 text-xs text-accent">
            {error}
          </p>
        )}
        {scoring && (
          <p className="animate-pulse border border-cyan/30 bg-cyan-soft px-3.5 py-2.5 text-center text-xs font-bold text-cyan">
            AIが対戦ログを4軸で解析中…
          </p>
        )}
        <div ref={bottomRef} />
      </section>

      {/* 入力欄 */}
      <footer className="border-t border-line bg-surface/90 px-4 pb-6 pt-3">
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder={
              session ? "主張・反論を入力（Enterで送信）" : "接続中…"
            }
            disabled={!session || scoring}
            className="min-h-[3rem] flex-1 resize-none border border-line bg-bg p-3 text-sm text-ink placeholder:text-ink-3 focus:border-cyan/60 focus:outline-none disabled:opacity-50"
          />
          <button
            onClick={send}
            disabled={!session || thinking || !input.trim() || scoring}
            className="clip-corner glow-cyan h-12 shrink-0 bg-cyan px-5 text-sm font-bold text-[#02131a] hover:bg-primary-hover disabled:opacity-40 disabled:shadow-none"
          >
            送信
          </button>
        </div>
        <p className="mt-2 text-center text-[9px] tracking-widest text-ink-3">
          発言 {userTurns} 回 — 3回以上の応酬で採点精度が上がります
        </p>
      </footer>
    </main>
  );
}
