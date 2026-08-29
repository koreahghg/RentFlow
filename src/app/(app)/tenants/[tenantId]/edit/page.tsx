import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTenantDetail, listVacantRooms } from "@/entities/tenant/api";
import { TenantEditForm } from "@/features/tenant-manage";

export default async function EditTenantPage({
  params,
}: PageProps<"/tenants/[tenantId]/edit">) {
  const { tenantId } = await params;

  let tenant;
  try {
    ({ tenant } = await getTenantDetail(tenantId));
  } catch {
    notFound();
  }

  const rooms = await listVacantRooms(tenant.room_id);

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link
          href={`/tenants/${tenantId}`}
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          세입자 상세로
        </Link>
        <h1 className="text-2xl font-bold">세입자 수정</h1>
      </div>

      <TenantEditForm tenant={tenant} rooms={rooms} />
    </div>
  );
}
