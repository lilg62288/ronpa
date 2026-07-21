"use client";

import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/Logo";
import { LangToggle, useLang } from "@/lib/i18n";

export default function SplashPage() {
  const { t } = useLang();
  return (
    <main className="flex min-h-dvh flex-col justify-between px-8 py-12">
      <div className="flex items-center justify-between">
        <span className="w-14" />
        <p className="text-[9px] tracking-[0.4em] text-ink-3">SYSTEM ONLINE</p>
        <LangToggle />
      </div>
      <div className="flex flex-col items-center text-center">
        <LogoMark size="lg" />
        <div className="mt-7">
          <Wordmark className="text-4xl" />
        </div>
        <p className="mt-4 text-[9px] font-medium tracking-[0.3em] text-cyan/70">
          REALTIME ONLINE NEGOTIATION & PRACTICE ARENA
        </p>
        <div className="mt-8 h-px w-24 bg-gradient-to-r from-transparent via-cyan/50 to-transparent" />
        <p className="mt-8 text-sm leading-relaxed text-ink-2">
          {t.splash.catch1}
          <br />
          {t.splash.catch2}
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Link
          href="/auth?mode=signup"
          className="clip-corner glow-cyan bg-cyan py-3.5 text-center text-sm font-bold tracking-widest text-[#02131a] hover:bg-primary-hover"
        >
          {t.splash.signup}
        </Link>
        <Link
          href="/auth?mode=login"
          className="clip-corner border border-cyan/30 bg-cyan-soft py-3.5 text-center text-sm font-bold tracking-widest text-cyan hover:border-cyan/60"
        >
          {t.splash.login}
        </Link>
        <p className="mt-2 text-center text-[10px] leading-relaxed text-ink-3">
          {t.splash.terms}
        </p>
        <div className="flex items-center justify-center gap-3 text-[10px] text-cyan/70">
          <Link href="/terms" className="hover:text-cyan">
            {t.splash.termsLabel}
          </Link>
          <span className="text-ink-3">・</span>
          <Link href="/privacy" className="hover:text-cyan">
            {t.splash.privacyLabel}
          </Link>
        </div>
      </div>
    </main>
  );
}
