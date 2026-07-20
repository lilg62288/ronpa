// RONPA バックエンドAPIクライアント
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type DebateLevel = "easy" | "normal" | "hard" | "oni";
export type DebateSide = "肯定" | "否定";

export type DebateStart = {
  debate_id: string;
  theme: string;
  category: string;
  user_side: "肯定" | "否定";
  ai_side: "肯定" | "否定";
  level: DebateLevel;
  level_label: string;
  language: "ja" | "en";
  opening: string;
};

export type DebateReply = {
  reply: string;
  ended: boolean;
};

export type DebateScore = {
  theme: string;
  user_side: "肯定" | "否定";
  level?: DebateLevel;
  level_label?: string;
  language?: "ja" | "en";
  scores: {
    logic: number;
    persuasion: number;
    rebuttal: number;
    structure: number;
  };
  total: number;
  good: string;
  improve: string;
  summary: string;
  winner: "user" | "ai";
  turns: number;
};

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res
      .json()
      .then((d) => d.detail)
      .catch(() => res.statusText);
    throw new Error(typeof detail === "string" ? detail : "APIエラー");
  }
  return res.json();
}

export function startDebate(
  level: DebateLevel = "normal",
  side: DebateSide = "肯定",
  language: "ja" | "en" = "ja",
  category?: string,
): Promise<DebateStart> {
  return post("/api/debate/start", {
    category,
    user_side: side,
    level,
    language,
  });
}

export function sendDebateMessage(
  debateId: string,
  message: string,
): Promise<DebateReply> {
  return post("/api/debate/message", { debate_id: debateId, message });
}

export function scoreDebate(debateId: string): Promise<DebateScore> {
  return post("/api/debate/score", { debate_id: debateId });
}

export const RESULT_STORAGE_KEY = "ronpa:lastResult";
