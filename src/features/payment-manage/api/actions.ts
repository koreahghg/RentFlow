"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/shared/api/supabase/server";

export type ActionResult = { ok: true } | { ok: false; error: string };

const paySchema = z.object({
  paid_date: z.string().min(1, "납부일을 입력해주세요."),
  paid_amount: z.coerce.number().min(0, "납부 금액을 입력해주세요."),
  memo: z.string().optional().or(z.literal("")),
});

export async function markPaymentPaid(
  paymentId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = paySchema.safeParse({
    paid_date: formData.get("paid_date"),
    paid_amount: formData.get("paid_amount"),
    memo: formData.get("memo"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("payments")
    .update({
      status: "PAID",
      paid_date: parsed.data.paid_date,
      paid_amount: parsed.data.paid_amount,
      memo: parsed.data.memo || null,
    })
    .eq("id", paymentId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/payments", "layout");
  revalidatePath("/tenants", "layout");
  revalidatePath("/");
  return { ok: true };
}
