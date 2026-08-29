"use client";

import { useActionState, useEffect, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadContractDocument, type ActionResult } from "@/lib/actions/contracts";

export function DocumentUploader({ contractId }: { contractId: string }) {
  const action = uploadContractDocument.bind(null, contractId);
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Input
        name="document"
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        className="sm:max-w-xs"
        required
      />
      <Button type="submit" size="sm" variant="outline" disabled={pending}>
        <Upload className="size-4" />
        {pending ? "업로드 중..." : "계약서 업로드"}
      </Button>
      {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
