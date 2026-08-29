import { createClient } from "@/lib/supabase/server";
import { getContractDisplayStatus, getPaymentDisplayStatus, todayISO } from "@/lib/domain";
import type {
  Contract,
  ContractDisplayStatus,
  ContractDocument,
  Payment,
  PaymentDisplayStatus,
  Room,
  Tenant,
} from "@/lib/types";

export interface TenantFilters {
  search?: string;
  floor?: number;
  residentStatus?: "active" | "moved_out";
  paymentStatus?: PaymentDisplayStatus;
  contractStatus?: ContractDisplayStatus;
}

export interface TenantListRow {
  tenant: Tenant;
  room: Room | null;
  contract: Contract | null;
  contractStatus: ContractDisplayStatus | null;
  paymentStatus: PaymentDisplayStatus | null;
}

export async function listTenants(filters: TenantFilters = {}): Promise<TenantListRow[]> {
  const supabase = await createClient();
  const today = todayISO();

  let query = supabase.from("tenants").select("*").order("created_at", { ascending: false });

  if (filters.residentStatus === "active") query = query.eq("status", "active");
  if (filters.residentStatus === "moved_out") query = query.eq("status", "moved_out");

  const { data: tenants, error } = await query;
  if (error) throw error;

  let rows = tenants ?? [];

  const roomIds = [...new Set(rows.map((t) => t.room_id).filter(Boolean))] as string[];
  const { data: rooms } = roomIds.length
    ? await supabase.from("rooms").select("*").in("id", roomIds)
    : { data: [] as Room[] };
  const roomMap = new Map((rooms ?? []).map((r) => [r.id, r]));

  if (filters.search) {
    const term = filters.search.trim().toLowerCase();
    if (term) {
      rows = rows.filter(
        (t) =>
          t.name.toLowerCase().includes(term) ||
          t.phone.includes(term) ||
          (t.room_id && roomMap.get(t.room_id)?.room_number.toLowerCase().includes(term)),
      );
    }
  }

  if (filters.floor) {
    rows = rows.filter((t) => t.room_id && roomMap.get(t.room_id)?.floor === filters.floor);
  }

  const tenantIds = rows.map((t) => t.id);
  const { data: contracts } = tenantIds.length
    ? await supabase
        .from("contracts")
        .select("*")
        .in("tenant_id", tenantIds)
        .order("start_date", { ascending: false })
    : { data: [] as Contract[] };

  const activeContractByTenant = new Map<string, Contract>();
  for (const contract of contracts ?? []) {
    if (contract.status === "ACTIVE" && !activeContractByTenant.has(contract.tenant_id)) {
      activeContractByTenant.set(contract.tenant_id, contract);
    }
  }

  const contractIds = [...activeContractByTenant.values()].map((c) => c.id);
  const now = new Date();
  const { data: payments } = contractIds.length
    ? await supabase
        .from("payments")
        .select("*")
        .in("contract_id", contractIds)
        .eq("year", now.getFullYear())
        .eq("month", now.getMonth() + 1)
    : { data: [] as Payment[] };
  const paymentByContract = new Map((payments ?? []).map((p) => [p.contract_id, p]));

  let result: TenantListRow[] = rows.map((tenant) => {
    const contract = tenant.room_id ? activeContractByTenant.get(tenant.id) ?? null : null;
    const payment = contract ? paymentByContract.get(contract.id) ?? null : null;
    return {
      tenant,
      room: tenant.room_id ? roomMap.get(tenant.room_id) ?? null : null,
      contract,
      contractStatus: contract ? getContractDisplayStatus(contract, today) : null,
      paymentStatus: payment ? getPaymentDisplayStatus(payment, today) : null,
    };
  });

  if (filters.contractStatus) {
    result = result.filter((r) => r.contractStatus === filters.contractStatus);
  }
  if (filters.paymentStatus) {
    result = result.filter((r) => r.paymentStatus === filters.paymentStatus);
  }

  return result;
}

export interface TenantDetail {
  tenant: Tenant;
  room: Room | null;
  contracts: Contract[];
  documentsByContract: Map<string, ContractDocument[]>;
  payments: Payment[];
}

export async function getTenantDetail(tenantId: string): Promise<TenantDetail> {
  const supabase = await createClient();

  const { data: tenant, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", tenantId)
    .single();
  if (error) throw error;

  const { data: room } = tenant.room_id
    ? await supabase.from("rooms").select("*").eq("id", tenant.room_id).maybeSingle()
    : { data: null };

  const { data: contracts } = await supabase
    .from("contracts")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("start_date", { ascending: false });

  const contractIds = (contracts ?? []).map((c) => c.id);

  const { data: documents } = contractIds.length
    ? await supabase
        .from("contract_documents")
        .select("*")
        .in("contract_id", contractIds)
        .order("uploaded_at", { ascending: false })
    : { data: [] as ContractDocument[] };

  const documentsByContract = new Map<string, ContractDocument[]>();
  for (const doc of documents ?? []) {
    const list = documentsByContract.get(doc.contract_id) ?? [];
    list.push(doc);
    documentsByContract.set(doc.contract_id, list);
  }

  const { data: payments } = contractIds.length
    ? await supabase
        .from("payments")
        .select("*")
        .in("contract_id", contractIds)
        .order("year", { ascending: false })
        .order("month", { ascending: false })
    : { data: [] as Payment[] };

  return {
    tenant,
    room: room ?? null,
    contracts: contracts ?? [],
    documentsByContract,
    payments: payments ?? [],
  };
}

export async function listVacantRooms(currentRoomId?: string | null): Promise<Room[]> {
  const supabase = await createClient();
  const { data: rooms } = await supabase
    .from("rooms")
    .select("*")
    .order("floor", { ascending: true })
    .order("room_number", { ascending: true });

  const { data: activeTenants } = await supabase
    .from("tenants")
    .select("room_id")
    .eq("status", "active");

  const occupiedRoomIds = new Set(
    (activeTenants ?? []).map((t) => t.room_id).filter(Boolean),
  );

  return (rooms ?? []).filter(
    (room) => !occupiedRoomIds.has(room.id) || room.id === currentRoomId,
  );
}
