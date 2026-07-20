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

      {/* オンライン状況 */}
      <div className="mt-4 flex items-center justify-between border border-line bg-surface/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute h-full w-full animate-ping rounded-full bg-green opacity-50" />
            <span className="h-2 w-2 rounded-full bg-green" />
          </span>
          <span className="text-sm font-bold">
            <span className="font-display">1,284</span>
            <span className="text-xs font-normal text-ink-2">
              {t.home.online}
            </span>
          </span>
        </div>
        <span className="text-[10px] tracking-wider text-ink-3">
          {t.home.today}
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

      {/* 公開ルーム */}
      <section className="mt-6">
        <div className="flex items-center justify-between">
          <SectionTitle jp={t.home.rooms} en={t.home.roomsEn} />
          <Link
            href="/battle"
            className="text-[11px] font-bold text-cyan hover:text-primary-hover"
          >
            {t.home.seeAll}
          </Link>
        </div>
        <div className="mt-3 divide-y divide-line border border-line bg-surface/80">
          {t.data.rooms.map((room) => (
            <div key={room.id} className="p-4">
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${room.cls}`}
                >
                  {room.category}
                </span>
                {room.live ? (
                  <span className="flex items-center gap-1 rounded-full border border-accent/40 bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                    {t.home.live}
                  </span>
                ) : (
                  <span className="rounded-full border border-green/40 bg-green-soft px-2 py-0.5 text-[10px] font-bold text-green">
                    {t.home.recruiting}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm font-bold leading-snug">
                {room.theme}
              </p>
              <div className="mt-2.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-ink-3">
                  <UsersIcon className="h-4 w-4" />
                  <span className="font-display text-[11px]">
                    {room.members}/{room.capacity}
                  </span>
                </span>
                <Link
                  href="/room?mode=group"
                  className={`clip-corner px-3.5 py-1 text-xs font-bold ${
                    room.live
                      ? "border border-line bg-surface-2 text-ink-2 hover:border-cyan/40"
                      : "bg-cyan text-[#02131a] hover:bg-primary-hover"
                  }`}
                >
                  {room.live ? t.home.watch : t.home.join}
                </Link>
              </div>
            </div>
          ))}
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
