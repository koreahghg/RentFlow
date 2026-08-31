import Link from "next/link";
import { ArrowLeft, DoorClosed } from "lucide-react";
import { listVacantRooms } from "@/entities/tenant/api";
import { TenantForm } from "@/features/tenant-manage";
import { Card, CardContent } from "@/shared/ui/card";

export default async function NewTenantPage() {
  const rooms = await listVacantRooms();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/tenants"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          세입자 관리로
        </Link>
        <h1 className="text-2xl font-bold">세입자 등록</h1>
        <p className="text-sm text-muted-foreground">
          개인정보 → 호실 선택 → 계약 정보 → 계약서 업로드 순서로 입력해주세요.
        </p>
      </div>

      {rooms.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <DoorClosed className="size-5" />
            </div>
            <div>
              <p className="font-medium">지금은 빈 호실이 없어요.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                세입자를 등록하려면 먼저 호실이 공실이어야 해요. 퇴거 처리가 필요하면
                호실 관리에서 확인해주세요.
              </p>
            </div>
            <Link
              href="/rooms"
              className="mt-1 text-sm font-medium text-primary hover:underline"
            >
              호실 관리로 이동
            </Link>
          </CardContent>
        </Card>
      ) : (
        <TenantForm rooms={rooms} />
      )}
    </div>
  );
}
