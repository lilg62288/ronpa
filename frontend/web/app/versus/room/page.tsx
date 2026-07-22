import { VersusRoomClient } from "./VersusRoomClient";

export default async function VersusRoomPage({
  searchParams,
}: {
  searchParams: Promise<{
    code?: string;
    role?: string;
    name?: string;
    theme?: string;
  }>;
}) {
  const { code, role, name, theme } = await searchParams;
  // 必須パラメータが無ければロビーの案内（クライアントで扱いやすいよう空でも描画）
  return (
    <VersusRoomClient
      code={code ?? ""}
      role={role === "guest" ? "guest" : "host"}
      name={name ?? ""}
      theme={theme ?? ""}
    />
  );
}
