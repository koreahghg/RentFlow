import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/domain";
import type { OverdueRow } from "@/lib/queries/dashboard";

export function OverdueList({ rows }: { rows: OverdueRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">미납 현황</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">미납 세입자가 없습니다.</p>
        ) : (
          <ul className="divide-y">
            {rows.map(({ payment, tenant, room, overdueDays }) => (
              <li key={payment.id}>
                <Link
                  href={`/tenants/${tenant.id}`}
                  className="flex items-center justify-between gap-3 py-3 text-sm hover:bg-muted/50 -mx-2 px-2 rounded-md"
                >
                  <div className="min-w-0">
                    <p className="font-medium">
                      {room.room_number}호 · {tenant.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      납부예정일 {payment.due_date} · 연체 {overdueDays}일
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-destructive">
                      {formatCurrency(payment.total_amount)}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
