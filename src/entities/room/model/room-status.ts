import type { RoomDisplayStatus } from "./types";

export const ROOM_STATUS_META: Record<
  RoomDisplayStatus,
  { label: string; dot: string; badgeClass: string }
> = {
  OCCUPIED: {
    label: "입주중",
    dot: "🟢",
    badgeClass: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  VACANT: {
    label: "공실",
    dot: "⚪",
    badgeClass: "bg-muted text-muted-foreground border-border",
  },
  OVERDUE: {
    label: "미납",
    dot: "🔴",
    badgeClass: "bg-red-100 text-red-700 border-red-200",
  },
  EXPIRING: {
    label: "만료예정",
    dot: "🟡",
    badgeClass: "bg-amber-100 text-amber-700 border-amber-200",
  },
};
