import Link from "next/link";
import { cn } from "@/lib/utils";
import { ROOM_STATUS_META } from "@/components/rooms/room-status";
import type { RoomWithStatus } from "@/lib/queries/rooms";

export function RoomCard({ room }: { room: RoomWithStatus }) {
  const meta = ROOM_STATUS_META[room.status];

  return (
    <Link
      href={`/rooms/${room.id}`}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-lg border px-3 py-4 text-center transition-colors hover:shadow-sm",
        meta.badgeClass,
      )}
    >
      <span className="text-sm font-semibold">{room.room_number}호</span>
      <span className="text-xs">
        {meta.dot} {meta.label}
      </span>
      {room.tenant && (
        <span className="max-w-full truncate text-[11px] opacity-80">
          {room.tenant.name}
        </span>
      )}
    </Link>
  );
}
