export type RoomDisplayStatus = "OCCUPIED" | "VACANT" | "OVERDUE" | "EXPIRING";

export interface Room {
  id: string;
  floor: number;
  room_number: string;
  created_at: string;
  updated_at: string;
}
