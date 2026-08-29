export type ContractStatus = "ACTIVE" | "TERMINATED";

// 화면에 표시되는 계산된(파생) 상태 — DB에는 저장하지 않음
export type ContractDisplayStatus =
  | "ACTIVE"
  | "EXPIRING"
  | "EXPIRED"
  | "TERMINATED";

export interface Contract {
  id: string;
  tenant_id: string;
  room_id: string;
  deposit: number;
  monthly_rent: number;
  maintenance_fee: number;
  start_date: string;
  end_date: string;
  status: ContractStatus;
  is_renewal: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContractDocument {
  id: string;
  contract_id: string;
  file_name: string;
  storage_path: string;
  mime_type: string;
  uploaded_at: string;
}
