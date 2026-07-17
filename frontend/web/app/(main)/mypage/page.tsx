import Link from "next/link";
import { ChevronRightIcon, CrownIcon } from "@/components/icons";
import { matchHistory } from "@/lib/mock";

const stats = [
  { label: "対戦数", value: "24" },
  { label: "勝利", value: "15" },
  { label: "勝率", value: "62%" },
];

const premiumFeatures = [
  "AI対戦が無制限",
  "AI採点の詳細レポート・改善提案",
  "グループルーム作成が無制限",
  "広告非表示・過去ログ無制限保存",
];

export default function MyPage() {
  return (
    <main className="px-4 pt-6">
      {/* プロフィール */}
      <header className="flex items-center gap-4">
        <span className="clip-corner flex h-14 w-14 items-center justify-center border border-cyan/40 bg-cyan-soft text-xl font-bold text-cyan">
          イ
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold">イッキ</h1>
            <span className="rounded-full border border-line px-2 py-0.5 text-[9px] font-bold tracking-widest text-ink-3">
              FREE
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-gold">
            <CrownIcon className="h-4 w-4" />
            初段 ・ RATING <span className="font-display">1420</span>
          </p>
        </div>
      </header>

      {/* 戦績 */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="border border-line bg-surface/80 py-3 text-center"
          >
            <p className="font-display text-lg font-bold text-cyan">{value}</p>
            <p className="mt-0.5 text-[10px] text-ink-3">{label}</p>
          </div>
        ))}
      </div>

      {/* 会員ステータス */}
      <section className="mt-4 border border-gold/40 bg-surface/80 p-4">
        <p className="flex items-center gap-1.5 text-sm font-bold text-gold">
          <CrownIcon className="h-4 w-4" />
          Premiumにアップグレード
        </p>
        <ul className="mt-3 flex flex-col gap-1.5">
          {premiumFeatures.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-xs text-ink-2"
            >
              <span className="h-1 w-1 shrink-0 rounded-full bg-gold" />
              {feature}
            </li>
          ))}
        </ul>
        <button className="clip-corner glow-cyan mt-4 w-full bg-cyan py-2.5 text-sm font-bold text-[#02131a] hover:bg-primary-hover">
          月額 1,280円で始める
        </button>
        <p className="mt-2 text-center text-[10px] text-ink-3">
          学生プランは月額680円（要学生証認証）
        </p>
      </section>

      {/* 過去の対戦 */}
      <section className="mt-6">
        <h2 className="flex items-baseline gap-2 text-sm font-bold">
          過去の対戦
          <span className="text-[8px] font-medium tracking-[0.3em] text-ink-3">
            BATTLE LOG
          </span>
        </h2>
        <p className="mt-0.5 text-[10px] text-ink-3">
          Freeプランでは直近3件まで保存されます
        </p>
        <div className="mt-3 divide-y divide-line border border-line bg-surface/80">
          {matchHistory.map((match) => (
            <Link
              key={match.id}
              href="/result"
              className="block p-4 hover:bg-surface-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`font-display rounded-full border px-2 py-0.5 text-[9px] font-bold ${
                    match.result === "WIN"
                      ? "border-green/40 bg-green-soft text-green"
                      : "border-line bg-surface-2 text-ink-3"
                  }`}
                >
                  {match.result}
                </span>
                <span className="text-[10px] text-ink-3">
                  {match.date} ・ {match.side}側
                </span>
              </div>
              <p className="mt-2 text-sm font-bold leading-snug">
                {match.theme}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-ink-2">
                  スコア{" "}
                  <span className="font-display font-bold text-ink">
                    {match.score}
                  </span>
                  <span className="text-ink-3">/40</span>
                </span>
                <span className="flex items-center gap-0.5 text-[11px] font-bold text-cyan">
                  リプレイを見る
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* その他 */}
      <section className="mt-6 pb-4">
        <div className="divide-y divide-line border border-line bg-surface/80">
          {["アカウント設定", "通知設定", "ヘルプ・お問い合わせ"].map(
            (label) => (
              <button
                key={label}
                className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-ink-2 hover:bg-surface-2"
              >
                {label}
                <ChevronRightIcon className="h-4 w-4 text-ink-3" />
              </button>
            ),
          )}
          <button className="w-full px-4 py-3 text-left text-sm font-bold text-accent hover:bg-surface-2">
            ログアウト
          </button>
        </div>
      </section>
    </main>
  );
}
