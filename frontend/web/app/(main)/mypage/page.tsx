"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRightIcon, CrownIcon } from "@/components/icons";
import { useAuth } from "@/lib/auth";
import { LangToggle, useLang } from "@/lib/i18n";

// β版: 対戦記録はまだ保存されないため0で表示
const statValues = ["0", "0", "—"];

export default function MyPage() {
  const { t } = useLang();
  const router = useRouter();
  const { user, signOut } = useAuth();

  // ログイン中はメールのユーザー名部分を表示、未ログインはデモ名
  const displayName = user?.email ? user.email.split("@")[0] : "イッキ";
  const avatarChar = displayName[0]?.toUpperCase() ?? "イ";

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <main className="px-4 pt-6">
      {/* プロフィール */}
      <header className="flex items-center gap-4">
        <span className="clip-corner flex h-14 w-14 items-center justify-center border border-cyan/40 bg-cyan-soft text-xl font-bold text-cyan">
          {avatarChar}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-lg font-bold">{displayName}</h1>
            <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[9px] font-bold tracking-widest text-ink-3">
              {t.mypage.plan}
            </span>
          </div>
          {user?.email ? (
            <p className="mt-1 truncate text-[11px] text-ink-3">
              {t.auth.loggedInAs}: {user.email}
            </p>
          ) : (
            <p className="mt-1 text-[11px] text-ink-3">{t.mypage.guestNote}</p>
          )}
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
        <div className="mt-3 flex flex-col items-center border border-dashed border-line bg-surface/40 px-4 py-8 text-center">
          <p className="text-sm font-bold text-ink-2">{t.mypage.noHistory}</p>
          <p className="mt-1 text-[11px] text-ink-3">
            {t.mypage.noHistoryNote}
          </p>
          <Link
            href="/room?mode=ai"
            className="clip-corner mt-4 bg-cyan px-4 py-1.5 text-xs font-bold text-[#02131a] hover:bg-primary-hover"
          >
            {t.home.ctaBtn}
          </Link>
        </div>
      </section>

      {/* その他 */}
      <section className="mt-6 pb-4">
        <div className="divide-y divide-line border border-line bg-surface/80">
          {/* アカウント設定・通知設定は準備中 */}
          {t.mypage.menu.slice(0, 2).map((label) => (
            <div
              key={label}
              className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-ink-3"
            >
              {label}
              <span className="rounded-full border border-line px-2 py-0.5 text-[9px] font-bold text-ink-3">
                {t.battle.soon}
              </span>
            </div>
          ))}
          {/* ヘルプ・お問い合わせはメールで受付 */}
          <a
            href="mailto:lil.g62288@gmail.com"
            className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-ink-2 hover:bg-surface-2"
          >
            {t.mypage.menu[2]}
            <ChevronRightIcon className="h-4 w-4 text-ink-3" />
          </a>
          {user ? (
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-sm font-bold text-accent hover:bg-surface-2"
            >
              {t.mypage.logout}
            </button>
          ) : (
            <Link
              href="/auth?mode=login"
              className="block w-full px-4 py-3 text-left text-sm font-bold text-cyan hover:bg-surface-2"
            >
              {t.splash.login}
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}
