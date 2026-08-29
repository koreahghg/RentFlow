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

  const filters: TenantFilters = {
    search: typeof sp.search === "string" ? sp.search : undefined,
    floor: typeof sp.floor === "string" ? Number(sp.floor) : undefined,
    residentStatus:
      sp.resident === "active" || sp.resident === "moved_out"
        ? (sp.resident as "active" | "moved_out")
        : undefined,
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
            등록된 세입자를 검색하고 관리합니다.
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
