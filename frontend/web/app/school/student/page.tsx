"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MicIcon, MicOffIcon, XIcon } from "@/components/icons";
import { currentLang, LangToggle, useLang } from "@/lib/i18n";
import {
  getAssignment,
  submitTranscript,
  type Assignment,
  type Submission,
} from "@/lib/school-api";

/* eslint-disable @typescript-eslint/no-explicit-any */

type Stage = "join" | "record" | "done";

const axisKeys = ["logic", "persuasion", "rebuttal", "structure"] as const;

export default function StudentPage() {
  const { t } = useLang();
  const ts = t.school.student;
  const [stage, setStage] = useState<Stage>("join");
  const [code, setCode] = useState("");
  const [number, setNumber] = useState("");
  const [name, setName] = useState("");
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState("");

  const [recording, setRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Submission | null>(null);

  const recognitionRef = useRef<any>(null);
  const recordingRef = useRef(false);

  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ??
      (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SR);
    return () => {
      recordingRef.current = false;
      recognitionRef.current?.stop();
    };
  }, []);

  const join = async () => {
    if (joining) return;
    const num = parseInt(number, 10);
    if (!/^\d{6}$/.test(code.trim())) {
      setError(ts.errCode);
      return;
    }
    if (!num || num < 1 || num > 99) {
      setError(ts.errNo);
      return;
    }
    setError("");
    setJoining(true);
    try {
      setAssignment(await getAssignment(code.trim()));
      setStage("record");
    } catch (e) {
      setError(e instanceof Error ? e.message : ts.joinFail);
    } finally {
      setJoining(false);
    }
  };

  const startRecognition = () => {
    const SR =
      (window as any).SpeechRecognition ??
      (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    // 言語設定に合わせて認識言語を切り替える（英語授業対応）
    rec.lang = currentLang() === "en" ? "en-US" : "ja-JP";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e: any) => {
      let interimText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) {
          const text = r[0].transcript.trim();
          if (text) setTranscript((tr) => (tr ? `${tr}\n${text}` : text));
        } else {
          interimText += r[0].transcript;
        }
      }
      setInterim(interimText);
    };
    rec.onend = () => {
      // 無音などで勝手に切れるので、記録中は自動再開
      if (recordingRef.current) {
        try {
          rec.start();
        } catch {
          /* すでに開始済みなら無視 */
        }
      } else {
        setInterim("");
      }
    };
    rec.onerror = (e: any) => {
      if (e.error === "not-allowed") {
        setError(ts.micDenied);
        recordingRef.current = false;
        setRecording(false);
      }
    };
    recognitionRef.current = rec;
    rec.start();
  };

  const toggleRecording = () => {
    setError("");
    if (recording) {
      recordingRef.current = false;
      setRecording(false);
      recognitionRef.current?.stop();
    } else {
      recordingRef.current = true;
      setRecording(true);
      startRecognition();
    }
  };

  const send = async () => {
    if (sending) return;
    recordingRef.current = false;
    setRecording(false);
    recognitionRef.current?.stop();
    setError("");
    setSending(true);
    try {
      const res = await submitTranscript(
        code.trim(),
        parseInt(number, 10),
        transcript,
        name.trim(),
        currentLang(),
      );
      setResult(res);
      setStage("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : ts.sendFail);
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-dvh px-4 pb-10 pt-5">
      <div className="flex items-center justify-between">
        <Link
          href="/school"
          className="border border-line p-2 text-ink-3 hover:border-cyan/40"
        >
          <XIcon className="h-4 w-4" />
        </Link>
        <p className="text-[9px] font-medium tracking-[0.3em] text-cyan/70">
          FOR SCHOOL / STUDENT
        </p>
        <LangToggle />
      </div>

      {stage === "join" && (
        <>
          <h1 className="mt-6 text-lg font-bold">{ts.joinTitle}</h1>
          <p className="mt-1 text-xs text-ink-3">{ts.joinSub}</p>
          <div className="mt-5 flex flex-col gap-4">
            <label className="block">
              <span className="text-xs font-bold text-ink-2">
                {ts.codeLabel} <span className="text-accent">*</span>
              </span>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                maxLength={6}
                placeholder={ts.codePh}
                className="mt-1.5 w-full border border-line bg-bg p-3 text-center font-display text-2xl tracking-[0.3em] text-ink placeholder:text-sm placeholder:tracking-normal placeholder:text-ink-3 focus:border-cyan/60 focus:outline-none"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-bold text-ink-2">
                  {ts.noLabel} <span className="text-accent">*</span>
                </span>
                <input
                  value={number}
                  onChange={(e) =>
                    setNumber(e.target.value.replace(/\D/g, "").slice(0, 2))
                  }
                  inputMode="numeric"
                  placeholder="12"
                  className="mt-1.5 w-full border border-line bg-bg p-3 text-center font-display text-xl text-ink placeholder:text-ink-3 focus:border-cyan/60 focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="text-xs font-bold text-ink-2">
                  {ts.nameLabel}
                </span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={ts.namePh}
                  className="mt-1.5 w-full border border-line bg-bg p-3 text-sm text-ink placeholder:text-ink-3 focus:border-cyan/60 focus:outline-none"
                />
              </label>
            </div>
            {error && (
              <p className="border border-accent/40 bg-accent-soft px-3 py-2 text-xs text-accent">
                {error}
              </p>
            )}
            <button
              onClick={join}
              disabled={joining}
              className="clip-corner glow-cyan bg-cyan py-3.5 text-sm font-bold tracking-widest text-[#02131a] hover:bg-primary-hover disabled:opacity-40"
            >
              {joining ? ts.checking : ts.joinBtn}
            </button>
          </div>
        </>
      )}

      {stage === "record" && assignment && (
        <>
          <div className="mt-5 border border-line bg-surface/80 p-4 text-center">
            <p className="text-[9px] tracking-[0.3em] text-ink-3">
              {ts.todayTheme}
            </p>
            <p className="mt-1.5 text-sm font-bold leading-snug">
              {assignment.theme}
            </p>
            {assignment.instructions && (
              <p className="mt-2 text-[11px] leading-relaxed text-ink-2">
                {assignment.instructions}
              </p>
            )}
            <p className="mt-2 text-[10px] text-ink-3">
              {ts.noLabel} {number}
              {name && ` ・ ${name}`}
            </p>
          </div>

          {/* 録音コントロール */}
          <div className="mt-5 flex flex-col items-center">
            <button
              onClick={toggleRecording}
              disabled={!speechSupported}
              className="flex flex-col items-center gap-2 disabled:opacity-40"
            >
              <span
                className={`flex h-20 w-20 items-center justify-center rounded-full ${
                  recording
                    ? "speaking bg-accent text-white"
                    : "glow-cyan bg-cyan text-[#02131a]"
                }`}
              >
                {recording ? (
                  <MicIcon className="h-9 w-9" />
                ) : (
                  <MicOffIcon className="h-9 w-9" />
                )}
              </span>
              <span
                className={`text-xs font-bold ${recording ? "text-accent" : "text-cyan"}`}
              >
                {recording ? ts.recStop : ts.recStart}
              </span>
            </button>
            {!speechSupported && (
              <p className="mt-2 text-center text-[10px] text-gold">
                {ts.unsupported}
              </p>
            )}
            <p className="mt-2 text-center text-[10px] text-ink-3">
              {ts.place}
            </p>
          </div>

          {/* 文字起こし */}
          <div className="mt-5">
            <p className="flex items-baseline gap-2 text-xs font-bold text-ink-2">
              {ts.transcript}
              <span className="text-[8px] tracking-[0.3em] text-ink-3">
                {ts.transcriptEn}
              </span>
            </p>
            <textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={7}
              placeholder={ts.trPh}
              className="mt-1.5 w-full resize-none border border-line bg-bg p-3 text-[13px] leading-relaxed text-ink placeholder:text-ink-3 focus:border-cyan/60 focus:outline-none"
            />
            {interim && (
              <p className="animate-pulse px-1 text-[11px] text-cyan/70">
                {interim}
              </p>
            )}
          </div>

          {error && (
            <p className="mt-3 border border-accent/40 bg-accent-soft px-3 py-2 text-xs text-accent">
              {error}
            </p>
          )}
          {sending && (
            <p className="mt-3 animate-pulse border border-cyan/30 bg-cyan-soft px-3 py-2.5 text-center text-xs font-bold text-cyan">
              {ts.sending}
            </p>
          )}

          <button
            onClick={send}
            disabled={sending || !transcript.trim()}
            className="clip-corner mt-4 w-full border border-gold/40 bg-gold-soft py-3.5 text-sm font-bold tracking-widest text-gold hover:border-gold disabled:opacity-40"
          >
            {sending ? ts.sendingBtn : ts.sendBtn}
          </button>
        </>
      )}

      {stage === "done" && result && (
        <>
          <div className="mt-8 text-center">
            <p className="font-display text-[10px] tracking-[0.4em] text-green">
              SUBMITTED
            </p>
            <h1 className="mt-2 text-lg font-bold">{ts.doneTitle}</h1>
            <p className="mt-1 text-xs text-ink-3">
              {ts.noLabel} {result.student_number}
              {ts.donePost}
            </p>
          </div>
          <div className="mt-6 border border-line bg-surface/80 p-4 text-center">
            <p className="text-[9px] tracking-[0.3em] text-ink-3">
              {ts.yourScore}
            </p>
            <p className="text-glow mt-1 font-display text-4xl font-bold text-ink">
              {result.total}
              <span className="text-base font-medium text-ink-3"> / 40</span>
            </p>
            <div className="mt-3 grid grid-cols-4 gap-1.5">
              {axisKeys.map((key) => (
                <div
                  key={key}
                  className="border border-line bg-bg px-1 py-1.5 text-center"
                >
                  <p className="text-[9px] text-ink-3">{t.result.axes[key]}</p>
                  <p className="font-display text-sm font-bold text-cyan">
                    {result.scores[key]}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 border border-green/40 bg-green-soft p-3.5">
            <p className="text-[10px] font-bold text-green">{ts.goodLabel}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-2">
              {result.good}
            </p>
          </div>
          <div className="mt-3 border border-accent/40 bg-accent-soft p-3.5">
            <p className="text-[10px] font-bold text-accent">{ts.nextLabel}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-2">
              {result.improve}
            </p>
          </div>
          <Link
            href="/school"
            className="clip-corner mt-6 block border border-cyan/30 bg-cyan-soft py-3 text-center text-sm font-bold tracking-widest text-cyan hover:border-cyan/60"
          >
            {ts.backTop}
          </Link>
        </>
      )}
    </main>
  );
}
