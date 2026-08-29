import { FloorGrid } from "@/widgets/rooms-floor-grid";
import { listRoomsWithStatus } from "@/entities/room/api";

export default async function RoomsPage() {
  const rooms = await listRoomsWithStatus();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">호실 관리</h1>
        <p className="text-sm text-muted-foreground">
          1층부터 4층까지의 모든 호실을 확인하고 관리합니다.
        </p>
      </div>

      <FloorGrid rooms={rooms} />
    </div>
  );
}
