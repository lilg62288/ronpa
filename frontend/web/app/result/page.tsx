import Link from "next/link";
import { RadarChart } from "@/components/RadarChart";
import { CrownIcon, LockIcon } from "@/components/icons";
import { scoreResult } from "@/lib/mock";

export default function ResultPage() {
  const { theme, side, total, axes, good, improve, summary } = scoreResult;
  return (
    <main className="px-4 pb-10 pt-8">
      <p className="font-display text-center text-[10px] font-medium tracking-[0.4em] text-cyan/70">
        AI JUDGE RESULT
      </p>
      <h1 className="mt-1.5 text-center text-lg font-bold">採点結果</h1>
      <p className="mt-2 text-center text-xs text-ink-2">{theme}</p>

      {/* 勝敗 */}
      <div className="mt-4 flex items-center justify-center">
        <span className="flex items-center gap-1.5 rounded-full border border-green/40 bg-green-soft px-4 py-1.5 text-sm font-bold text-green">
          <CrownIcon className="h-4 w-4" />
          {side}の勝利
        </span>
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
          href="/battle"
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
