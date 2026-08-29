import { MonthlySummaryCard } from "@/components/payments/monthly-summary";
import { PaymentFilterBar } from "@/components/payments/payment-filter-bar";
import { PaymentTable } from "@/components/payments/payment-table";
import { getMonthlySummary, listPayments, type PaymentFilters } from "@/lib/queries/payments";

export default async function PaymentsPage({
  searchParams,
}: PageProps<"/payments">) {
  const sp = await searchParams;
  const now = new Date();

  const filters: PaymentFilters = {
    floor: typeof sp.floor === "string" ? Number(sp.floor) : undefined,
    status:
      sp.status === "PENDING" || sp.status === "OVERDUE"
        ? (sp.status as "PENDING" | "OVERDUE")
        : undefined,
  };

  const [summary, rows] = await Promise.all([
    getMonthlySummary(now.getFullYear(), now.getMonth() + 1),
    listPayments(filters),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">월세 관리</h1>
        <p className="text-sm text-muted-foreground">
          전체 월세 납부 내역을 조회하고 처리합니다.
        </p>
      </div>

      <MonthlySummaryCard summary={summary} />
      <PaymentFilterBar />
      <PaymentTable rows={rows} />
    </div>
  );
}
