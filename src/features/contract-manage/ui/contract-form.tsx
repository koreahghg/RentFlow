"use client";

import { useActionState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Checkbox } from "@/shared/ui/checkbox";
import { updateContract, type ActionResult } from "../api/actions";
import type { Contract } from "@/entities/contract";

export function ContractForm({ contract }: { contract: Contract }) {
  const action = updateContract.bind(null, contract.id);
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="deposit">보증금</Label>
          <Input
            id="deposit"
            name="deposit"
            type="number"
            min={0}
            step={10000}
            defaultValue={contract.deposit}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="monthly_rent">월세</Label>
          <Input
            id="monthly_rent"
            name="monthly_rent"
            type="number"
            min={0}
            step={10000}
            defaultValue={contract.monthly_rent}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maintenance_fee">관리비</Label>
          <Input
            id="maintenance_fee"
            name="maintenance_fee"
            type="number"
            min={0}
            step={10000}
            defaultValue={contract.maintenance_fee}
            required
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="start_date">계약 시작일</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={contract.start_date}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_date">계약 종료일</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            defaultValue={contract.end_date}
            required
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox name="is_renewal" defaultChecked={contract.is_renewal} />
        계약 갱신 여부
      </label>
      {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "저장 중..." : "저장"}
      </Button>
    </form>
  );
}
