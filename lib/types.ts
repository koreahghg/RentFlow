export type TenantStatus = "active" | "moved_out";
export type ContractStatus = "ACTIVE" | "TERMINATED";
export type PaymentStatus = "PENDING" | "PAID";

// 화면에 표시되는 계산된(파생) 상태 — DB에는 저장하지 않음
export type ContractDisplayStatus =
  | "ACTIVE"
  | "EXPIRING"
  | "EXPIRED"
  | "TERMINATED";
export type PaymentDisplayStatus = "PENDING" | "PAID" | "OVERDUE";
export type RoomDisplayStatus = "OCCUPIED" | "VACANT" | "OVERDUE" | "EXPIRING";

export interface Room {
  id: string;
  floor: number;
  room_number: string;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  birth_date: string | null;
  memo: string | null;
  room_id: string | null;
  move_in_date: string;
  move_out_date: string | null;
  status: TenantStatus;
  created_at: string;
  updated_at: string;
}

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

export interface Payment {
  id: string;
  contract_id: string;
  tenant_id: string;
  room_id: string;
  year: number;
  month: number;
  due_date: string;
  monthly_rent: number;
  maintenance_fee: number;
  total_amount: number;
  paid_amount: number | null;
  paid_date: string | null;
  memo: string | null;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
}
