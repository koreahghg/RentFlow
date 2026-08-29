"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/shared/api/supabase/server";

export type ActionResult = { ok: true } | { ok: false; error: string };

const ALLOWED_DOC_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

export async function uploadContractDocument(
  contractId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const file = formData.get("document") as File | null;
  if (!file || file.size === 0) {
    return { ok: false, error: "파일을 선택해주세요." };
  }
  if (!ALLOWED_DOC_TYPES.has(file.type)) {
    return { ok: false, error: "PDF, JPG, JPEG, PNG 파일만 업로드할 수 있습니다." };
  }

  const supabase = await createClient();
  const path = `${contractId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("contracts")
    .upload(path, file, { contentType: file.type });
  if (uploadError) return { ok: false, error: uploadError.message };

  const { error: insertError } = await supabase.from("contract_documents").insert({
    contract_id: contractId,
    file_name: file.name,
    storage_path: path,
    mime_type: file.type,
  });
  if (insertError) return { ok: false, error: insertError.message };

  revalidatePath("/tenants", "layout");
  revalidatePath("/contracts", "layout");
  return { ok: true };
}

export async function deleteContractDocument(
  documentId: string,
): Promise<ActionResult> {
  const supabase = await createClient();

  const { data: doc, error: fetchError } = await supabase
    .from("contract_documents")
    .select("*")
    .eq("id", documentId)
    .single();
  if (fetchError) return { ok: false, error: fetchError.message };

  await supabase.storage.from("contracts").remove([doc.storage_path]);

  const { error } = await supabase.from("contract_documents").delete().eq("id", documentId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/tenants", "layout");
  revalidatePath("/contracts", "layout");
  return { ok: true };
}

const contractEditSchema = z.object({
  deposit: z.coerce.number().min(0),
  monthly_rent: z.coerce.number().min(0),
  maintenance_fee: z.coerce.number().min(0),
  start_date: z.string().min(1),
  end_date: z.string().min(1),
  is_renewal: z.coerce.boolean(),
});

export async function updateContract(
  contractId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = contractEditSchema.safeParse({
    deposit: formData.get("deposit"),
    monthly_rent: formData.get("monthly_rent"),
    maintenance_fee: formData.get("maintenance_fee"),
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date"),
    is_renewal: formData.get("is_renewal") === "on",
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }
  if (parsed.data.end_date < parsed.data.start_date) {
    return { ok: false, error: "계약 종료일은 시작일 이후여야 합니다." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contracts")
    .update(parsed.data)
    .eq("id", contractId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/contracts", "layout");
  revalidatePath("/tenants", "layout");
  return { ok: true };
}

export async function terminateContract(contractId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contracts")
    .update({ status: "TERMINATED" })
    .eq("id", contractId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/contracts", "layout");
  revalidatePath("/tenants", "layout");
  revalidatePath("/");
  return { ok: true };
}
