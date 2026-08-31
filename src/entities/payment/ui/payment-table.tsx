import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { PaymentStatusBadge } from "./payment-status-badge";
import { formatCurrency } from "@/shared/lib/format";
import type { PaymentRow } from "../api/queries";

export function PaymentTable({ rows }: { rows: PaymentRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">조건에 맞는 내역이 없어요.</p>;
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>연월</TableHead>
              <TableHead>호실</TableHead>
              <TableHead>세입자</TableHead>
              <TableHead>납부예정일</TableHead>
              <TableHead>총 금액</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ payment, tenant, room, displayStatus }) => (
              <TableRow key={payment.id}>
                <TableCell colSpan={6} className="p-0">
                  <Link
                    href={`/payments/${payment.id}`}
                    className="grid grid-cols-6 items-center px-4 py-2.5 hover:bg-muted/50"
                  >
                    <span>
                      {payment.year}년 {payment.month}월
                    </span>
                    <span>{room ? `${room.room_number}호` : "-"}</span>
                    <span>{tenant?.name ?? "-"}</span>
                    <span>{payment.due_date}</span>
                    <span>{formatCurrency(payment.total_amount)}</span>
                    <span>
                      <PaymentStatusBadge status={displayStatus} />
                    </span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-2 md:hidden">
        {rows.map(({ payment, tenant, room, displayStatus }) => (
          <Link
            key={payment.id}
            href={`/payments/${payment.id}`}
            className="block rounded-lg border p-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {room ? `${room.room_number}호` : "-"} · {tenant?.name ?? "-"}
              </span>
              <PaymentStatusBadge status={displayStatus} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {payment.year}년 {payment.month}월 · {formatCurrency(payment.total_amount)}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
