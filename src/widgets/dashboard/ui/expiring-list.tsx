import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import type { ExpiringRow } from "../api/queries";

export function ExpiringList({ rows }: { rows: ExpiringRow[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">계약 만료 예정 (30일 이내)</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">만료 예정인 계약이 없습니다.</p>
        ) : (
          <ul className="divide-y">
            {rows.map(({ contract, tenant, room }) => (
              <li key={contract.id}>
                <Link
                  href={`/tenants/${tenant.id}`}
                  className="flex items-center justify-between gap-3 py-3 text-sm hover:bg-muted/50 -mx-2 px-2 rounded-md"
                >
                  <div className="min-w-0">
                    <p className="font-medium">
                      {room.room_number}호 · {tenant.name}
                    </p>
                  </div>
                  <p className="shrink-0 text-xs font-medium text-amber-600">
                    ~{contract.end_date}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
