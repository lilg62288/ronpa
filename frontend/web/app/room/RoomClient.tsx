"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MicIcon,
  MicOffIcon,
  NoteIcon,
  SkipIcon,
  XIcon,
} from "@/components/icons";

type Side = "affirmative" | "negative" | "team" | "none" | "ai";

const phases: { label: string; step: number; side: Side; dur: number }[] = [
  { label: "準備", step: 0, side: "none", dur: 60 },
  { label: "立論・肯定側", step: 1, side: "affirmative", dur: 120 },
  { label: "立論・否定側", step: 1, side: "negative", dur: 120 },
  { label: "作戦タイム", step: 2, side: "team", dur: 60 },
  { label: "反駁・肯定側", step: 3, side: "affirmative", dur: 120 },
  { label: "反駁・否定側", step: 3, side: "negative", dur: 120 },
  { label: "最終弁論・肯定側", step: 4, side: "affirmative", dur: 60 },
  { label: "最終弁論・否定側", step: 4, side: "negative", dur: 60 },
  { label: "AI採点", step: 5, side: "ai", dur: 30 },
];

const steps = ["準備", "立論", "作戦", "反駁", "最終弁論", "採点"];

const reactionEmojis = ["👏", "🔥", "🤔", "💡"];

type Player = { name: string; you?: boolean; bot?: boolean };

