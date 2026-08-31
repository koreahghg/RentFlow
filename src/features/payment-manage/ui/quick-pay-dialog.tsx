"use client";

import { useState, type MouseEvent } from "react";
import { CircleCheck } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { PayForm } from "./pay-form";
import { formatCurrency } from "@/shared/lib/format";
import type { Payment } from "@/entities/payment";

/**
 * 목록(대시보드 미납 현황, 월세 관리 표) 안에서 상세 페이지로 이동하지 않고
 * 바로 납부 완료 처리를 할 수 있게 하는 다이얼로그. 기본값(오늘 날짜·전체 금액)이
 * 이미 채워져 있어 대부분의 경우 확인 버튼 한 번으로 끝난다.
 */
export function QuickPayDialog({
  payment,
  roomLabel,
  tenantName,
}: {
  payment: Payment;
  roomLabel: string;
  tenantName: string;
}) {
  const [open, setOpen] = useState(false);

  function stop(event: MouseEvent) {
    // 이 버튼이 클릭 가능한 표/리스트 행 안에 있을 때, 행 자체의 이동(navigate)을 막는다.
    event.stopPropagation();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" variant="secondary" onClick={stop}>
            <CircleCheck className="size-4" />
            납부 처리
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>납부 처리</DialogTitle>
        </DialogHeader>
        <p className="-mt-2 text-sm text-muted-foreground">
          {roomLabel} · {tenantName} · {payment.year}년 {payment.month}월 ·{" "}
          {formatCurrency(payment.total_amount)}
        </p>
        <PayForm payment={payment} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
