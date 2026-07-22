"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogoMark, Wordmark } from "@/components/Logo";
import { LangToggle, useLang } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";

export function AuthClient({ initialMode }: { initialMode: "login" | "signup" }) {
  const router = useRouter();
  const { t } = useLang();
  const { signUp, signIn, configured } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const isSignup = mode === "signup";

  const submit = async () => {
    if (busy) return;
    setError("");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError(t.auth.invalidEmail);
      return;
    }
    if (password.length < 6) {
      setError(t.auth.minPassword);
      return;
    }
    setBusy(true);
    try {
      if (isSignup) {
        const { error, autoLogin } = await signUp(email, password);
        if (error) {
          setError(error);
          return;
        }
        // メール確認OFFなら即ログイン→ホームへ。ONなら確認メール案内を表示
        if (autoLogin) {
          router.push("/home");
        } else {
          setEmailSent(true);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError(error);
          return;
        }
        router.push("/home");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-dvh flex-col justify-between px-8 py-10">
      <div className="flex items-center justify-between">
        <span className="w-14" />
        <p className="text-[9px] tracking-[0.4em] text-ink-3">
          {isSignup ? "REGISTER" : "SIGN IN"}
        </p>
        <LangToggle />
      </div>

      <div>
        <div className="flex flex-col items-center text-center">
          <LogoMark size="md" />
          <div className="mt-4">
            <Wordmark className="text-2xl" />
          </div>
          <h1 className="mt-6 text-lg font-bold">
            {isSignup ? t.auth.signupTitle : t.auth.loginTitle}
          </h1>
          <p className="mt-1 text-xs text-ink-3">
            {isSignup ? t.auth.signupSub : t.auth.loginSub}
          </p>
        </div>

        {!configured && (
          <p className="mt-5 border border-gold/40 bg-gold-soft px-3 py-2.5 text-[11px] leading-relaxed text-gold">
            {t.auth.notConfigured}
          </p>
        )}

        {emailSent ? (
          <div className="mt-6 border border-green/40 bg-green-soft p-4 text-center">
            <p className="text-xs leading-relaxed text-ink-2">
              {t.auth.checkEmail}
            </p>
            <Link
              href="/home"
              className="clip-corner mt-4 inline-block bg-cyan px-6 py-2.5 text-sm font-bold text-[#02131a] hover:bg-primary-hover"
            >
              {t.result.backHome}
            </Link>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            <label className="block">
              <span className="text-xs font-bold text-ink-2">
                {t.auth.email}
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.auth.emailPh}
                autoComplete="email"
                className="mt-1.5 w-full border border-line bg-bg p-3 text-sm text-ink placeholder:text-ink-3 focus:border-cyan/60 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-ink-2">
                {t.auth.password}
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder={t.auth.passwordPh}
                autoComplete={isSignup ? "new-password" : "current-password"}
                className="mt-1.5 w-full border border-line bg-bg p-3 text-sm text-ink placeholder:text-ink-3 focus:border-cyan/60 focus:outline-none"
              />
            </label>
            {error && (
              <p className="border border-accent/40 bg-accent-soft px-3 py-2 text-xs text-accent">
                {error}
              </p>
            )}
            <button
              onClick={submit}
              disabled={busy}
              className="clip-corner glow-cyan bg-cyan py-3.5 text-sm font-bold tracking-widest text-[#02131a] hover:bg-primary-hover disabled:opacity-40 disabled:shadow-none"
            >
              {busy
                ? t.auth.processing
                : isSignup
                  ? t.auth.signupBtn
                  : t.auth.loginBtn}
            </button>
            <button
              onClick={() => {
                setMode(isSignup ? "login" : "signup");
                setError("");
              }}
              className="text-center text-[11px] font-bold text-cyan hover:text-primary-hover"
            >
              {isSignup ? t.auth.toLogin : t.auth.toSignup}
            </button>
          </div>
        )}
      </div>

      <Link
        href="/home"
        className="text-center text-[10px] text-ink-3 hover:text-cyan"
      >
        {t.auth.guestContinue} →
      </Link>
    </main>
  );
}
