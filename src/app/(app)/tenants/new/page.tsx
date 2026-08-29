import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listVacantRooms } from "@/entities/tenant/api";
import { TenantForm } from "@/features/tenant-manage";

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

      <TenantForm rooms={rooms} />
    </div>
  );
}
