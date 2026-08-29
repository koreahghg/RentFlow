export type PaymentStatus = "PENDING" | "PAID";
export type PaymentDisplayStatus = "PENDING" | "PAID" | "OVERDUE";

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
