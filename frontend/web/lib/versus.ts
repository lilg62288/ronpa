// 対人戦（人 vs 人）: Supabase Realtime + 採点API
import { supabase } from "./supabase";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type VersusSide = "肯定" | "否定";

export type ChatMsg = {
  id: string;
  side: VersusSide;
  name: string;
  text: string;
};

export type VersusScore = {
  scores: { logic: number; persuasion: number; rebuttal: number; structure: number };
  total: number;
  good: string;
  improve: string;
};

export type VersusResult = {
  theme: string;
  language: "ja" | "en";
  winner: VersusSide;
  affirmative: VersusScore;
  negative: VersusScore;
  comment: string;
};

// 6桁の部屋コードを生成
export function makeRoomCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function versusSupported(): boolean {
  return !!supabase;
}

// 採点APIを呼ぶ
export async function scoreVersus(
  theme: string,
  transcript: { side: VersusSide; name: string; text: string }[],
  language: "ja" | "en",
): Promise<VersusResult> {
  const res = await fetch(`${API_BASE}/api/versus/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme, language, transcript }),
  });
  if (!res.ok) {
    const detail = await res
      .json()
      .then((d) => d.detail)
      .catch(() => res.statusText);
    throw new Error(typeof detail === "string" ? detail : "採点に失敗しました");
  }
  return res.json();
}
