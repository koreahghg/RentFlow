import { FLOORS, RoomCard } from "@/entities/room";
import type { RoomWithStatus } from "@/entities/room/api";

export function FloorGrid({ rooms }: { rooms: RoomWithStatus[] }) {
  const byFloor = new Map<number, RoomWithStatus[]>();
  for (const room of rooms) {
    const list = byFloor.get(room.floor) ?? [];
    list.push(room);
    byFloor.set(room.floor, list);
  }

  return (
    <div className="space-y-6">
      {FLOORS.map((floor) => {
        const floorRooms = byFloor.get(floor) ?? [];
        return (
          <div key={floor}>
            <h3 className="mb-2 text-sm font-semibold text-muted-foreground">
              {floor}층
            </h3>
            {floorRooms.length === 0 ? (
              <p className="text-sm text-muted-foreground">등록된 호실이 없어요.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
                {floorRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
