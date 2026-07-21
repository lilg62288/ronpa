import { AuthClient } from "./AuthClient";

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  return <AuthClient initialMode={mode === "login" ? "login" : "signup"} />;
}
