import { Badge } from "@/shared/ui/badge";
import type { ContractDisplayStatus } from "../model/types";

const META: Record<ContractDisplayStatus, { label: string; className: string }> = {
  ACTIVE: { label: "계약중", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  EXPIRING: { label: "만료예정", className: "bg-amber-100 text-amber-700 border-amber-200" },
  EXPIRED: { label: "만료", className: "bg-muted text-muted-foreground border-border" },
  TERMINATED: { label: "종료", className: "bg-red-100 text-red-700 border-red-200" },
};

export function ContractStatusBadge({ status }: { status: ContractDisplayStatus }) {
  const meta = META[status];
  return (
    <Badge variant="outline" className={meta.className}>
      {meta.label}
    </Badge>
  );
}
