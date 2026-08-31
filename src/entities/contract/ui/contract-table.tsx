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
import { ContractStatusBadge } from "./contract-status-badge";
import { formatCurrency } from "@/shared/lib/format";
import type { ContractListRow } from "../api/queries";

export function ContractTable({ rows }: { rows: ContractListRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-muted-foreground">등록된 계약이 없어요.</p>;
  }

  return (
    <>
      <div className="hidden overflow-x-auto rounded-xl border border-border md:block">
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
              <TableRowLink key={contract.id} href={`/contracts/${contract.id}`}>
                <TableCell className="font-medium">
                  {room ? `${room.room_number}호` : "-"}
                </TableCell>
                <TableCell>{tenant?.name ?? "-"}</TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(contract.monthly_rent)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {contract.start_date} ~ {contract.end_date}
                </TableCell>
                <TableCell>
                  <ContractStatusBadge status={displayStatus} />
                </TableCell>
              </TableRowLink>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-2 md:hidden">
        {rows.map(({ contract, tenant, room, displayStatus }) => (
          <Link
            key={contract.id}
            href={`/contracts/${contract.id}`}
            className="block rounded-xl border border-border p-4 transition-colors active:bg-muted/50"
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
