"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RadarChart } from "@/components/RadarChart";
import { CrownIcon, LockIcon } from "@/components/icons";
import { RESULT_STORAGE_KEY, type DebateScore } from "@/lib/api";
import { scoreResult } from "@/lib/mock";

type View = {
  theme: string;
  sideLabel: string;
  levelLabel?: string;
  win: boolean;
  total: number;
  axes: { label: string; score: number }[];
  good: string;
  improve: string;
  summary: string;
  demo: boolean;
};

const mockView: View = {
  theme: scoreResult.theme,
  sideLabel: scoreResult.side,
  win: true,
  total: scoreResult.total,
  axes: scoreResult.axes,
  good: scoreResult.good,
  improve: scoreResult.improve,
  summary: scoreResult.summary,
  demo: true,
};

function toView(r: DebateScore): View {
  return {
    theme: r.theme,
    sideLabel: `${r.user_side}側`,
    levelLabel: r.level_label,
    win: r.winner === "user",
    total: r.total,
    axes: [
      { label: "論理性", score: r.scores.logic },
      { label: "説得力", score: r.scores.persuasion },
      { label: "反論力", score: r.scores.rebuttal },
      { label: "構成力", score: r.scores.structure },
    ],
    good: r.good,
    improve: r.improve,
    summary: r.summary,
    demo: false,
  };
}

export default function ResultPage() {
  const [view, setView] = useState<View | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(RESULT_STORAGE_KEY);
      setView(raw ? toView(JSON.parse(raw)) : mockView);
    } catch {
      setView(mockView);
    }
  }, []);

  if (!view) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <p className="animate-pulse text-xs tracking-[0.3em] text-ink-3">
          LOADING RESULT…
        </p>
      </main>
    );
  }

  const {
    theme,
    sideLabel,
    levelLabel,
    win,
    total,
    axes,
    good,
    improve,
    summary,
    demo,
  } = view;

  return (
    <main className="px-4 pb-10 pt-8">
      <p className="font-display text-center text-[10px] font-medium tracking-[0.4em] text-cyan/70">
        AI JUDGE RESULT
      </p>
      <h1 className="mt-1.5 text-center text-lg font-bold">採点結果</h1>
      <p className="mt-2 text-center text-xs text-ink-2">{theme}</p>
      {levelLabel && (
        <p className="mt-1.5 text-center text-[10px] text-ink-3">
          難易度:{" "}
          <span className="font-bold text-gold">{levelLabel}</span>
        </p>
      )}
      {demo && (
        <p className="mt-2 text-center text-[10px] tracking-widest text-ink-3">
          — サンプル表示（対戦データなし） —
        </p>
      )}

      {/* 勝敗 */}
      <div className="mt-4 flex items-center justify-center">
        {win ? (
          <span className="flex items-center gap-1.5 rounded-full border border-green/40 bg-green-soft px-4 py-1.5 text-sm font-bold text-green">
            <CrownIcon className="h-4 w-4" />
            WIN — あなた（{sideLabel}）の勝利
          </span>
        ) : (
          <span className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent-soft px-4 py-1.5 text-sm font-bold text-accent">
            LOSE — あなた（{sideLabel}）の敗北
          </span>
        )}
      </div>

      {/* 総合スコア */}
      <div className="mt-6 text-center">
        <p className="text-[9px] tracking-[0.3em] text-ink-3">
          TOTAL SCORE / 総合スコア
        </p>
        <p className="text-glow mt-2 font-display text-5xl font-bold tabular-nums text-ink">
          {total}
          <span className="text-lg font-medium text-ink-3"> / 40</span>
        </p>
      </div>

      {/* レーダーチャート */}
      <div className="mt-6 border border-line bg-surface/80 p-4">
        <RadarChart axes={axes} />
        <div className="mt-2 grid grid-cols-2 gap-2">
          {axes.map(({ label, score }) => (
            <div
              key={label}
              className="flex items-center justify-between border border-line bg-bg px-3 py-2"
            >
              <span className="text-xs text-ink-2">{label}</span>
              <span className="font-display text-sm font-bold text-cyan">
                {score}
                <span className="text-[10px] font-medium text-ink-3">/10</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AIフィードバック */}
      <section className="mt-4 flex flex-col gap-3">
        <div className="border border-green/40 bg-green-soft p-4">
          <p className="text-xs font-bold text-green">良かった点</p>
          <p className="mt-2 text-xs leading-relaxed text-ink-2">{good}</p>
        </div>
        <div className="border border-accent/40 bg-accent-soft p-4">
          <p className="text-xs font-bold text-accent">改善点</p>
          <p className="mt-2 text-xs leading-relaxed text-ink-2">{improve}</p>
        </div>
        <div className="border border-line bg-surface/80 p-4">
          <p className="text-xs font-bold text-ink">総評</p>
          <p className="mt-2 text-xs leading-relaxed text-ink-2">{summary}</p>
        </div>
      </section>

      {/* Premium誘導 */}
      <div className="mt-4 flex items-center gap-3 border border-gold/40 bg-gold-soft p-4">
        <LockIcon className="h-5 w-5 shrink-0 text-gold" />
        <p className="flex-1 text-[11px] leading-relaxed text-ink-2">
          <span className="font-bold text-gold">Premium</span>
          なら、フェーズ別の詳細レポートと改善提案・全文文字起こしが見られます
        </p>
        <button className="clip-corner shrink-0 border border-gold/40 px-3 py-1.5 text-[11px] font-bold text-gold hover:bg-gold-soft">
          詳細
        </button>
      </div>

      {/* アクション */}
      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/room?mode=ai"
          className="clip-corner glow-cyan bg-cyan py-3 text-center text-sm font-bold tracking-widest text-[#02131a] hover:bg-primary-hover"
        >
          もう一度対戦する
        </Link>
        <Link
          href="/home"
          className="clip-corner border border-cyan/30 bg-cyan-soft py-3 text-center text-sm font-bold tracking-widest text-cyan hover:border-cyan/60"
        >
          ホームへ戻る
        </Link>
      </div>
    </main>
  );
}
