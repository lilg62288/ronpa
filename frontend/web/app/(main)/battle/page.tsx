"use client";

import Link from "next/link";
import {
  BotIcon,
  ChevronRightIcon,
  SwordsIcon,
  UsersIcon,
} from "@/components/icons";
import { LangToggle, useLang } from "@/lib/i18n";

export default function BattlePage() {
  const { t } = useLang();
  const modes = [
    {
      href: "/room?mode=ai",
      tag: t.battle.aiTag,
      title: t.battle.aiTitle,
      desc: t.battle.aiDesc,
      Icon: BotIcon,
      iconClass: "border-gold/40 bg-gold-soft text-gold",
    },
    {
      href: "/room?mode=random",
      tag: t.battle.randomTag,
      title: t.battle.randomTitle,
      desc: t.battle.randomDesc,
      Icon: SwordsIcon,
      iconClass: "border-accent/40 bg-accent-soft text-accent",
    },
    {
      href: "/room?mode=group",
      tag: t.battle.groupTag,
      title: t.battle.groupTitle,
      desc: t.battle.groupDesc,
      Icon: UsersIcon,
      iconClass: "border-blue/40 bg-blue-soft text-blue",
    },
  ];

  return (
    <main className="px-4 pt-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="flex items-baseline gap-2 text-lg font-bold">
            {t.battle.title}
            <span className="text-[8px] font-medium tracking-[0.3em] text-ink-3">
              {t.battle.titleEn}
            </span>
          </h1>
          <p className="mt-1 text-xs text-ink-3">{t.battle.subtitle}</p>
        </div>
        <LangToggle />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {modes.map(({ href, tag, title, desc, Icon, iconClass }) => (
          <Link
            key={href}
            href={href}
            className="border border-line bg-surface/80 p-4 hover:border-cyan/40"
          >
            <div className="flex items-start gap-3.5">
              <span
                className={`clip-corner flex h-12 w-12 shrink-0 items-center justify-center border ${iconClass}`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[8px] font-medium tracking-[0.25em] text-ink-3">
                  {tag}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-base font-bold">
                  {title}
                  <ChevronRightIcon className="h-4 w-4 text-cyan/60" />
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-2">
                  {desc}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* テーマバンク */}
      <section className="mt-7 pb-4">
        <h2 className="flex items-baseline gap-2 text-sm font-bold">
          {t.battle.themeBank}
          <span className="text-[8px] font-medium tracking-[0.3em] text-ink-3">
            {t.battle.themeBankEn}
          </span>
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {t.data.themeBank.map(({ category, cls, count, sample }) => (
            <button
              key={category}
              className="border border-line bg-surface/80 p-3.5 text-left hover:border-cyan/40"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${cls}`}
                >
                  {category}
                </span>
                <span className="font-display text-[10px] text-ink-3">
                  {count}
                  {t.battle.countSuffix}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-[11px] leading-snug text-ink-2">
                {sample}
              </p>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
