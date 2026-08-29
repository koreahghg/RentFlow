import { createClient } from "@/lib/supabase/server";
import { EXPIRING_SOON_DAYS, getOverdueDays, todayISO } from "@/lib/domain";
import type { Contract, Payment, Room, Tenant } from "@/lib/types";
import { addDays } from "date-fns";

export interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  vacantRooms: number;
  totalTenants: number;
  monthlyIncome: number;
  overdueCount: number;
  overdueAmount: number;
}

export interface OverdueRow {
  payment: Payment;
  tenant: Tenant;
  room: Room;
  overdueDays: number;
}

export interface ExpiringRow {
  contract: Contract;
  tenant: Tenant;
  room: Room;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();
  const today = todayISO();
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;

  const { count: totalRooms } = await supabase
    .from("rooms")
    .select("id", { count: "exact", head: true });

  const { count: totalTenants } = await supabase
    .from("tenants")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");

  const { data: monthPayments } = await supabase
    .from("payments")
    .select("*")
    .eq("year", year)
    .eq("month", month);

  const paid = (monthPayments ?? []).filter((p) => p.status === "PAID");
  const overdue = (monthPayments ?? []).filter(
    (p) => p.status === "PENDING" && p.due_date < today,
  );

  const monthlyIncome = paid.reduce((sum, p) => sum + Number(p.paid_amount ?? p.total_amount), 0);
  const overdueAmount = overdue.reduce((sum, p) => sum + Number(p.total_amount), 0);

  const { count: occupiedCount } = await supabase
    .from("tenants")
    .select("room_id", { count: "exact", head: true })
    .eq("status", "active")
    .not("room_id", "is", null);

  return {
    totalRooms: totalRooms ?? 0,
    occupiedRooms: occupiedCount ?? 0,
    vacantRooms: (totalRooms ?? 0) - (occupiedCount ?? 0),
    totalTenants: totalTenants ?? 0,
    monthlyIncome,
    overdueCount: overdue.length,
    overdueAmount,
  };
}

export async function getOverduePayments(): Promise<OverdueRow[]> {
  const supabase = await createClient();
  const today = todayISO();

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("status", "PENDING")
    .lt("due_date", today)
    .order("due_date", { ascending: true });

  if (!payments || payments.length === 0) return [];

  const tenantIds = [...new Set(payments.map((p) => p.tenant_id))];
  const roomIds = [...new Set(payments.map((p) => p.room_id))];

  const [{ data: tenants }, { data: rooms }] = await Promise.all([
    supabase.from("tenants").select("*").in("id", tenantIds),
    supabase.from("rooms").select("*").in("id", roomIds),
  ]);

  const tenantMap = new Map((tenants ?? []).map((t) => [t.id, t]));
  const roomMap = new Map((rooms ?? []).map((r) => [r.id, r]));

  return payments
    .map((payment) => {
      const tenant = tenantMap.get(payment.tenant_id);
      const room = roomMap.get(payment.room_id);
      if (!tenant || !room) return null;
      return {
        payment,
        tenant,
        room,
        overdueDays: getOverdueDays(payment.due_date, today),
      };
    })
    .filter((row): row is OverdueRow => row !== null);
}

export async function getExpiringContracts(): Promise<ExpiringRow[]> {
  const supabase = await createClient();
  const today = todayISO();
  const limit = addDays(new Date(today), EXPIRING_SOON_DAYS)
    .toISOString()
    .slice(0, 10);

  const { data: contracts } = await supabase
    .from("contracts")
    .select("*")
    .eq("status", "ACTIVE")
    .gte("end_date", today)
    .lte("end_date", limit)
    .order("end_date", { ascending: true });

  if (!contracts || contracts.length === 0) return [];

  const tenantIds = [...new Set(contracts.map((c) => c.tenant_id))];
  const roomIds = [...new Set(contracts.map((c) => c.room_id))];

  const [{ data: tenants }, { data: rooms }] = await Promise.all([
    supabase.from("tenants").select("*").in("id", tenantIds),
    supabase.from("rooms").select("*").in("id", roomIds),
  ]);

  const tenantMap = new Map((tenants ?? []).map((t) => [t.id, t]));
  const roomMap = new Map((rooms ?? []).map((r) => [r.id, r]));

  return contracts
    .map((contract) => {
      const tenant = tenantMap.get(contract.tenant_id);
      const room = roomMap.get(contract.room_id);
      if (!tenant || !room) return null;
      return { contract, tenant, room };
    })
    .filter((row): row is ExpiringRow => row !== null);
}
