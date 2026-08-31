import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { TableRowLink } from "@/shared/ui/table-row-link";
import { PaymentStatusBadge } from "./payment-status-badge";
import { formatCurrency } from "@/shared/lib/format";
import { getPaymentDisplayStatus } from "../model/lib";
import type { Payment } from "../model/types";

export function PaymentHistoryTable({ payments }: { payments: Payment[] }) {
  if (payments.length === 0) {
    return <p className="text-sm text-muted-foreground">납부 내역이 없어요.</p>;
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
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
              <TableRowLink key={payment.id} href={`/payments/${payment.id}`}>
                <TableCell>
                  {payment.year}년 {payment.month}월
                </TableCell>
                <TableCell className="text-muted-foreground">{payment.due_date}</TableCell>
                <TableCell>{formatCurrency(payment.monthly_rent)}</TableCell>
                <TableCell>{formatCurrency(payment.maintenance_fee)}</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(payment.total_amount)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {payment.paid_date ?? "-"}
                </TableCell>
                <TableCell>
                  <PaymentStatusBadge status={getPaymentDisplayStatus(payment)} />
                </TableCell>
              </TableRowLink>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-2 md:hidden">
        {payments.map((payment) => (
          <Link
            key={payment.id}
            href={`/payments/${payment.id}`}
            className="block rounded-xl border border-border p-4 transition-colors active:bg-muted/50"
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
