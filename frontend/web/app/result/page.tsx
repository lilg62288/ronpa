import Link from "next/link";
import { RadarChart } from "@/components/RadarChart";
import { CrownIcon, LockIcon } from "@/components/icons";
import { scoreResult } from "@/lib/mock";

export default function ResultPage() {
  const { theme, side, total, axes, good, improve, summary } = scoreResult;
  return (
    <main className="px-5 pb-10 pt-8">
      <p className="text-center text-[10px] font-bold tracking-[0.25em] text-ink-3">
        AI JUDGE RESULT
      </p>
      <h1 className="mt-1 text-center text-xl font-black">採点結果</h1>
      <p className="mt-2 text-center text-xs text-ink-2">{theme}</p>

      {/* 勝敗 */}
      <div className="mt-5 flex items-center justify-center gap-2">
        <span className="flex items-center gap-1.5 rounded-full bg-accent-soft px-4 py-1.5 text-sm font-black text-accent">
          <CrownIcon className="h-4 w-4" />
          {side}の勝利
        </span>
      </div>

      {/* 総合スコア */}
      <div className="mt-6 text-center">
        <p className="text-[11px] font-bold text-ink-3">総合スコア</p>
        <p className="mt-1 text-6xl font-black tabular-nums">
          {total}
          <span className="text-xl font-bold text-ink-3"> / 40</span>
        </p>
      </div>

      {/* レーダーチャート */}
      <div className="mt-6 rounded-2xl border border-line bg-surface p-5">
        <RadarChart axes={axes} />
        <div className="mt-2 grid grid-cols-2 gap-2">
          {axes.map(({ label, score }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-xl bg-bg px-3.5 py-2.5"
            >
              <span className="text-xs font-bold text-ink-2">{label}</span>
              <span className="text-sm font-black">
                {score}
                <span className="text-[10px] font-bold text-ink-3">/10</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AIフィードバック */}
      <section className="mt-5 flex flex-col gap-3">
        <div className="rounded-2xl border border-green/30 bg-green-soft p-4">
          <p className="text-xs font-black text-green">良かった点</p>
          <p className="mt-2 text-xs leading-relaxed text-ink-2">{good}</p>
        </div>
        <div className="rounded-2xl border border-accent/30 bg-accent-soft p-4">
          <p className="text-xs font-black text-accent">改善点</p>
          <p className="mt-2 text-xs leading-relaxed text-ink-2">{improve}</p>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-4">
          <p className="text-xs font-black text-ink">総評</p>
          <p className="mt-2 text-xs leading-relaxed text-ink-2">{summary}</p>
        </div>
      </section>

      {/* Premium誘導 */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl border border-gold/40 bg-gold-soft p-4">
        <LockIcon className="h-5 w-5 shrink-0 text-gold" />
        <p className="flex-1 text-[11px] leading-relaxed text-ink-2">
          <span className="font-black text-gold">Premium</span>
          なら、フェーズ別の詳細レポートと改善提案・全文文字起こしが見られます
        </p>
        <button className="shrink-0 rounded-full bg-gold px-3.5 py-1.5 text-[11px] font-black text-bg">
          詳細
        </button>
      </div>

      {/* アクション */}
      <div className="mt-6 flex flex-col gap-3">
        <Link
          href="/battle"
          className="rounded-2xl bg-accent py-4 text-center text-sm font-black text-white shadow-lg shadow-accent/25"
        >
          もう一度対戦する
        </Link>
        <Link
          href="/home"
          className="rounded-2xl border border-line bg-surface py-4 text-center text-sm font-bold text-ink"
        >
          ホームへ戻る
        </Link>
      </div>
    </main>
  );
}
