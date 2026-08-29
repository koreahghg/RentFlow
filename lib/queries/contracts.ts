import { createClient } from "@/lib/supabase/server";
import { getContractDisplayStatus, todayISO } from "@/lib/domain";
import type { Contract, ContractDisplayStatus, ContractDocument, Room, Tenant } from "@/lib/types";

export interface ContractListRow {
  contract: Contract;
  tenant: Tenant | null;
  room: Room | null;
  displayStatus: ContractDisplayStatus;
}

export async function listContracts(): Promise<ContractListRow[]> {
  const supabase = await createClient();
  const today = todayISO();

  const { data: contracts, error } = await supabase
    .from("contracts")
    .select("*")
    .order("start_date", { ascending: false });
  if (error) throw error;

  const tenantIds = [...new Set((contracts ?? []).map((c) => c.tenant_id))];
  const roomIds = [...new Set((contracts ?? []).map((c) => c.room_id))];

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

  return (contracts ?? []).map((contract) => ({
    contract,
    tenant: tenantMap.get(contract.tenant_id) ?? null,
    room: roomMap.get(contract.room_id) ?? null,
    displayStatus: getContractDisplayStatus(contract, today),
  }));
}

export interface ContractDetail {
  contract: Contract;
  tenant: Tenant | null;
  room: Room | null;
  documents: ContractDocument[];
  displayStatus: ContractDisplayStatus;
}

export async function getContractDetail(contractId: string): Promise<ContractDetail> {
  const supabase = await createClient();

  const { data: contract, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", contractId)
    .single();
  if (error) throw error;

  const [{ data: tenant }, { data: room }, { data: documents }] = await Promise.all([
    supabase.from("tenants").select("*").eq("id", contract.tenant_id).maybeSingle(),
    supabase.from("rooms").select("*").eq("id", contract.room_id).maybeSingle(),
    supabase
      .from("contract_documents")
      .select("*")
      .eq("contract_id", contractId)
      .order("uploaded_at", { ascending: false }),
  ]);

  return {
    contract,
    tenant: tenant ?? null,
    room: room ?? null,
    documents: documents ?? [],
    displayStatus: getContractDisplayStatus(contract, todayISO()),
  };
}

export async function getDocumentSignedUrls(document: ContractDocument) {
  const supabase = await createClient();
  const [{ data: viewData }, { data: downloadData }] = await Promise.all([
    supabase.storage.from("contracts").createSignedUrl(document.storage_path, 3600),
    supabase.storage
      .from("contracts")
      .createSignedUrl(document.storage_path, 3600, { download: document.file_name }),
  ]);

  return {
    viewUrl: viewData?.signedUrl ?? null,
    downloadUrl: downloadData?.signedUrl ?? null,
  };
}
