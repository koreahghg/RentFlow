import { FloorGrid } from "@/components/rooms/floor-grid";
import { RoomFormDialog } from "@/components/rooms/room-form-dialog";
import { listRoomsWithStatus } from "@/lib/queries/rooms";

export default async function RoomsPage() {
  const rooms = await listRoomsWithStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">호실 관리</h1>
          <p className="text-sm text-muted-foreground">
            1층부터 4층까지의 모든 호실을 확인하고 관리합니다.
          </p>
        </div>
        <RoomFormDialog />
      </div>

      <FloorGrid rooms={rooms} />
    </div>
  );
}
