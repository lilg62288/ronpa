"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { XIcon } from "@/components/icons";
import { LangToggle, useLang } from "@/lib/i18n";
import { makeRoomCode, versusSupported } from "@/lib/versus";

type Mode = "menu" | "create" | "join";

export default function VersusLobby() {
  const router = useRouter();
  const { t } = useLang();
  const themes = t.data.themeBank.map((x) => x.sample);

  const [mode, setMode] = useState<Mode>("menu");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [themeIdx, setThemeIdx] = useState(() =>
    Math.floor(Math.random() * themes.length),
  );
  const [error, setError] = useState("");

  const theme = themes[themeIdx];

  const create = () => {
    if (!name.trim()) return setError(t.versus.needName);
    const roomCode = makeRoomCode();
    const q = new URLSearchParams({
      code: roomCode,
      role: "host",
      name: name.trim(),
      theme,
    });
    router.push(`/versus/room?${q}`);
  };

  const join = () => {
    if (!name.trim()) return setError(t.versus.needName);
    if (!/^\d{6}$/.test(code.trim())) return setError(t.versus.needCode);
    const q = new URLSearchParams({
      code: code.trim(),
      role: "guest",
      name: name.trim(),
    });
    router.push(`/versus/room?${q}`);
  };

  return (
    <main className="flex min-h-dvh flex-col px-4 pt-6">
      <div className="flex items-center justify-between">
        <Link
          href="/battle"
          className="border border-line p-2 text-ink-3 hover:border-cyan/40"
        >
          <XIcon className="h-4 w-4" />
        </Link>
        <p className="text-[9px] font-medium tracking-[0.3em] text-cyan/70">
          VERSUS / REALTIME
        </p>
        <LangToggle />
      </div>

      <h1 className="mt-6 text-lg font-bold">{t.versus.lobbyTitle}</h1>
      <p className="mt-1 text-xs text-ink-3">{t.versus.lobbySub}</p>

      {!versusSupported() && (
        <p className="mt-4 border border-gold/40 bg-gold-soft px-3 py-2 text-[11px] text-gold">
          （デモ環境では対人戦は動作しません）
        </p>
      )}

      <label className="mt-5 block">
        <span className="text-xs font-bold text-ink-2">
          {t.versus.nameLabel} <span className="text-accent">*</span>
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t.versus.namePh}
          className="mt-1.5 w-full border border-line bg-bg p-3 text-sm text-ink placeholder:text-ink-3 focus:border-cyan/60 focus:outline-none"
        />
      </label>

      {mode === "menu" && (
        <div className="mt-5 flex flex-col gap-3">
          <button
            onClick={() => {
              setError("");
              setMode("create");
            }}
            className="border border-accent/40 bg-surface/80 p-4 text-left hover:border-accent"
          >
            <p className="font-display text-[10px] tracking-[0.25em] text-accent">
              PRO / HOST
            </p>
            <p className="mt-1 text-base font-bold">{t.versus.create}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-2">
              {t.versus.createDesc}
            </p>
          </button>
          <button
            onClick={() => {
              setError("");
              setMode("join");
            }}
            className="border border-blue/40 bg-surface/80 p-4 text-left hover:border-blue"
          >
            <p className="font-display text-[10px] tracking-[0.25em] text-blue">
              CON / GUEST
            </p>
            <p className="mt-1 text-base font-bold">{t.versus.join}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-2">
              {t.versus.joinDesc}
            </p>
          </button>
        </div>
      )}

      {mode === "create" && (
        <div className="mt-5 flex flex-col gap-4">
          <div className="border border-line bg-surface/80 p-4">
            <p className="text-[9px] tracking-[0.3em] text-ink-3">TOPIC</p>
            <p className="mt-1.5 text-sm font-bold leading-snug">{theme}</p>
            <button
              onClick={() => setThemeIdx((i) => (i + 1) % themes.length)}
              className="mt-3 text-[11px] font-bold text-cyan"
            >
              🎲 {t.versus.reroll}
            </button>
          </div>
          {error && (
            <p className="border border-accent/40 bg-accent-soft px-3 py-2 text-xs text-accent">
              {error}
            </p>
          )}
          <button
            onClick={create}
            className="clip-corner glow-cyan bg-cyan py-3.5 text-sm font-bold tracking-widest text-[#02131a] hover:bg-primary-hover"
          >
            {t.versus.createBtn}
          </button>
          <button
            onClick={() => setMode("menu")}
            className="text-center text-[11px] font-bold text-ink-3"
          >
            ← {t.versus.leave}
          </button>
        </div>
      )}

      {mode === "join" && (
        <div className="mt-5 flex flex-col gap-4">
          <label className="block">
            <span className="text-xs font-bold text-ink-2">
              {t.versus.codeLabel} <span className="text-accent">*</span>
            </span>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              inputMode="numeric"
              maxLength={6}
              placeholder={t.versus.codePh}
              className="mt-1.5 w-full border border-line bg-bg p-3 text-center font-display text-2xl tracking-[0.3em] text-ink placeholder:text-sm placeholder:tracking-normal placeholder:text-ink-3 focus:border-cyan/60 focus:outline-none"
            />
          </label>
          {error && (
            <p className="border border-accent/40 bg-accent-soft px-3 py-2 text-xs text-accent">
              {error}
            </p>
          )}
          <button
            onClick={join}
            className="clip-corner glow-cyan bg-cyan py-3.5 text-sm font-bold tracking-widest text-[#02131a] hover:bg-primary-hover"
          >
            {t.versus.joinBtn}
          </button>
          <button
            onClick={() => setMode("menu")}
            className="text-center text-[11px] font-bold text-ink-3"
          >
            ← {t.versus.leave}
          </button>
        </div>
      )}
    </main>
  );
}
