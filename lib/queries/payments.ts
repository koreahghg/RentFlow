import { createClient } from "@/lib/supabase/server";
import { getPaymentDisplayStatus, todayISO } from "@/lib/domain";
import type { Payment, PaymentDisplayStatus, Room, Tenant } from "@/lib/types";

export interface PaymentFilters {
  floor?: number;
  status?: "PENDING" | "OVERDUE";
}

export interface PaymentRow {
  payment: Payment;
  tenant: Tenant | null;
  room: Room | null;
  displayStatus: PaymentDisplayStatus;
}

export async function listPayments(filters: PaymentFilters = {}): Promise<PaymentRow[]> {
  const supabase = await createClient();
  const today = todayISO();

  const { data: payments, error } = await supabase
    .from("payments")
    .select("*")
    .order("year", { ascending: false })
    .order("month", { ascending: false });
  if (error) throw error;

  const tenantIds = [...new Set((payments ?? []).map((p) => p.tenant_id))];
  const roomIds = [...new Set((payments ?? []).map((p) => p.room_id))];

  const [{ data: tenants }, { data: rooms }] = await Promise.all([
    tenantIds.length
      ? supabase.from("tenants").select("*").in("id", tenantIds)
      : Promise.resolve({ data: [] as Tenant[] }),
    roomIds.length
      ? supabase.from("rooms").select("*").in("id", roomIds)
      : Promise.resolve({ data: [] as Room[] }),
  ]);

  const tenantMap = new Map((tenants ?? []).map((t) => [t.id, t]));
  const roomMap = new Map((rooms ?? []).map((r) => [r.id, r]));

  let rows: PaymentRow[] = (payments ?? []).map((payment) => {
    const room = roomMap.get(payment.room_id) ?? null;
    return {
      payment,
      tenant: tenantMap.get(payment.tenant_id) ?? null,
      room,
      displayStatus: getPaymentDisplayStatus(payment, today),
    };
  });

  if (filters.floor) {
    rows = rows.filter((r) => r.room?.floor === filters.floor);
  }
  if (filters.status) {
    rows = rows.filter((r) => r.displayStatus === filters.status);
  }

  return rows;
}

export interface PaymentDetail {
  payment: Payment;
  tenant: Tenant | null;
  room: Room | null;
  displayStatus: PaymentDisplayStatus;
}

export async function getPaymentDetail(paymentId: string): Promise<PaymentDetail> {
  const supabase = await createClient();
  const { data: payment, error } = await supabase
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .single();
  if (error) throw error;

  const [{ data: tenant }, { data: room }] = await Promise.all([
    supabase.from("tenants").select("*").eq("id", payment.tenant_id).maybeSingle(),
    supabase.from("rooms").select("*").eq("id", payment.room_id).maybeSingle(),
  ]);

  return {
    payment,
    tenant: tenant ?? null,
    room: room ?? null,
    displayStatus: getPaymentDisplayStatus(payment, todayISO()),
  };
}

export interface MonthlySummary {
  year: number;
  month: number;
  expected: number;
  paid: number;
  unpaid: number;
  collectionRate: number;
}

export async function getMonthlySummary(
  year: number,
  month: number,
): Promise<MonthlySummary> {
  const supabase = await createClient();
  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("year", year)
    .eq("month", month);

  const rows = payments ?? [];
  const expected = rows.reduce((sum, p) => sum + Number(p.total_amount), 0);
  const paid = rows
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + Number(p.paid_amount ?? p.total_amount), 0);
  const unpaid = expected - paid;
  const collectionRate = expected > 0 ? (paid / expected) * 100 : 0;

  return { year, month, expected, paid, unpaid, collectionRate };
}
