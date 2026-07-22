"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { XIcon } from "@/components/icons";
import { useAuth } from "@/lib/auth";
import { LangToggle, useLang } from "@/lib/i18n";
import { emptyProfile, getProfile, saveProfile, type Profile } from "@/lib/profile";

export default function ProfileSettingsPage() {
  const { t } = useLang();
  const { user, loading } = useAuth();
  const [p, setP] = useState<Profile>(emptyProfile);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    getProfile().then((data) => data && setP(data));
  }, [user]);

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => {
    setP((prev) => ({ ...prev, [k]: v }));
    setSaved(false);
  };

  const save = async () => {
    if (!user || busy) return;
    setBusy(true);
    setError("");
    const err = await saveProfile(user.id, p);
    setBusy(false);
    if (err) setError(t.profile.saveFail);
    else setSaved(true);
  };

  const genderKeys = ["male", "female", "other", "na"] as const;
  const fieldKeys = ["careers", "current", "business", "academia", "all"] as const;
  const expKeys = ["beginner", "casual", "experienced"] as const;

  const header = (
    <div className="flex items-center justify-between">
      <Link
        href="/mypage"
        className="border border-line p-2 text-ink-3 hover:border-cyan/40"
      >
        <XIcon className="h-4 w-4" />
      </Link>
      <p className="text-[9px] font-medium tracking-[0.3em] text-cyan/70">
        PROFILE
      </p>
      <LangToggle />
    </div>
  );

  if (!loading && !user) {
    return (
      <main className="min-h-dvh px-4 pt-6">
        {header}
        <div className="mt-16 flex flex-col items-center text-center">
          <p className="text-sm text-ink-2">{t.profile.loginNeeded}</p>
          <Link
            href="/auth?mode=login"
            className="clip-corner glow-cyan mt-4 bg-cyan px-6 py-2.5 text-sm font-bold text-[#02131a] hover:bg-primary-hover"
          >
            {t.profile.login}
          </Link>
        </div>
      </main>
    );
  }

  const inputCls =
    "mt-1.5 w-full border border-line bg-bg p-3 text-sm text-ink placeholder:text-ink-3 focus:border-cyan/60 focus:outline-none";
  const selectCls =
    "mt-1.5 w-full border border-line bg-bg p-3 text-sm text-ink focus:border-cyan/60 focus:outline-none";

  return (
    <main className="min-h-dvh px-4 pb-10 pt-6">
      {header}
      <h1 className="mt-6 text-lg font-bold">{t.profile.title}</h1>
      <p className="mt-1 text-xs text-ink-3">{t.profile.sub}</p>

      <div className="mt-5 flex flex-col gap-4">
        <label className="block">
          <span className="text-xs font-bold text-ink-2">{t.profile.name}</span>
          <input
            value={p.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder={t.profile.namePh}
            maxLength={30}
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold text-ink-2">{t.profile.age}</span>
          <input
            value={p.age ?? ""}
            onChange={(e) => {
              const n = e.target.value.replace(/\D/g, "").slice(0, 3);
              set("age", n === "" ? null : parseInt(n, 10));
            }}
            inputMode="numeric"
            placeholder={t.profile.agePh}
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold text-ink-2">
            {t.profile.gender}
          </span>
          <select
            value={p.gender}
            onChange={(e) => set("gender", e.target.value)}
            className={selectCls}
          >
            <option value="">{t.profile.unset}</option>
            {genderKeys.map((k) => (
              <option key={k} value={k}>
                {t.profile.genderOpts[k]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold text-ink-2">{t.profile.field}</span>
          <select
            value={p.field}
            onChange={(e) => set("field", e.target.value)}
            className={selectCls}
          >
            <option value="">{t.profile.unset}</option>
            {fieldKeys.map((k) => (
              <option key={k} value={k}>
                {t.profile.fieldOpts[k]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold text-ink-2">
            {t.profile.experience}
          </span>
          <select
            value={p.experience}
            onChange={(e) => set("experience", e.target.value)}
            className={selectCls}
          >
            <option value="">{t.profile.unset}</option>
            {expKeys.map((k) => (
              <option key={k} value={k}>
                {t.profile.expOpts[k]}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold text-ink-2">{t.profile.bio}</span>
          <textarea
            value={p.bio}
            onChange={(e) => set("bio", e.target.value)}
            placeholder={t.profile.bioPh}
            rows={3}
            maxLength={200}
            className={`${inputCls} resize-none`}
          />
        </label>

        {error && (
          <p className="border border-accent/40 bg-accent-soft px-3 py-2 text-xs text-accent">
            {error}
          </p>
        )}
        {saved && (
          <p className="border border-green/40 bg-green-soft px-3 py-2 text-xs font-bold text-green">
            {t.profile.saved}
          </p>
        )}

        <button
          onClick={save}
          disabled={busy}
          className="clip-corner glow-cyan bg-cyan py-3.5 text-sm font-bold tracking-widest text-[#02131a] hover:bg-primary-hover disabled:opacity-40 disabled:shadow-none"
        >
          {busy ? t.profile.saving : t.profile.save}
        </button>
      </div>
    </main>
  );
}
