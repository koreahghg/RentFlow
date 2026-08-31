import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
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
      <div className="hidden overflow-x-auto rounded-lg border md:block">
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
              <TableRow key={tenant.id} className="cursor-pointer">
                <TableCell colSpan={7} className="p-0">
                  <Link
                    href={`/tenants/${tenant.id}`}
                    className="grid grid-cols-7 items-center px-4 py-3 hover:bg-muted/50"
                  >
                    <span>{room ? `${room.room_number}호` : "-"}</span>
                    <span className="font-medium">{tenant.name}</span>
                    <span>{tenant.phone}</span>
                    <span>{tenant.move_in_date}</span>
                    <span>{contract?.end_date ?? "-"}</span>
                    <span>{contract ? formatCurrency(contract.monthly_rent) : "-"}</span>
                    <span>
                      {paymentStatus ? (
                        <Badge variant="outline" className={PAYMENT_BADGE[paymentStatus]}>
                          {PAYMENT_LABEL[paymentStatus]}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 md:hidden">
        {rows.map(({ tenant, room, contract, paymentStatus }) => (
          <Link
            key={tenant.id}
            href={`/tenants/${tenant.id}`}
            className="block rounded-lg border p-4"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold">{tenant.name}</span>
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
