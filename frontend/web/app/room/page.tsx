import { RoomClient } from "./RoomClient";

export default async function RoomPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  return <RoomClient mode={mode === "ai" ? "ai" : "group"} />;
}
