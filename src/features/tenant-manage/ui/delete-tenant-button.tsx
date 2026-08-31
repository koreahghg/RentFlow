"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
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
} from "@/shared/ui/alert-dialog";
import { deleteTenant } from "@/features/tenant-manage/api/actions";

export function DeleteTenantButton({ tenantId }: { tenantId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="ghost" size="sm" className="text-destructive">
            <Trash2 className="size-4" />
            삭제
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>세입자를 삭제할까요?</AlertDialogTitle>
          <AlertDialogDescription>
            계약 또는 납부 이력이 있는 세입자는 실제로 삭제되지 않고 &quot;퇴거&quot; 상태로
            바뀌어요. 이력이 없는 경우에만 완전히 삭제돼요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            onClick={() => {
              startTransition(async () => {
                const result = await deleteTenant(tenantId);
                if (!result.ok) {
                  toast.error(result.error);
                  return;
                }
                toast.success("처리했어요.");
                router.push("/tenants");
              });
            }}
          >
            삭제
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
