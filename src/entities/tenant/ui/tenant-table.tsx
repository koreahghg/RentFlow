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
import { Badge } from "@/shared/ui/badge";
import { formatCurrency } from "@/shared/lib/format";
import type { TenantListRow } from "../api/queries";

const PAYMENT_BADGE: Record<string, string> = {
  PAID: "bg-emerald-100 text-emerald-700 border-emerald-200",
  PENDING: "bg-muted text-muted-foreground border-border",
  OVERDUE: "bg-red-100 text-red-700 border-red-200",
};

const PAYMENT_LABEL: Record<string, string> = {
  PAID: "납부완료",
  PENDING: "미납",
  OVERDUE: "연체",
};

export function TenantTable({ rows }: { rows: TenantListRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">조건에 맞는 세입자가 없어요.</p>;
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>호실</TableHead>
              <TableHead>세입자명</TableHead>
              <TableHead>전화번호</TableHead>
              <TableHead>입주일</TableHead>
              <TableHead>계약 종료일</TableHead>
              <TableHead>월세</TableHead>
              <TableHead>납부 상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ tenant, room, contract, paymentStatus }) => (
              <TableRowLink key={tenant.id} href={`/tenants/${tenant.id}`}>
                <TableCell>{room ? `${room.room_number}호` : "-"}</TableCell>
                <TableCell className="font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    {tenant.name}
                    {tenant.status === "moved_out" && (
                      <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                        퇴거
                      </Badge>
                    )}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">{tenant.phone}</TableCell>
                <TableCell className="text-muted-foreground">{tenant.move_in_date}</TableCell>
                <TableCell className="text-muted-foreground">{contract?.end_date ?? "-"}</TableCell>
                <TableCell className="font-medium">
                  {contract ? formatCurrency(contract.monthly_rent) : "-"}
                </TableCell>
                <TableCell>
                  {paymentStatus ? (
                    <Badge variant="outline" className={PAYMENT_BADGE[paymentStatus]}>
                      {PAYMENT_LABEL[paymentStatus]}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRowLink>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {rows.map(({ tenant, room, contract, paymentStatus }) => (
          <Link
            key={tenant.id}
            href={`/tenants/${tenant.id}`}
            className="block rounded-xl border border-border p-4 transition-colors active:bg-muted/50"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                {tenant.name}
                {tenant.status === "moved_out" && (
                  <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                    퇴거
                  </Badge>
                )}
              </span>
              {paymentStatus && (
                <Badge variant="outline" className={PAYMENT_BADGE[paymentStatus]}>
                  {PAYMENT_LABEL[paymentStatus]}
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {room ? `${room.room_number}호` : "호실 없음"} · {tenant.phone}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              계약 종료 {contract?.end_date ?? "-"} · 월세{" "}
              {contract ? formatCurrency(contract.monthly_rent) : "-"}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
