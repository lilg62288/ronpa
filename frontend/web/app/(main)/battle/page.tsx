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
    tag: "SOLO / 1人プレイ",
    title: "AI道場",
    desc: "GPT-4oベースのAIと1対1で対戦。テキスト／音声チャットでいつでも即スタート。",
    Icon: BotIcon,
    iconClass: "border-gold/40 bg-gold-soft text-gold",
  },
  {
    href: "/room?mode=random",
    tag: "RANKED / ランダムマッチ",
    title: "オンライン対戦",
    desc: "全国のユーザーとリアルタイム音声で対人戦。レーティングがかかる真剣勝負。",
    Icon: SwordsIcon,
    iconClass: "border-accent/40 bg-accent-soft text-accent",
  },
  {
    href: "/room?mode=group",
    tag: "CUSTOM / フレンド・グループ",
    title: "ルーム作成",
    desc: "最大8名のグループディベート。肯定・否定・ジャッジにチーム分けして開催。",
    Icon: UsersIcon,
    iconClass: "border-blue/40 bg-blue-soft text-blue",
  },
];

export default function BattlePage() {
  return (
    <main className="px-4 pt-6">
      <h1 className="flex items-baseline gap-2 text-lg font-bold">
        モード選択
        <span className="text-[8px] font-medium tracking-[0.3em] text-ink-3">
          SELECT MODE
        </span>
      </h1>
      <p className="mt-1 text-xs text-ink-3">今日はどの流儀で鍛える？</p>

      <div className="mt-4 flex flex-col gap-3">
        {modes.map(({ href, tag, title, desc, Icon, iconClass }) => (
          <Link
            key={title}
            href={href}
            className="border border-line bg-surface/80 p-4 hover:border-cyan/40"
          >
            <div className="flex items-start gap-3.5">
              <span
                className={`clip-corner flex h-12 w-12 shrink-0 items-center justify-center border ${iconClass}`}
              >
                <Icon className="h-6 w-6" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[8px] font-medium tracking-[0.25em] text-ink-3">
                  {tag}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-base font-bold">
                  {title}
                  <ChevronRightIcon className="h-4 w-4 text-cyan/60" />
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink-2">
                  {desc}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* テーマバンク */}
      <section className="mt-7 pb-4">
        <h2 className="flex items-baseline gap-2 text-sm font-bold">
          テーマバンク
          <span className="text-[8px] font-medium tracking-[0.3em] text-ink-3">
            THEME BANK / 162
          </span>
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {themeBank.map(({ category, count, sample }) => (
            <button
              key={category}
              className="border border-line bg-surface/80 p-3.5 text-left hover:border-cyan/40"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${categoryColor[category]}`}
                >
                  {category}
                </span>
                <span className="font-display text-[10px] text-ink-3">
                  {count}
                </span>
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
