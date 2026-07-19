"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { XIcon } from "@/components/icons";
import {
  createAssignment,
  getAssignment,
  listSubmissions,
  type Assignment,
  type Submission,
  type SubmissionList,
} from "@/lib/school-api";

const axisLabels: [keyof Submission["scores"], string][] = [
  ["logic", "論理"],
  ["persuasion", "説得"],
  ["rebuttal", "反論"],
  ["structure", "構成"],
];

function SubmissionCard({ s }: { s: Submission }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-line bg-surface/80 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="clip-corner flex h-9 w-9 items-center justify-center border border-cyan/40 bg-cyan-soft font-display text-sm font-bold text-cyan">
            {s.student_number}
          </span>
          <div>
            <p className="text-sm font-bold">
              出席番号 {s.student_number} 番
              {s.student_name && (
                <span className="ml-1.5 text-xs font-normal text-ink-2">
                  {s.student_name}
                </span>
              )}
            </p>
            <p className="text-[10px] text-ink-3">
              {new Date(s.submitted_at * 1000).toLocaleTimeString("ja-JP")} 提出
            </p>
          </div>
        </div>
        <span className="font-display text-lg font-bold text-cyan">
          {s.total}
          <span className="text-[10px] font-medium text-ink-3">/40</span>
        </span>
      </div>
      <p className="mt-3 border-l-2 border-cyan/40 pl-3 text-xs leading-relaxed text-ink-2">
        {s.summary}
      </p>
      <div className="mt-3 grid grid-cols-4 gap-1.5">
        {axisLabels.map(([key, label]) => (
          <div
            key={key}
            className="border border-line bg-bg px-2 py-1.5 text-center"
          >
            <p className="text-[9px] text-ink-3">{label}</p>
            <p className="font-display text-sm font-bold">{s.scores[key]}</p>
          </div>
        ))}
      </div>
      <button
        onClick={() => setOpen(!open)}
        className="mt-3 text-[11px] font-bold text-cyan"
      >
        {open ? "▲ 詳細を閉じる" : "▼ フィードバック・発言記録を見る"}
      </button>
      {open && (
        <div className="mt-2 flex flex-col gap-2">
          <div className="border border-green/40 bg-green-soft p-3">
            <p className="text-[10px] font-bold text-green">良かった点</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-2">
              {s.good}
            </p>
          </div>
          <div className="border border-accent/40 bg-accent-soft p-3">
            <p className="text-[10px] font-bold text-accent">改善点</p>
            <p className="mt-1 text-[11px] leading-relaxed text-ink-2">
              {s.improve}
            </p>
          </div>
          <div className="border border-line bg-bg p-3">
            <p className="text-[10px] font-bold text-ink-3">
              発言記録（文字起こし全文）
            </p>
            <p className="mt-1 whitespace-pre-wrap text-[11px] leading-relaxed text-ink-2">
              {s.transcript || "（記録なし）"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TeacherPage() {
  const [theme, setTheme] = useState("");
  const [instructions, setInstructions] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [creating, setCreating] = useState(false);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [inbox, setInbox] = useState<SubmissionList | null>(null);
  const [error, setError] = useState("");
  const [existingCode, setExistingCode] = useState("");
  const [opening, setOpening] = useState(false);

  // 提出のポーリング（5秒間隔）
  useEffect(() => {
    if (!assignment) return;
    let stopped = false;
    const poll = () =>
      listSubmissions(assignment.code)
        .then((d) => !stopped && setInbox(d))
        .catch(() => {});
    poll();
    const iv = setInterval(poll, 5000);
    return () => {
      stopped = true;
      clearInterval(iv);
    };
  }, [assignment]);

  const create = async () => {
    if (!theme.trim() || creating) return;
    setError("");
    setCreating(true);
    try {
      setAssignment(
        await createAssignment(theme.trim(), instructions.trim(), teacherName),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "作成に失敗しました");
    } finally {
      setCreating(false);
    }
  };

  // 既存コードで受信箱を開き直す（タブを閉じてしまった場合の復帰用）
  const openExisting = async () => {
    if (!/^\d{6}$/.test(existingCode.trim()) || opening) return;
    setError("");
    setOpening(true);
    try {
      setAssignment(await getAssignment(existingCode.trim()));
    } catch (e) {
      setError(e instanceof Error ? e.message : "受信箱を開けませんでした");
    } finally {
      setOpening(false);
    }
  };

  return (
    <main className="min-h-dvh px-4 pb-10 pt-5">
      <div className="flex items-center justify-between">
        <Link
          href="/school"
          className="border border-line p-2 text-ink-3 hover:border-gold/60"
        >
          <XIcon className="h-4 w-4" />
        </Link>
        <p className="text-[9px] font-medium tracking-[0.3em] text-gold">
          FOR SCHOOL / TEACHER
        </p>
        <span className="w-8" />
      </div>

      {!assignment ? (
        <>
          <h1 className="mt-6 text-lg font-bold">課題を作成</h1>
          <p className="mt-1 text-xs text-ink-3">
            作成すると6桁の参加コードが発行され、生徒に共有できます
          </p>
          <div className="mt-5 flex flex-col gap-4">
            <label className="block">
              <span className="text-xs font-bold text-ink-2">
                テーマ <span className="text-accent">*</span>
              </span>
              <input
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="例: 日本は救急車を有料化すべきか"
                className="mt-1.5 w-full border border-line bg-bg p-3 text-sm text-ink placeholder:text-ink-3 focus:border-gold/60 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-ink-2">
                指示・補足（任意）
              </span>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                placeholder="例: 班ごとに肯定・否定に分かれて10分間討論。根拠を最低1つ挙げること"
                className="mt-1.5 w-full resize-none border border-line bg-bg p-3 text-sm text-ink placeholder:text-ink-3 focus:border-gold/60 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-ink-2">
                先生の名前（任意）
              </span>
              <input
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                placeholder="例: 田中"
                className="mt-1.5 w-full border border-line bg-bg p-3 text-sm text-ink placeholder:text-ink-3 focus:border-gold/60 focus:outline-none"
              />
            </label>
            {error && (
              <p className="border border-accent/40 bg-accent-soft px-3 py-2 text-xs text-accent">
                {error}
              </p>
            )}
            <button
              onClick={create}
              disabled={!theme.trim() || creating}
              className="clip-corner glow-cyan bg-cyan py-3.5 text-sm font-bold tracking-widest text-[#02131a] hover:bg-primary-hover disabled:opacity-40 disabled:shadow-none"
            >
              {creating ? "作成中…" : "課題を作成してコードを発行"}
            </button>
          </div>

          {/* 既存の受信箱への復帰 */}
          <div className="mt-8 border-t border-line pt-5">
            <p className="text-xs font-bold text-ink-2">
              発行済みのコードで受信箱を開く
            </p>
            <p className="mt-0.5 text-[10px] text-ink-3">
              タブを閉じてしまった場合はこちらから復帰できます
            </p>
            <div className="mt-2.5 flex gap-2">
              <input
                value={existingCode}
                onChange={(e) =>
                  setExistingCode(e.target.value.replace(/\D/g, ""))
                }
                inputMode="numeric"
                maxLength={6}
                placeholder="6桁コード"
                className="w-36 border border-line bg-bg p-2.5 text-center font-display text-sm tracking-[0.2em] text-ink placeholder:tracking-normal placeholder:text-ink-3 focus:border-gold/60 focus:outline-none"
              />
              <button
                onClick={openExisting}
                disabled={!/^\d{6}$/.test(existingCode.trim()) || opening}
                className="clip-corner border border-gold/40 bg-gold-soft px-4 text-xs font-bold text-gold hover:border-gold disabled:opacity-40"
              >
                {opening ? "確認中…" : "受信箱を開く"}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* 参加コード */}
          <div className="mt-6 border border-gold/40 bg-surface/80 p-5 text-center">
            <p className="text-[9px] tracking-[0.3em] text-ink-3">
              参加コード / CLASS CODE
            </p>
            <p className="text-glow mt-2 font-display text-5xl font-bold tracking-[0.15em] text-gold">
              {assignment.code}
            </p>
            <p className="mt-3 text-xs font-bold">{assignment.theme}</p>
            {assignment.instructions && (
              <p className="mt-1 text-[11px] text-ink-2">
                {assignment.instructions}
              </p>
            )}
            <p className="mt-3 text-[10px] text-ink-3">
              生徒に「生徒として参加」からこのコードと出席番号を入力してもらってください
            </p>
          </div>

          {/* 受信箱 */}
          <div className="mt-6 flex items-center justify-between">
            <h2 className="flex items-baseline gap-2 text-sm font-bold">
              提出受信箱
              <span className="text-[8px] font-medium tracking-[0.3em] text-ink-3">
                INBOX
              </span>
            </h2>
            <span className="rounded-full bg-surface-2 px-2.5 py-0.5 font-display text-xs font-bold text-cyan">
              {inbox?.count ?? 0}
            </span>
          </div>
          <p className="mt-1 text-[10px] text-ink-3">
            5秒ごとに自動更新。生徒が「終了して送信」すると届きます
          </p>
          <div className="mt-3 flex flex-col gap-3">
            {inbox && inbox.count > 0 ? (
              inbox.submissions.map((s) => (
                <SubmissionCard key={s.student_number} s={s} />
              ))
            ) : (
              <div className="border border-dashed border-line p-8 text-center text-xs text-ink-3">
                まだ提出はありません
                <br />
                <span className="mt-1 inline-block animate-pulse">
                  受信待機中…
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
