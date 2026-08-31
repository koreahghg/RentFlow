import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { RoomFormDialog, DeleteRoomButton } from "@/features/room-manage";
import { ROOM_STATUS_META } from "@/entities/room";
import { getRoomDetail } from "@/entities/room/api";
import { formatCurrency } from "@/shared/lib/format";

export default async function RoomDetailPage({
  params,
}: PageProps<"/rooms/[roomId]">) {
  const { roomId } = await params;

  let detail;
  try {
    detail = await getRoomDetail(roomId);
  } catch {
    notFound();
  }

  const { room, currentTenant, currentContract, currentContractStatus, tenantHistory, status } =
    detail;
  const meta = ROOM_STATUS_META[status];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/rooms"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          호실 관리로
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              {room.floor}층 {room.room_number}호
            </h1>
            <Badge variant="outline" className={meta.badgeClass}>
              {meta.dot} {meta.label}
            </Badge>
          </div>
          <div className="flex gap-2">
            <RoomFormDialog room={room} />
            <DeleteRoomButton roomId={room.id} redirectTo="/rooms" />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">현재 세입자</CardTitle>
        </CardHeader>
        <CardContent>
          {currentTenant ? (
            <div className="grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-muted-foreground">이름</p>
                <Link href={`/tenants/${currentTenant.id}`} className="font-medium hover:underline">
                  {currentTenant.name}
                </Link>
              </div>
              <div>
                <p className="text-muted-foreground">전화번호</p>
                <p className="font-medium">{currentTenant.phone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">입주일</p>
                <p className="font-medium">{currentTenant.move_in_date}</p>
              </div>
              {currentContract && (
                <>
                  <div>
                    <p className="text-muted-foreground">계약 기간</p>
                    <p className="font-medium">
                      {currentContract.start_date} ~ {currentContract.end_date}
                      {currentContractStatus && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({currentContractStatus})
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">월세 / 관리비</p>
                    <p className="font-medium">
                      {formatCurrency(currentContract.monthly_rent)} /{" "}
                      {formatCurrency(currentContract.maintenance_fee)}
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">현재 공실이에요.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">거주 이력</CardTitle>
        </CardHeader>
        <CardContent>
          {tenantHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground">이력이 없어요.</p>
          ) : (
            <ul className="divide-y text-sm">
              {tenantHistory.map((tenant) => (
                <li key={tenant.id} className="flex items-center justify-between py-2">
                  <Link href={`/tenants/${tenant.id}`} className="font-medium hover:underline">
                    {tenant.name}
                  </Link>
                  <span className="text-muted-foreground">
                    {tenant.move_in_date} ~ {tenant.move_out_date ?? "현재"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
