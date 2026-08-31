import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { SearchFilterBar } from "@/features/tenant-manage";
import { TenantTable } from "@/entities/tenant";
import { listTenants, type TenantFilters } from "@/entities/tenant/api";
import type { ContractDisplayStatus } from "@/entities/contract";
import type { PaymentDisplayStatus } from "@/entities/payment";

export default async function TenantsPage({
  searchParams,
}: PageProps<"/tenants">) {
  const sp = await searchParams;

  // 거주 상태 필터: 값이 아예 없으면(처음 들어온 경우) "입주 중"을 기본으로 보여준다 —
  // 세입자 관리 화면의 핵심은 "지금 누가 살고 있는가"이므로, 퇴거한 세입자까지
  // 뒤섞여 보이는 것을 기본값으로 두지 않는다. "전체"를 명시적으로 고르면 그때만 다 보여준다.
  const residentParam = typeof sp.resident === "string" ? sp.resident : "active";

  const filters: TenantFilters = {
    search: typeof sp.search === "string" ? sp.search : undefined,
    floor: typeof sp.floor === "string" ? Number(sp.floor) : undefined,
    residentStatus:
      residentParam === "moved_out"
        ? "moved_out"
        : residentParam === "all"
          ? undefined
          : "active",
    paymentStatus:
      typeof sp.payment === "string" && sp.payment !== "all"
        ? (sp.payment as PaymentDisplayStatus)
        : undefined,
    contractStatus:
      typeof sp.contract === "string" && sp.contract !== "all"
        ? (sp.contract as ContractDisplayStatus)
        : undefined,
  };

  const rows = await listTenants(filters);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">세입자 관리</h1>
          <p className="text-sm text-muted-foreground">
            등록된 세입자를 검색하고 관리해요.
          </p>
        </div>
        <Button
          render={
            <Link href="/tenants/new">
              <Plus className="size-4" />
              세입자 등록
            </Link>
          }
        />
      </div>

      <SearchFilterBar />
      <TenantTable rows={rows} />
    </div>
  );
}
