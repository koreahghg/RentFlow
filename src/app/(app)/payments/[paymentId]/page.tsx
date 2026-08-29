import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { PaymentStatusBadge, getOverdueDays } from "@/entities/payment";
import { getPaymentDetail } from "@/entities/payment/api";
import { PayForm } from "@/features/payment-manage";
import { formatCurrency } from "@/shared/lib/format";

export default async function PaymentDetailPage({
  params,
}: PageProps<"/payments/[paymentId]">) {
  const { paymentId } = await params;

  let detail;
  try {
    detail = await getPaymentDetail(paymentId);
  } catch {
    notFound();
  }

  const { payment, tenant, room, displayStatus } = detail;

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link
          href="/payments"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          월세 관리로
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">
            {payment.year}년 {payment.month}월 납부
          </h1>
          <PaymentStatusBadge status={displayStatus} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">납부 정보</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <Field label="호실" value={room ? `${room.floor}층 ${room.room_number}호` : "-"} />
          <Field label="세입자" value={tenant?.name ?? "-"} />
          <Field label="납부예정일" value={payment.due_date} />
          <Field label="월세" value={formatCurrency(payment.monthly_rent)} />
          <Field label="관리비" value={formatCurrency(payment.maintenance_fee)} />
          <Field label="총 납부금액" value={formatCurrency(payment.total_amount)} />
          {displayStatus === "OVERDUE" && (
            <Field label="연체일수" value={`${getOverdueDays(payment.due_date)}일`} />
          )}
          {payment.status === "PAID" && (
            <>
              <Field label="납부일" value={payment.paid_date ?? "-"} />
              <Field label="실제 납부금액" value={formatCurrency(payment.paid_amount ?? 0)} />
              {payment.memo && <Field label="메모" value={payment.memo} />}
            </>
          )}
        </CardContent>
      </Card>

      {payment.status !== "PAID" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">납부 처리</CardTitle>
          </CardHeader>
          <CardContent>
            <PayForm payment={payment} />
          </CardContent>
        </Card>
      )}
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
