import { createClient } from "@/lib/supabase/server";
import {
  getContractDisplayStatus,
  getPaymentDisplayStatus,
  getRoomDisplayStatus,
  todayISO,
} from "@/lib/domain";
import type { Contract, Payment, Room, RoomDisplayStatus, Tenant } from "@/lib/types";

export interface RoomWithStatus extends Room {
  tenant: Tenant | null;
  contract: Contract | null;
  status: RoomDisplayStatus;
}

async function attachStatus(rooms: Room[]): Promise<RoomWithStatus[]> {
  const supabase = await createClient();
  const today = todayISO();

  const { data: tenants } = await supabase
    .from("tenants")
    .select("*")
    .eq("status", "active")
    .in(
      "room_id",
      rooms.map((r) => r.id),
    );

  const tenantsByRoom = new Map((tenants ?? []).map((t) => [t.room_id, t]));

  const tenantIds = (tenants ?? []).map((t) => t.id);
  const { data: contracts } = tenantIds.length
    ? await supabase
        .from("contracts")
        .select("*")
        .eq("status", "ACTIVE")
        .in("tenant_id", tenantIds)
    : { data: [] as Contract[] };

  const contractByTenant = new Map((contracts ?? []).map((c) => [c.tenant_id, c]));

  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const contractIds = (contracts ?? []).map((c) => c.id);
  const { data: payments } = contractIds.length
    ? await supabase
        .from("payments")
        .select("*")
        .eq("year", year)
        .eq("month", month)
        .in("contract_id", contractIds)
    : { data: [] as Payment[] };

  const paymentByContract = new Map((payments ?? []).map((p) => [p.contract_id, p]));

  return rooms.map((room) => {
    const tenant = tenantsByRoom.get(room.id) ?? null;
    const contract = tenant ? contractByTenant.get(tenant.id) ?? null : null;
    const payment = contract ? paymentByContract.get(contract.id) ?? null : null;

    return {
      ...room,
      tenant,
      contract,
      status: getRoomDisplayStatus({
        hasActiveTenant: !!tenant,
        currentContract: contract,
        currentMonthPayment: payment,
        today,
      }),
    };
  });
}

export async function listRoomsWithStatus(): Promise<RoomWithStatus[]> {
  const supabase = await createClient();
  const { data: rooms, error } = await supabase
    .from("rooms")
    .select("*")
    .order("floor", { ascending: true })
    .order("room_number", { ascending: true });

  if (error) throw error;
  return attachStatus(rooms ?? []);
}

export async function getRoomDetail(roomId: string) {
  const supabase = await createClient();
  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .single();
  if (error) throw error;

  const { data: currentTenant } = await supabase
    .from("tenants")
    .select("*")
    .eq("room_id", roomId)
    .eq("status", "active")
    .maybeSingle();

  const { data: tenantHistory } = await supabase
    .from("tenants")
    .select("*")
    .eq("room_id", roomId)
    .order("move_in_date", { ascending: false });

  let currentContract: Contract | null = null;
  if (currentTenant) {
    const { data } = await supabase
      .from("contracts")
      .select("*")
      .eq("tenant_id", currentTenant.id)
      .eq("status", "ACTIVE")
      .maybeSingle();
    currentContract = data ?? null;
  }

  const today = todayISO();
  const status = getRoomDisplayStatus({
    hasActiveTenant: !!currentTenant,
    currentContract,
    currentMonthPayment: null,
    today,
  });

  return {
    room,
    currentTenant: currentTenant ?? null,
    currentContract,
    currentContractStatus: currentContract
      ? getContractDisplayStatus(currentContract, today)
      : null,
    tenantHistory: tenantHistory ?? [],
    status,
  };
}

export async function roomHasDependents(roomId: string) {
  const supabase = await createClient();
  const { count: tenantCount } = await supabase
    .from("tenants")
    .select("id", { count: "exact", head: true })
    .eq("room_id", roomId);

  return { hasDependents: (tenantCount ?? 0) > 0 };
}

export { getPaymentDisplayStatus };
