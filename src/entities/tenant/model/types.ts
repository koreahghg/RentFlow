export type TenantStatus = "active" | "moved_out";

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
