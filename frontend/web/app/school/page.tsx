import Link from "next/link";
import { Wordmark } from "@/components/Logo";

export default function SchoolTopPage() {
  return (
    <main className="flex min-h-dvh flex-col justify-center px-6 py-10">
      <div className="text-center">
        <Wordmark className="text-2xl" />
        <p className="mt-2 text-[9px] font-medium tracking-[0.35em] text-gold">
          FOR SCHOOL / 授業向けモード
        </p>
        <p className="mt-6 text-xs leading-relaxed text-ink-2">
          授業内のディベート・ディスカッションを音声認識で記録し、
          <br />
          AIが要約・採点して先生に直接届けます
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
          <p className="mt-1 text-lg font-bold">先生として使う</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
            課題を作成して参加コードを発行。生徒の提出（要約・採点）をリアルタイムで受信
          </p>
        </Link>
        <Link
          href="/school/student"
          className="border border-cyan/40 bg-surface/80 p-5 hover:border-cyan"
        >
          <p className="font-display text-[10px] tracking-[0.25em] text-cyan">
            STUDENT
          </p>
          <p className="mt-1 text-lg font-bold">生徒として参加</p>
          <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
            コードと出席番号で参加。端末を前に置くと発言が記録され、終了時に先生へ送信
          </p>
        </Link>
      </div>
      <p className="mt-8 text-center text-[10px] text-ink-3">
        <Link href="/home" className="text-cyan/70 hover:text-cyan">
          ← 通常モードへ戻る
        </Link>
      </p>
    </main>
  );
}
