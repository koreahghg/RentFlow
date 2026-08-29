import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/domain";
import type { MonthlySummary } from "@/lib/queries/payments";

export function MonthlySummaryCard({ summary }: { summary: MonthlySummary }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {summary.year}년 {summary.month}월 수입
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
        <div>
          <p className="text-muted-foreground">예상 월세</p>
          <p className="text-lg font-semibold">{formatCurrency(summary.expected)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">납부 완료</p>
          <p className="text-lg font-semibold text-emerald-600">
            {formatCurrency(summary.paid)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">미납 금액</p>
          <p className="text-lg font-semibold text-destructive">
            {formatCurrency(summary.unpaid)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">수납률</p>
          <p className="text-lg font-semibold">{summary.collectionRate.toFixed(1)}%</p>
        </div>
      </CardContent>
    </Card>
  );
}
