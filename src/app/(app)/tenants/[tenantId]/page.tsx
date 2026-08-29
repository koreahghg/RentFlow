import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { MoveOutDialog, DeleteTenantButton } from "@/features/tenant-manage";
import { DocumentList, DocumentUploader } from "@/features/contract-manage";
import { PaymentHistoryTable } from "@/entities/payment";
import { getTenantDetail } from "@/entities/tenant/api";
import { getContractDisplayStatus } from "@/entities/contract";
import { formatCurrency } from "@/shared/lib/format";

export default async function TenantDetailPage({
  params,
}: PageProps<"/tenants/[tenantId]">) {
  const { tenantId } = await params;

  let detail;
  try {
    detail = await getTenantDetail(tenantId);
  } catch {
    notFound();
  }

  const { tenant, room, contracts, documentsByContract, payments } = detail;
  const currentContract = contracts.find((c) => c.status === "ACTIVE") ?? contracts[0] ?? null;

  const recentPayments = payments.slice(0, 6);
  const unpaidPayments = payments.filter((p) => p.status === "PENDING");

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/tenants"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          세입자 관리로
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{tenant.name}</h1>
            <Badge variant="outline">
              {tenant.status === "active" ? "입주 중" : "퇴거"}
            </Badge>
          </div>
          <div className="flex gap-2">
            {tenant.status === "active" && <MoveOutDialog tenantId={tenant.id} />}
            <Button
              variant="outline"
              size="sm"
              render={
                <Link href={`/tenants/${tenant.id}/edit`}>
                  <Pencil className="size-4" />
                  수정
                </Link>
              }
            />
            <DeleteTenantButton tenantId={tenant.id} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">개인정보</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <Field label="이름" value={tenant.name} />
            <Field label="전화번호" value={tenant.phone} />
            <Field label="이메일" value={tenant.email ?? "-"} />
            <Field label="생년월일" value={tenant.birth_date ?? "-"} />
            {tenant.memo && (
              <div className="col-span-2">
                <p className="text-muted-foreground">메모</p>
                <p className="font-medium whitespace-pre-wrap">{tenant.memo}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">거주 정보</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <Field label="층 / 호실" value={room ? `${room.floor}층 ${room.room_number}호` : "-"} />
            <Field label="입주일" value={tenant.move_in_date} />
            <Field label="퇴거일" value={tenant.move_out_date ?? "-"} />
          </CardContent>
        </Card>
      </div>

      {currentContract && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">계약 정보</CardTitle>
            <Link
              href={`/contracts/${currentContract.id}`}
              className="text-sm text-primary hover:underline"
            >
              계약 상세 보기
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <Field label="보증금" value={formatCurrency(currentContract.deposit)} />
              <Field label="월세" value={formatCurrency(currentContract.monthly_rent)} />
              <Field label="관리비" value={formatCurrency(currentContract.maintenance_fee)} />
              <Field
                label="계약 상태"
                value={getContractDisplayStatus(currentContract)}
              />
              <Field label="계약 시작일" value={currentContract.start_date} />
              <Field label="계약 종료일" value={currentContract.end_date} />
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">계약서</p>
              <DocumentList
                documents={documentsByContract.get(currentContract.id) ?? []}
              />
              <div className="mt-3">
                <DocumentUploader contractId={currentContract.id} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            납부 정보 {unpaidPayments.length > 0 && `(미납 ${unpaidPayments.length}건)`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentHistoryTable payments={recentPayments} />
          {payments.length > recentPayments.length && (
            <p className="mt-2 text-xs text-muted-foreground">
              최근 {recentPayments.length}건만 표시됩니다. 전체 내역은 월세 관리에서 확인하세요.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}
