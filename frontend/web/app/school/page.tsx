"use client";

import Link from "next/link";
import { Wordmark } from "@/components/Logo";
import { LangToggle, useLang } from "@/lib/i18n";

export default function SchoolTopPage() {
  const { t } = useLang();
  return (
    <main className="flex min-h-dvh flex-col justify-center px-6 py-10">
      <div className="flex justify-end">
        <LangToggle />
      </div>
      <div className="text-center">
        <Wordmark className="text-2xl" />
        <p className="mt-2 text-[9px] font-medium tracking-[0.35em] text-gold">
          {t.school.top.mode}
        </p>
        <p className="mt-6 text-xs leading-relaxed text-ink-2">
          {t.school.top.desc1}
          <br />
          {t.school.top.desc2}
        </p>
      </div>
      <div className="mt-10 flex flex-col gap-4">
        <Link
          href="/school/teacher"
          className="border border-gold/40 bg-surface/80 p-5 hover:border-gold"
        >
          <p className="font-display text-[10px] tracking-[0.25em] text-gold">
            TEACHER
          </p>
          <p className="mt-1 text-lg font-bold">{t.school.top.teacherTitle}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
            {t.school.top.teacherDesc}
          </p>
        </Link>
        <Link
          href="/school/student"
          className="border border-cyan/40 bg-surface/80 p-5 hover:border-cyan"
        >
          <p className="font-display text-[10px] tracking-[0.25em] text-cyan">
            STUDENT
          </p>
          <p className="mt-1 text-lg font-bold">{t.school.top.studentTitle}</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
            {t.school.top.studentDesc}
          </p>
        </Link>
      </div>
      <p className="mt-8 text-center text-[10px] text-ink-3">
        <Link href="/home" className="text-cyan/70 hover:text-cyan">
          {t.school.top.back}
        </Link>
      </p>
    </main>
  );
}
