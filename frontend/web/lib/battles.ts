// 対戦結果の保存・取得（Supabase battles テーブル）
import { supabase } from "./supabase";
import type { DebateScore } from "./api";

export type BattleRow = {
  id: string;
  theme: string;
  user_side: "肯定" | "否定";
  level: string | null;
  total: number;
  logic: number;
  persuasion: number;
  rebuttal: number;
  structure: number;
  winner: "user" | "ai" | null;
  created_at: string;
};

// 対戦結果を保存（ログイン中のみ。失敗しても対戦体験は止めない）
export async function saveBattle(userId: string, r: DebateScore): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from("battles").insert({
    user_id: userId,
    theme: r.theme,
    user_side: r.user_side,
    level: r.level ?? null,
    total: r.total,
    logic: r.scores.logic,
    persuasion: r.scores.persuasion,
    rebuttal: r.scores.rebuttal,
    structure: r.scores.structure,
    winner: r.winner,
  });
  if (error) console.warn("battle save failed:", error.message);
}

// 自分の対戦履歴を新しい順で取得（RLSで本人のみ）
export async function getBattles(): Promise<BattleRow[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("battles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("battle fetch failed:", error.message);
    return [];
  }
  return (data as BattleRow[]) ?? [];
}

// 履歴から戦績を集計
export function summarize(battles: BattleRow[]) {
  const total = battles.length;
  const wins = battles.filter((b) => b.winner === "user").length;
  const rate = total > 0 ? Math.round((wins / total) * 100) : null;
  return { total, wins, rate };
}
