"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, SwordsIcon, UserIcon } from "./icons";

const items = [
  { href: "/home", label: "ホーム", Icon: HomeIcon },
  { href: "/battle", label: "対戦", Icon: SwordsIcon },
  { href: "/mypage", label: "マイページ", Icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 border-t border-line bg-surface/90 backdrop-blur">
      <div className="grid grid-cols-3">
        {items.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex flex-col items-center gap-1 py-2.5 text-[10px] font-bold ${
                active ? "text-cyan" : "text-ink-3"
              }`}
            >
              {active && (
                <span className="glow-cyan absolute top-0 h-0.5 w-10 rounded-full bg-cyan" />
              )}
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
