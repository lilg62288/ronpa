import { AiRoomClient } from "./AiRoomClient";
import { RoomClient } from "./RoomClient";

export default async function RoomPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; level?: string; side?: string }>;
}) {
  const { mode, level, side } = await searchParams;
  if (mode === "ai") return <AiRoomClient initialLevel={level} initialSide={side} />;
  return <RoomClient mode="group" />;
}
