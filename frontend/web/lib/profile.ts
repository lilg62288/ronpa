// プロフィールの保存・取得（Supabase profiles テーブル）
import { supabase } from "./supabase";

export type Profile = {
  name: string;
  age: number | null;
  gender: string; // male | female | other | na | ""
  field: string; // careers | current | business | academia | all | ""
  experience: string; // beginner | casual | experienced | ""
  bio: string;
};

export const emptyProfile: Profile = {
  name: "",
  age: null,
  gender: "",
  field: "",
  experience: "",
  bio: "",
};

// 自分のプロフィールを取得（無ければnull）
export async function getProfile(): Promise<Profile | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("name, age, gender, field, experience, bio")
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
    updated_at: new Date().toISOString(),
  });
  return error?.message ?? null;
}
