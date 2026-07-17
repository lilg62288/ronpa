import Link from "next/link";
import { LogoMark, Wordmark } from "@/components/Logo";

export default function SplashPage() {
  return (
    <main className="flex min-h-dvh flex-col justify-between px-8 py-12">
      <p className="text-center text-[9px] tracking-[0.4em] text-ink-3">
        SYSTEM ONLINE
      </p>
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
          日本初、リアルタイム対人ディベート × AI採点
          <br />
          論理的思考力と説得力を「実践」で鍛える道場
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <Link
          href="/home"
          className="clip-corner glow-cyan bg-cyan py-3.5 text-center text-sm font-bold tracking-widest text-[#02131a] hover:bg-primary-hover"
        >
          新規登録で始める
        </Link>
        <Link
          href="/home"
          className="clip-corner border border-cyan/30 bg-cyan-soft py-3.5 text-center text-sm font-bold tracking-widest text-cyan hover:border-cyan/60"
        >
          ログイン
        </Link>
        <p className="mt-2 text-center text-[10px] leading-relaxed text-ink-3">
          登録すると
          <span className="text-cyan/80">利用規約</span>と
          <span className="text-cyan/80">プライバシーポリシー</span>
          に同意したものとみなされます
        </p>
      </div>
    </main>
  );
}
