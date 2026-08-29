import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaymentStatusBadge } from "@/components/payments/payment-status-badge";
import { formatCurrency, getPaymentDisplayStatus } from "@/lib/domain";
import type { Payment } from "@/lib/types";

export function PaymentHistoryTable({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return <p className="text-sm text-muted-foreground">납부 내역이 없습니다.</p>;
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>연월</TableHead>
              <TableHead>납부예정일</TableHead>
              <TableHead>월세</TableHead>
              <TableHead>관리비</TableHead>
              <TableHead>총 납부금액</TableHead>
              <TableHead>납부일</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell colSpan={7} className="p-0">
                  <Link
                    href={`/payments/${payment.id}`}
                    className="grid grid-cols-7 items-center px-4 py-2.5 hover:bg-muted/50"
                  >
                    <span>
                      {payment.year}년 {payment.month}월
                    </span>
                    <span>{payment.due_date}</span>
                    <span>{formatCurrency(payment.monthly_rent)}</span>
                    <span>{formatCurrency(payment.maintenance_fee)}</span>
                    <span>{formatCurrency(payment.total_amount)}</span>
                    <span>{payment.paid_date ?? "-"}</span>
                    <span>
                      <PaymentStatusBadge status={getPaymentDisplayStatus(payment)} />
                    </span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-2 md:hidden">
        {payments.map((payment) => (
          <Link
            key={payment.id}
            href={`/payments/${payment.id}`}
            className="block rounded-lg border p-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {payment.year}년 {payment.month}월
              </span>
              <PaymentStatusBadge status={getPaymentDisplayStatus(payment)} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatCurrency(payment.total_amount)} · 예정일 {payment.due_date}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
