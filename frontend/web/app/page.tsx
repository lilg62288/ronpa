import Link from "next/link";
import { HankoMark, Wordmark } from "@/components/Logo";

export default function SplashPage() {
  return (
    <main className="flex min-h-dvh flex-col justify-between px-8 py-12">
      <div />
      <div className="flex flex-col items-center text-center">
        <HankoMark size="lg" />
        <div className="mt-6">
          <Wordmark className="text-5xl" />
        </div>
        <p className="mt-3 text-[10px] font-medium tracking-[0.18em] text-ink-3">
          REALTIME ONLINE NEGOTIATION & PRACTICE ARENA
        </p>
        <p className="mt-8 text-sm font-bold leading-relaxed text-ink-2">
          日本初、リアルタイム対人ディベート × AI採点
          <br />
          論理的思考力と説得力を「実践」で鍛える道場
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Link
          href="/home"
          className="rounded-2xl bg-accent py-4 text-center text-base font-bold text-white shadow-lg shadow-accent/25 active:bg-accent-deep"
        >
          新規登録で始める
        </Link>
        <Link
          href="/home"
          className="rounded-2xl border border-line bg-surface py-4 text-center text-base font-bold text-ink active:bg-surface-2"
        >
          ログイン
        </Link>
        <p className="mt-2 text-center text-[10px] leading-relaxed text-ink-3">
          登録すると
          <span className="underline">利用規約</span>と
          <span className="underline">プライバシーポリシー</span>
          に同意したものとみなされます
        </p>
      </div>
    </main>
  );
}
