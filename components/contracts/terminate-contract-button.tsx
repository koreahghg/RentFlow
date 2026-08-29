"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { terminateContract } from "@/lib/actions/contracts";

export function TerminateContractButton({ contractId }: { contractId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="outline" size="sm" className="text-destructive">
            <XCircle className="size-4" />
            계약 종료
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>계약을 종료할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            계약 상태가 종료로 변경됩니다. 기존 납부 기록은 그대로 보존됩니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                const result = await terminateContract(contractId);
                if (!result.ok) {
                  toast.error(result.error);
                  return;
                }
                toast.success("계약이 종료 처리되었습니다.");
              });
            }}
          >
            종료
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