function Avatar({
  player,
  speaking,
  color,
}: {
  player: Player;
  speaking: boolean;
  color: "accent" | "blue" | "gold";
}) {
  const ring = {
    accent: "border-accent",
    blue: "border-blue",
    gold: "border-gold",
  }[color];
  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-full border-2 bg-surface-2 text-lg font-black ${ring} ${
          speaking ? (color === "blue" ? "speaking-blue" : "speaking") : ""
        }`}
      >
        {player.bot ? "AI" : player.name[0]}
      </span>
      <span className="max-w-16 truncate text-[10px] font-bold text-ink-2">
        {player.you ? "あなた" : player.name}
      </span>
      {speaking && (
        <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[9px] font-bold text-ink-2">
          発話中
        </span>
      )}
    </div>
  );
}

export function RoomClient({ mode }: { mode: "ai" | "group" }) {
  const router = useRouter();
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [remaining, setRemaining] = useState(phases[0].dur);
  const [micOn, setMicOn] = useState(true);
  const [memoOpen, setMemoOpen] = useState(false);
  const [memo, setMemo] = useState("");
  const [floats, setFloats] = useState<{ id: number; emoji: string }[]>([]);

  const phase = phases[phaseIdx];
  const isLast = phaseIdx === phases.length - 1;

  useEffect(() => {
    const timer = setInterval(() => setRemaining((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (remaining > 0) return;
    if (phaseIdx >= phases.length - 1) {
      router.push("/result");
      return;
    }
    setPhaseIdx(phaseIdx + 1);
    setRemaining(phases[phaseIdx + 1].dur);
  }, [remaining, phaseIdx, router]);

  const skip = () => {
    if (isLast) {
      router.push("/result");
      return;
    }
    setPhaseIdx(phaseIdx + 1);
    setRemaining(phases[phaseIdx + 1].dur);
  };

  const react = (emoji: string) => {
    const id = Date.now() + Math.random();
    setFloats((f) => [...f, { id, emoji }]);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 1400);
  };

  const affirmative: Player[] =
    mode === "ai"
      ? [{ name: "イッキ", you: true }]
      : [{ name: "イッキ", you: true }, { name: "ミサキ" }];
  const negative: Player[] =
    mode === "ai"
      ? [{ name: "RONPA AI", bot: true }]
      : [{ name: "ケンタ" }, { name: "ユウタ" }];

  const shown = Math.max(0, remaining);
  const mm = String(Math.floor(shown / 60)).padStart(2, "0");
  const ss = String(shown % 60).padStart(2, "0");
  const progress = (shown / phase.dur) * 100;

  return (
    <main className="flex h-dvh flex-col">
      {/* 上部: テーマ・タイマー・フェーズ */}
      <header className="border-b border-line bg-surface px-5 pb-4 pt-4">
        <div className="flex items-center justify-between">
          <Link
            href="/battle"
            className="rounded-full border border-line p-2 text-ink-3"
          >
            <XIcon className="h-4 w-4" />
          </Link>
          <span className="rounded-md bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent">
            時事
          </span>
          <button
            onClick={skip}
            className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[10px] font-bold text-ink-3"
          >
            <SkipIcon className="h-3 w-3" />
            スキップ
          </button>
        </div>
        <p className="mt-3 text-center text-sm font-black leading-snug">
          日本は救急車を有料化すべきか
        </p>
        <p className="mt-2 text-center font-mono text-4xl font-black tabular-nums">
          {mm}:{ss}
        </p>
        <p className="mt-1 text-center text-xs font-bold text-accent">
          {phase.label}
        </p>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full bg-accent transition-all duration-1000 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* フェーズステッパー */}
        <div className="mt-3 flex justify-between gap-1">
          {steps.map((step, i) => (
            <span
              key={step}
              className={`flex-1 rounded-md py-1 text-center text-[9px] font-bold ${
                i === phase.step
                  ? "bg-accent text-white"
                  : i < phase.step
                    ? "bg-surface-2 text-ink-3 line-through"
                    : "bg-surface-2 text-ink-3"
              }`}
            >
              {step}
            </span>
          ))}
        </div>
      </header>

      {/* 中央: チーム・アバター */}
      <section className="flex flex-1 flex-col justify-center gap-6 overflow-y-auto px-5 py-6">
        {phase.side === "team" && (
          <div className="rounded-xl border border-gold/40 bg-gold-soft px-4 py-2.5 text-center text-[11px] font-bold text-gold">
            作戦タイム中 — チーム内通話のみ可能です
          </div>
        )}
        {phase.side === "ai" && (
          <div className="rounded-xl border border-line bg-surface px-4 py-2.5 text-center text-[11px] font-bold text-ink-2">
            AIが対戦ログを解析中…
          </div>
        )}
        <div>
          <p className="mb-3 text-center text-[11px] font-black tracking-widest text-accent">
            肯定側
          </p>
          <div className="flex justify-center gap-6">
            {affirmative.map((p, i) => (
              <Avatar
                key={p.name}
                player={p}
                color="accent"
                speaking={phase.side === "affirmative" && i === 0}
              />
            ))}
          </div>
        </div>
        <p className="text-center text-xs font-black tracking-[0.3em] text-ink-3">
          VS
        </p>
        <div>
          <div className="flex justify-center gap-6">
            {negative.map((p, i) => (
              <Avatar
                key={p.name}
                player={p}
                color="blue"
                speaking={phase.side === "negative" && i === 0}
              />
            ))}
          </div>
          <p className="mt-3 text-center text-[11px] font-black tracking-widest text-blue">
            否定側
          </p>
        </div>
        {mode === "group" && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-[10px] font-bold text-ink-3">ジャッジ:</span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-gold bg-surface-2 text-[10px] font-black">
              ア
            </span>
            <span className="text-[10px] text-ink-2">アオイ</span>
          </div>
        )}
        {isLast && (
          <button
            onClick={() => router.push("/result")}
            className="mx-auto rounded-2xl bg-accent px-8 py-3.5 text-sm font-black text-white shadow-lg shadow-accent/25"
          >
            採点結果を見る
          </button>
        )}
      </section>

      {/* 下部: マイク・メモ・リアクション */}
      <footer className="relative border-t border-line bg-surface px-5 pb-6 pt-3">
        {/* リアクションの浮遊表示 */}
        <div className="pointer-events-none absolute -top-14 right-8">
          {floats.map(({ id, emoji }) => (
            <span
              key={id}
              className="reaction-float absolute right-0 text-2xl"
            >
              {emoji}
            </span>
          ))}
        </div>
        <div className="flex justify-center gap-2">
          {reactionEmojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => react(emoji)}
              className="rounded-full bg-surface-2 px-3.5 py-1.5 text-base active:scale-110"
            >
              {emoji}
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-8">
          <button
            onClick={() => setMemoOpen(true)}
            className="flex flex-col items-center gap-1 text-ink-2"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2">
              <NoteIcon className="h-5 w-5" />
            </span>
            <span className="text-[9px] font-bold">メモ</span>
          </button>
          <button
            onClick={() => setMicOn(!micOn)}
            className="flex flex-col items-center gap-1"
          >
            <span
              className={`flex h-16 w-16 items-center justify-center rounded-full ${
                micOn
                  ? "bg-accent text-white shadow-lg shadow-accent/30"
                  : "bg-surface-2 text-ink-3"
              }`}
            >
              {micOn ? (
                <MicIcon className="h-7 w-7" />
              ) : (
                <MicOffIcon className="h-7 w-7" />
              )}
            </span>
            <span
              className={`text-[9px] font-bold ${micOn ? "text-accent" : "text-ink-3"}`}
            >
              {micOn ? "マイクON" : "ミュート中"}
            </span>
          </button>
          <Link
            href="/home"
            className="flex flex-col items-center gap-1 text-ink-2"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2">
              <XIcon className="h-5 w-5" />
            </span>
            <span className="text-[9px] font-bold">退出</span>
          </Link>
        </div>
      </footer>

      {/* メモシート */}
      {memoOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60"
          onClick={() => setMemoOpen(false)}
        >
          <div
            className="absolute bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 rounded-t-3xl border-t border-line bg-surface p-5 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto h-1 w-10 rounded-full bg-surface-2" />
            <p className="mt-4 text-sm font-black">メモ</p>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="相手の主張の弱点、反駁の要点などをメモ…"
              className="mt-3 h-40 w-full resize-none rounded-xl border border-line bg-bg p-3 text-sm text-ink placeholder:text-ink-3 focus:border-accent focus:outline-none"
            />
            <button
              onClick={() => setMemoOpen(false)}
              className="mt-3 w-full rounded-xl bg-surface-2 py-3 text-sm font-bold text-ink"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
