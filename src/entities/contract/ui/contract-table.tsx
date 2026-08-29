import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { ContractStatusBadge } from "./contract-status-badge";
import { formatCurrency } from "@/shared/lib/format";
import type { ContractListRow } from "../api/queries";

export function ContractTable({ rows }: { rows: ContractListRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">등록된 계약이 없습니다.</p>;
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-lg border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>호실</TableHead>
              <TableHead>세입자</TableHead>
              <TableHead>월세</TableHead>
              <TableHead>계약 기간</TableHead>
              <TableHead>상태</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map(({ contract, tenant, room, displayStatus }) => (
              <TableRow key={contract.id}>
                <TableCell colSpan={5} className="p-0">
                  <Link
                    href={`/contracts/${contract.id}`}
                    className="grid grid-cols-5 items-center px-4 py-2.5 hover:bg-muted/50"
                  >
                    <span>{room ? `${room.room_number}호` : "-"}</span>
                    <span>{tenant?.name ?? "-"}</span>
                    <span>{formatCurrency(contract.monthly_rent)}</span>
                    <span>
                      {contract.start_date} ~ {contract.end_date}
                    </span>
                    <span>
                      <ContractStatusBadge status={displayStatus} />
                    </span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-2 md:hidden">
        {rows.map(({ contract, tenant, room, displayStatus }) => (
          <Link
            key={contract.id}
            href={`/contracts/${contract.id}`}
            className="block rounded-lg border p-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {room ? `${room.room_number}호` : "-"} · {tenant?.name ?? "-"}
              </span>
              <ContractStatusBadge status={displayStatus} />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {contract.start_date} ~ {contract.end_date} · {formatCurrency(contract.monthly_rent)}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
