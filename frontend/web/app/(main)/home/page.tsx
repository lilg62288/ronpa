import Link from "next/link";
import { HankoMark, Wordmark } from "@/components/Logo";
import { BellIcon, ChevronRightIcon, UsersIcon } from "@/components/icons";
import { categoryColor, newsFeed, publicRooms } from "@/lib/mock";

export default function HomePage() {
  return (
    <main className="px-5 pt-5">
      {/* ヘッダー */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <HankoMark size="sm" />
          <Wordmark className="text-xl" />
        </div>
        <button className="relative rounded-full border border-line bg-surface p-2.5 text-ink-2">
          <BellIcon className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
        </button>
      </header>

      {/* オンライン状況 */}
      <div className="mt-5 flex items-center justify-between rounded-2xl border border-line bg-surface px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute h-full w-full animate-ping rounded-full bg-green opacity-60" />
            <span className="h-2.5 w-2.5 rounded-full bg-green" />
          </span>
          <span className="text-sm font-bold">
            1,284<span className="text-xs text-ink-2">人がオンライン</span>
          </span>
        </div>
        <span className="text-xs text-ink-3">今日の対戦 342件</span>
      </div>

      {/* CTAバナー */}
      <Link
        href="/battle"
        className="mt-4 block rounded-2xl bg-gradient-to-br from-accent to-accent-deep p-5 shadow-lg shadow-accent/20"
      >
        <p className="text-[11px] font-bold text-white/70">DAILY TRAINING</p>
        <p className="mt-1 text-lg font-black text-white">
          AI道場で今すぐ腕試し
        </p>
        <p className="mt-1 text-xs text-white/80">
          GPT-4oと1対1ディベート。無料プランは1日1回まで
        </p>
        <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold text-white">
          対戦を始める <ChevronRightIcon className="h-3.5 w-3.5" />
        </span>
      </Link>

      {/* 公開ルーム */}
      <section className="mt-7">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-black">公開ルーム</h2>
          <Link href="/battle" className="text-xs font-bold text-accent">
            すべて見る
          </Link>
        </div>
        <div className="mt-3 flex flex-col gap-3">
          {publicRooms.map((room) => (
            <div
              key={room.id}
              className="rounded-2xl border border-line bg-surface p-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${categoryColor[room.category]}`}
                >
                  {room.category}
                </span>
                {room.status === "live" ? (
                  <span className="flex items-center gap-1 rounded-md bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                    対戦中
                  </span>
                ) : (
                  <span className="rounded-md bg-green-soft px-2 py-0.5 text-[10px] font-bold text-green">
                    募集中
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm font-bold leading-snug">
                {room.theme}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs text-ink-2">
                  <UsersIcon className="h-4 w-4" />
                  {room.members}/{room.capacity}
                </span>
                <Link
                  href="/room?mode=group"
                  className={`rounded-full px-4 py-1.5 text-xs font-bold ${
                    room.status === "live"
                      ? "border border-line text-ink-2"
                      : "bg-accent text-white"
                  }`}
                >
                  {room.status === "live" ? "観戦する" : "参加する"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ニュース */}
      <section className="mt-7 pb-4">
        <h2 className="text-base font-black">ニュース</h2>
        <div className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
          {newsFeed.map((item) => (
            <button
              key={item.id}
              className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
            >
              <span className="shrink-0 text-[11px] font-bold text-ink-3">
                {item.date}
              </span>
              <span className="flex-1 text-xs font-medium leading-snug text-ink-2">
                {item.title}
              </span>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-ink-3" />
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
