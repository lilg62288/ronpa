import Link from "next/link";
import {
  BotIcon,
  ChevronRightIcon,
  SwordsIcon,
  UsersIcon,
} from "@/components/icons";
import { categoryColor, themeBank } from "@/lib/mock";

const modes = [
  {
    href: "/room?mode=ai",
    tag: "1人プレイ",
    title: "AI道場",
    desc: "GPT-4oベースのAIと1対1で対戦。テキスト／音声チャットでいつでも即スタート。",
    Icon: BotIcon,
    iconClass: "bg-gold-soft text-gold",
  },
  {
    href: "/room?mode=random",
    tag: "ランダムマッチ",
    title: "オンライン対戦",
    desc: "全国のユーザーとリアルタイム音声で対人戦。レーティングがかかる真剣勝負。",
    Icon: SwordsIcon,
    iconClass: "bg-accent-soft text-accent",
  },
  {
    href: "/room?mode=group",
    tag: "フレンド / グループ",
    title: "ルーム作成",
    desc: "最大8名のグループディベート。肯定・否定・ジャッジにチーム分けして開催。",
    Icon: UsersIcon,
    iconClass: "bg-blue-soft text-blue",
  },
];

export default function BattlePage() {
  return (
    <main className="px-5 pt-6">
      <h1 className="text-xl font-black">モード選択</h1>
      <p className="mt-1 text-xs text-ink-3">今日はどの流儀で鍛える？</p>

      <div className="mt-5 flex flex-col gap-4">
        {modes.map(({ href, tag, title, desc, Icon, iconClass }) => (
          <Link
            key={title}
            href={href}
            className="rounded-2xl border border-line bg-surface p-5 active:bg-surface-2"
          >
            <div className="flex items-start gap-4">
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
              >
                <Icon className="h-7 w-7" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold tracking-wide text-ink-3">
                  {tag}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-lg font-black">
                  {title}
                  <ChevronRightIcon className="h-4 w-4 text-ink-3" />
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
                  {desc}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* テーマバンク */}
      <section className="mt-8 pb-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-base font-black">テーマバンク</h2>
          <span className="text-[11px] text-ink-3">全162テーマ</span>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {themeBank.map(({ category, count, sample }) => (
            <button
              key={category}
              className="rounded-2xl border border-line bg-surface p-4 text-left active:bg-surface-2"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${categoryColor[category]}`}
                >
                  {category}
                </span>
                <span className="text-[10px] text-ink-3">{count}件</span>
              </div>
              <p className="mt-2 line-clamp-2 text-[11px] leading-snug text-ink-2">
                {sample}
              </p>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
