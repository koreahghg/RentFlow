import { Badge } from "@/components/ui/badge";
import type { PaymentDisplayStatus } from "@/lib/types";

const META: Record<PaymentDisplayStatus, { label: string; className: string }> = {
  PAID: { label: "납부완료", className: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  PENDING: { label: "납부전", className: "bg-muted text-muted-foreground border-border" },
  OVERDUE: { label: "연체", className: "bg-red-100 text-red-700 border-red-200" },
};

export function PaymentStatusBadge({ status }: { status: PaymentDisplayStatus }) {
  const meta = META[status];
  return (
    <Badge variant="outline" className={meta.className}>
      {meta.label}
    </Badge>
  );
}
