// プロフィールの保存・取得（Supabase profiles テーブル）
import { supabase } from "./supabase";

export type Profile = {
  name: string;
  age: number | null;
  gender: string; // male | female | other | na | ""
  field: string; // careers | current | business | academia | all | ""
  experience: string; // beginner | casual | experienced | ""
  bio: string;
  avatarUrl: string;
};

export const emptyProfile: Profile = {
  name: "",
  age: null,
  gender: "",
  field: "",
  experience: "",
  bio: "",
  avatarUrl: "",
};

const MAX_AVATAR_BYTES = 3 * 1024 * 1024; // 3MB

// アイコン画像をアップロードして公開URLを返す（失敗時はエラーメッセージ）
export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<{ url: string | null; error: string | null }> {
  if (!supabase) return { url: null, error: "認証が設定されていません" };
  if (!file.type.startsWith("image/")) {
    return { url: null, error: "画像ファイルを選んでください" };
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return { url: null, error: "画像サイズは3MB以下にしてください" };
  }
  // ユーザーごとのフォルダに固定名で保存（上書き）
  const path = `${userId}/avatar`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) return { url: null, error: error.message };
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  // 同じURLでもキャッシュを更新させる
  return { url: `${data.publicUrl}?v=${Date.now()}`, error: null };
}

// 自分のプロフィールを取得（無ければnull）
export async function getProfile(): Promise<Profile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("name, age, gender, field, experience, bio, avatar_url")
    .maybeSingle();
  if (error) {
    console.warn("profile fetch failed:", error.message);
    return null;
  }
  if (!data) return null;
  return {
    name: data.name ?? "",
    age: data.age ?? null,
    gender: data.gender ?? "",
    field: data.field ?? "",
    experience: data.experience ?? "",
    bio: data.bio ?? "",
    avatarUrl: data.avatar_url ?? "",
  };
}

// プロフィールを保存（upsert）
export async function saveProfile(
  userId: string,
  p: Profile,
): Promise<string | null> {
  if (!supabase) return "認証が設定されていません";
  const { error } = await supabase.from("profiles").upsert({
    id: userId,
    name: p.name.trim() || null,
    age: p.age,
    gender: p.gender || null,
    field: p.field || null,
    experience: p.experience || null,
    bio: p.bio.trim() || null,
    avatar_url: p.avatarUrl || null,
    updated_at: new Date().toISOString(),
  });
  return error?.message ?? null;
}
