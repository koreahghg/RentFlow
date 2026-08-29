"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/shared/api/supabase/server";
import { buildMonthlyScheduleForContract } from "@/entities/payment";

export type ActionResult = { ok: true } | { ok: false; error: string };

const ALLOWED_DOC_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
]);

const tenantContractSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요."),
  phone: z.string().trim().min(1, "전화번호를 입력해주세요."),
  email: z.string().trim().email("이메일 형식이 올바르지 않습니다.").optional().or(z.literal("")),
  birth_date: z.string().optional().or(z.literal("")),
  memo: z.string().optional().or(z.literal("")),
  room_id: z.string().uuid("호실을 선택해주세요."),
  move_in_date: z.string().min(1, "입주일을 입력해주세요."),
  deposit: z.coerce.number().min(0),
  monthly_rent: z.coerce.number().min(0),
  maintenance_fee: z.coerce.number().min(0),
  start_date: z.string().min(1, "계약 시작일을 입력해주세요."),
  end_date: z.string().min(1, "계약 종료일을 입력해주세요."),
});

async function uploadDocumentIfPresent(
  supabase: Awaited<ReturnType<typeof createClient>>,
  contractId: string,
  file: File | null,
) {
  if (!file || file.size === 0) return null;

  if (!ALLOWED_DOC_TYPES.has(file.type)) {
    return { error: "계약서는 PDF, JPG, JPEG, PNG 파일만 업로드할 수 있습니다." };
  }

  const path = `${contractId}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("contracts")
    .upload(path, file, { contentType: file.type });
  if (uploadError) return { error: uploadError.message };

  const { error: insertError } = await supabase.from("contract_documents").insert({
    contract_id: contractId,
    file_name: file.name,
    storage_path: path,
    mime_type: file.type,
  });
  if (insertError) return { error: insertError.message };

  return null;
}

export async function createTenant(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = tenantContractSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    birth_date: formData.get("birth_date"),
    memo: formData.get("memo"),
    room_id: formData.get("room_id"),
    move_in_date: formData.get("move_in_date"),
    deposit: formData.get("deposit"),
    monthly_rent: formData.get("monthly_rent"),
    maintenance_fee: formData.get("maintenance_fee"),
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const data = parsed.data;
  if (data.end_date < data.start_date) {
    return { ok: false, error: "계약 종료일은 시작일 이후여야 합니다." };
  }

  const supabase = await createClient();

  const { data: tenant, error: tenantError } = await supabase
    .from("tenants")
    .insert({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      birth_date: data.birth_date || null,
      memo: data.memo || null,
      room_id: data.room_id,
      move_in_date: data.move_in_date,
      status: "active",
    })
    .select("*")
    .single();

  if (tenantError) {
    if (tenantError.code === "23505") {
      return { ok: false, error: "해당 호실에는 이미 현재 세입자가 등록되어 있습니다." };
    }
    return { ok: false, error: tenantError.message };
  }

  const { data: contract, error: contractError } = await supabase
    .from("contracts")
    .insert({
      tenant_id: tenant.id,
      room_id: data.room_id,
      deposit: data.deposit,
      monthly_rent: data.monthly_rent,
      maintenance_fee: data.maintenance_fee,
      start_date: data.start_date,
      end_date: data.end_date,
      status: "ACTIVE",
      is_renewal: false,
    })
    .select("*")
    .single();

  if (contractError) {
    await supabase.from("tenants").delete().eq("id", tenant.id);
    return { ok: false, error: contractError.message };
  }

  const schedule = buildMonthlyScheduleForContract(data.start_date, data.end_date);
  const totalAmount = data.monthly_rent + data.maintenance_fee;
  const paymentRows = schedule.map((s) => ({
    contract_id: contract.id,
    tenant_id: tenant.id,
    room_id: data.room_id,
    year: s.year,
    month: s.month,
    due_date: s.dueDate,
    monthly_rent: data.monthly_rent,
    maintenance_fee: data.maintenance_fee,
    total_amount: totalAmount,
    status: "PENDING",
  }));

  if (paymentRows.length > 0) {
    const { error: paymentsError } = await supabase.from("payments").insert(paymentRows);
    if (paymentsError) {
      return { ok: false, error: paymentsError.message };
    }
  }

  const file = formData.get("document") as File | null;
  const uploadResult = await uploadDocumentIfPresent(supabase, contract.id, file);
  if (uploadResult?.error) {
    return { ok: false, error: uploadResult.error };
  }

  revalidatePath("/tenants");
  revalidatePath("/rooms");
  revalidatePath("/");
  redirect(`/tenants/${tenant.id}`);
}

const tenantEditSchema = z.object({
  name: z.string().trim().min(1, "이름을 입력해주세요."),
  phone: z.string().trim().min(1, "전화번호를 입력해주세요."),
  email: z.string().trim().email("이메일 형식이 올바르지 않습니다.").optional().or(z.literal("")),
  birth_date: z.string().optional().or(z.literal("")),
  memo: z.string().optional().or(z.literal("")),
  room_id: z.string().uuid().optional().or(z.literal("")),
  move_in_date: z.string().min(1, "입주일을 입력해주세요."),
  move_out_date: z.string().optional().or(z.literal("")),
});

export async function updateTenant(
  tenantId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = tenantEditSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    birth_date: formData.get("birth_date"),
    memo: formData.get("memo"),
    room_id: formData.get("room_id"),
    move_in_date: formData.get("move_in_date"),
    move_out_date: formData.get("move_out_date"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const data = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase
    .from("tenants")
    .update({
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      birth_date: data.birth_date || null,
      memo: data.memo || null,
      room_id: data.room_id || null,
      move_in_date: data.move_in_date,
      move_out_date: data.move_out_date || null,
      status: data.move_out_date ? "moved_out" : "active",
    })
    .eq("id", tenantId);

  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "해당 호실에는 이미 현재 세입자가 등록되어 있습니다." };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/tenants");
  revalidatePath(`/tenants/${tenantId}`);
  revalidatePath("/rooms");
  revalidatePath("/");
  redirect(`/tenants/${tenantId}`);
}

const moveOutSchema = z.object({
  move_out_date: z.string().min(1, "퇴거일을 입력해주세요."),
});

export async function moveOutTenant(
  tenantId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = moveOutSchema.safeParse({ move_out_date: formData.get("move_out_date") });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("tenants")
    .update({ move_out_date: parsed.data.move_out_date, status: "moved_out" })
    .eq("id", tenantId);

  if (error) return { ok: false, error: error.message };

  revalidatePath("/tenants");
  revalidatePath(`/tenants/${tenantId}`);
  revalidatePath("/rooms");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteTenant(tenantId: string): Promise<ActionResult> {
  const supabase = await createClient();

  const { count: contractCount } = await supabase
    .from("contracts")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId);

  if ((contractCount ?? 0) > 0) {
    const { error } = await supabase
      .from("tenants")
      .update({ status: "moved_out" })
      .eq("id", tenantId);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from("tenants").delete().eq("id", tenantId);
    if (error) return { ok: false, error: error.message };
  }

  revalidatePath("/tenants");
  revalidatePath("/rooms");
  revalidatePath("/");
  return { ok: true };
}
