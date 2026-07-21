"use client";

import Link from "next/link";
import { XIcon } from "@/components/icons";
import { LangToggle, useLang } from "@/lib/i18n";
import type { LegalDoc } from "@/lib/legal";

export function LegalPage({ docs }: { docs: Record<"ja" | "en", LegalDoc> }) {
  const { lang } = useLang();
  const doc = docs[lang];
  return (
    <main className="min-h-dvh px-5 pb-16 pt-5">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="border border-line p-2 text-ink-3 hover:border-cyan/40"
        >
          <XIcon className="h-4 w-4" />
        </Link>
        <p className="text-[9px] font-medium tracking-[0.3em] text-cyan/70">
          LEGAL
        </p>
        <LangToggle />
      </div>

      <h1 className="mt-6 text-xl font-bold">{doc.title}</h1>
      <p className="mt-1 text-[11px] text-ink-3">{doc.updated}</p>

      <p className="mt-3 border border-gold/40 bg-gold-soft px-3 py-2 text-[11px] leading-relaxed text-gold">
        {doc.draftNote}
      </p>

      <p className="mt-5 text-xs leading-relaxed text-ink-2">{doc.intro}</p>

      <div className="mt-6 flex flex-col gap-6">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-sm font-bold text-ink">{section.heading}</h2>
            <div className="mt-2 flex flex-col gap-1.5">
              {section.body.map((line, i) => (
                <p key={i} className="text-xs leading-relaxed text-ink-2">
                  {line}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Link
        href="/"
        className="clip-corner mt-10 block border border-cyan/30 bg-cyan-soft py-3 text-center text-sm font-bold tracking-widest text-cyan hover:border-cyan/60"
      >
        {lang === "ja" ? "戻る" : "Back"}
      </Link>
    </main>
  );
}
