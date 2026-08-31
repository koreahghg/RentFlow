"use client";

import { useActionState, useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { moveOutTenant, type ActionResult } from "@/features/tenant-manage/api/actions";

export function MoveOutDialog({ tenantId }: { tenantId: string }) {
  const [open, setOpen] = useState(false);
  const action = moveOutTenant.bind(null, tenantId);
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (state?.ok) setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm">
            <LogOut className="size-4" />
            퇴거 처리
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>퇴거 처리</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="move_out_date">퇴거일</Label>
            <Input id="move_out_date" name="move_out_date" type="date" required />
          </div>
          <p className="text-xs text-muted-foreground">
            퇴거 처리하면 호실은 공실로 바뀌고, 기존 계약과 납부 기록은 그대로 남아요.
          </p>
          {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "처리 중..." : "퇴거 처리"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
