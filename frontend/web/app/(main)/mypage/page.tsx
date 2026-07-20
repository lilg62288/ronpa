"use client";

import Link from "next/link";
import { ChevronRightIcon, CrownIcon } from "@/components/icons";
import { LangToggle, useLang } from "@/lib/i18n";

const statValues = ["24", "15", "62%"];

export default function MyPage() {
  const { t } = useLang();
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
              {t.mypage.plan}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs font-bold text-gold">
            <CrownIcon className="h-4 w-4" />
            {t.mypage.rank} <span className="font-display">1420</span>
          </p>
        </div>
        <LangToggle />
      </header>

      {/* 戦績 */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {t.mypage.stats.map((label, i) => (
          <div
            key={label}
            className="border border-line bg-surface/80 py-3 text-center"
          >
            <p className="font-display text-lg font-bold text-cyan">
              {statValues[i]}
            </p>
            <p className="mt-0.5 text-[10px] text-ink-3">{label}</p>
          </div>
        ))}
      </div>

      {/* 会員ステータス */}
      <section className="mt-4 border border-gold/40 bg-surface/80 p-4">
        <p className="flex items-center gap-1.5 text-sm font-bold text-gold">
          <CrownIcon className="h-4 w-4" />
          {t.mypage.premiumTitle}
        </p>
        <ul className="mt-3 flex flex-col gap-1.5">
          {t.mypage.features.map((feature) => (
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
          {t.mypage.priceBtn}
        </button>
        <p className="mt-2 text-center text-[10px] text-ink-3">
          {t.mypage.studentPlan}
        </p>
      </section>

      {/* 過去の対戦 */}
      <section className="mt-6">
        <h2 className="flex items-baseline gap-2 text-sm font-bold">
          {t.mypage.history}
          <span className="text-[8px] font-medium tracking-[0.3em] text-ink-3">
            {t.mypage.historyEn}
          </span>
        </h2>
        <p className="mt-0.5 text-[10px] text-ink-3">{t.mypage.historyNote}</p>
        <div className="mt-3 divide-y divide-line border border-line bg-surface/80">
          {t.data.history.map((match) => (
            <Link
              key={match.id}
              href="/result"
              className="block p-4 hover:bg-surface-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`font-display rounded-full border px-2 py-0.5 text-[9px] font-bold ${
                    match.win
                      ? "border-green/40 bg-green-soft text-green"
                      : "border-line bg-surface-2 text-ink-3"
                  }`}
                >
                  {match.win ? "WIN" : "LOSE"}
                </span>
                <span className="text-[10px] text-ink-3">
                  {match.date} ・ {t.side[match.side]}
                </span>
              </div>
              <p className="mt-2 text-sm font-bold leading-snug">
                {match.theme}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-ink-2">
                  {t.mypage.score}{" "}
                  <span className="font-display font-bold text-ink">
                    {match.score}
                  </span>
                  <span className="text-ink-3">/40</span>
                </span>
                <span className="flex items-center gap-0.5 text-[11px] font-bold text-cyan">
                  {t.mypage.replay}
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
          {t.mypage.menu.map((label) => (
            <button
              key={label}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-ink-2 hover:bg-surface-2"
            >
              {label}
              <ChevronRightIcon className="h-4 w-4 text-ink-3" />
            </button>
          ))}
          <button className="w-full px-4 py-3 text-left text-sm font-bold text-accent hover:bg-surface-2">
            {t.mypage.logout}
          </button>
        </div>
      </section>
    </main>
  );
}
