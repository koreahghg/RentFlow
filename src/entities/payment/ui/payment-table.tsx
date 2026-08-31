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
import type { PaymentRow } from "../api/queries";
import type { ReactNode } from "react";

export function PaymentTable({
  rows,
  actionSlot,
}: {
  rows: PaymentRow[];
  /** 미납/연체 건의 표 행에 "납부 처리" 등 빠른 액션을 끼워 넣기 위한 슬롯 (feature 계층 의존을 피하기 위한 주입 지점) */
  actionSlot?: (row: PaymentRow) => ReactNode;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">조건에 맞는 내역이 없어요.</p>;
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>연월</TableHead>
              <TableHead>호실</TableHead>
              <TableHead>세입자</TableHead>
              <TableHead>납부예정일</TableHead>
              <TableHead>총 금액</TableHead>
              <TableHead>상태</TableHead>
              {actionSlot && <TableHead className="text-right">처리</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => {
              const { payment, tenant, room, displayStatus } = row;
              return (
                <TableRowLink key={payment.id} href={`/payments/${payment.id}`}>
                  <TableCell>
                    {payment.year}년 {payment.month}월
                  </TableCell>
                  <TableCell className="font-medium">
                    {room ? `${room.room_number}호` : "-"}
                  </TableCell>
                  <TableCell>{tenant?.name ?? "-"}</TableCell>
                  <TableCell className="text-muted-foreground">{payment.due_date}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(payment.total_amount)}
                  </TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={displayStatus} />
                  </TableCell>
                  {actionSlot && (
                    <TableCell className="text-right">{actionSlot(row)}</TableCell>
                  )}
                </TableRowLink>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-2 md:hidden">
        {rows.map((row) => {
          const { payment, tenant, room, displayStatus } = row;
          return (
            <Link
              key={payment.id}
              href={`/payments/${payment.id}`}
              className="block rounded-xl border border-border p-4 transition-colors active:bg-muted/50"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {room ? `${room.room_number}호` : "-"} · {tenant?.name ?? "-"}
                </span>
                <PaymentStatusBadge status={displayStatus} />
              </div>
              <div className="mt-1 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {payment.year}년 {payment.month}월 · {formatCurrency(payment.total_amount)}
                </p>
                {actionSlot && <div>{actionSlot(row)}</div>}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
