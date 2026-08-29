"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { markPaymentPaid, type ActionResult } from "@/lib/actions/payments";
import { todayISO } from "@/lib/domain";
import type { Payment } from "@/lib/types";

export function PayForm({ payment }: { payment: Payment }) {
  const action = markPaymentPaid.bind(null, payment.id);
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="paid_date">납부일</Label>
          <Input
            id="paid_date"
            name="paid_date"
            type="date"
            defaultValue={todayISO()}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="paid_amount">납부 금액</Label>
          <Input
            id="paid_amount"
            name="paid_amount"
            type="number"
            min={0}
            step={1000}
            defaultValue={payment.total_amount}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="memo">메모</Label>
        <Textarea id="memo" name="memo" rows={2} />
      </div>
      {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "처리 중..." : "납부 완료 처리"}
      </Button>
    </form>
  );
}
