"use client";

import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/Logo";
import { BellIcon, ChevronRightIcon, UsersIcon } from "@/components/icons";
import { LangToggle, useLang } from "@/lib/i18n";

function SectionTitle({ jp, en }: { jp: string; en: string }) {
  return (
    <h2 className="flex items-baseline gap-2 text-sm font-bold">
      {jp}
      <span className="text-[8px] font-medium tracking-[0.3em] text-ink-3">
        {en}
      </span>
    </h2>
  );
}

export default function HomePage() {
  const { t } = useLang();
  return (
    <main className="px-4 pt-5">
      {/* ヘッダー */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <LogoMark size="sm" />
          <Wordmark className="text-base" />
        </div>
        <div className="flex items-center gap-2">
          <LangToggle />
          <button className="relative rounded-md border border-line bg-surface/80 p-2 text-ink-2 hover:border-cyan/40">
            <BellIcon className="h-4.5 w-4.5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-cyan" />
          </button>
        </div>
      </header>

      {/* オープンβ表示 */}
      <div className="mt-4 flex items-center gap-2.5 border border-line bg-surface/80 px-4 py-3">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute h-full w-full animate-ping rounded-full bg-green opacity-50" />
          <span className="h-2 w-2 rounded-full bg-green" />
        </span>
        <span className="text-sm font-bold">{t.home.beta}</span>
        <span className="text-[10px] tracking-wider text-ink-3">
          {t.home.betaNote}
        </span>
      </div>

      {/* CTAカード */}
      <div className="mt-3 border border-cyan/25 bg-surface/80 p-4">
        <p className="text-[8px] font-medium tracking-[0.3em] text-cyan/70">
          DAILY TRAINING
        </p>
        <p className="mt-1.5 text-base font-bold">{t.home.ctaTitle}</p>
        <p className="mt-1 text-xs leading-relaxed text-ink-2">
          {t.home.ctaDesc}
        </p>
        <Link
          href="/room?mode=ai"
          className="clip-corner mt-3 inline-flex items-center gap-1 bg-cyan px-4 py-1.5 text-xs font-bold text-[#02131a] hover:bg-primary-hover"
        >
          {t.home.ctaBtn} <ChevronRightIcon className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 公開ルーム（準備中） */}
      <section className="mt-6">
        <SectionTitle jp={t.home.rooms} en={t.home.roomsEn} />
        <div className="mt-3 flex flex-col items-center border border-dashed border-line bg-surface/40 px-4 py-8 text-center">
          <UsersIcon className="h-8 w-8 text-ink-3" />
          <p className="mt-3 text-sm font-bold text-ink-2">
            {t.home.roomsSoon}
          </p>
          <p className="mt-1 text-[11px] text-ink-3">{t.home.roomsSoonNote}</p>
          <Link
            href="/room?mode=ai"
            className="clip-corner mt-4 bg-cyan px-4 py-1.5 text-xs font-bold text-[#02131a] hover:bg-primary-hover"
          >
            {t.home.ctaBtn}
          </Link>
        </div>
      </section>

      {/* ニュース */}
      <section className="mt-6 pb-4">
        <SectionTitle jp={t.home.news} en={t.home.newsEn} />
        <div className="mt-3 divide-y divide-line border border-line bg-surface/80">
          {t.data.news.map((item) => (
            <button
              key={item.id}
              className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-2"
            >
              <span className="font-display shrink-0 text-[10px] text-ink-3">
                {item.date}
              </span>
              <span className="flex-1 text-xs leading-snug text-ink-2">
                {item.title}
              </span>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-ink-3" />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
