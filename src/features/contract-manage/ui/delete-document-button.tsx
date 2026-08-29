"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { deleteContractDocument } from "@/features/contract-manage/api/actions";

export function DeleteDocumentButton({ documentId }: { documentId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className="text-destructive"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          const result = await deleteContractDocument(documentId);
          if (!result.ok) {
            toast.error(result.error);
            return;
          }
          toast.success("계약서가 삭제되었습니다.");
        });
      }}
    >
      <Trash2 className="size-4" />
    </Button>
  );
}
