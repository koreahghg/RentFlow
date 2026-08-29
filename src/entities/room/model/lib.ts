import { todayISO } from "@/shared/lib/date";
import { getContractDisplayStatus } from "@/entities/contract/model/lib";
import { getPaymentDisplayStatus } from "@/entities/payment/model/lib";
import type { Contract } from "@/entities/contract/model/types";
import type { Payment } from "@/entities/payment/model/types";
import type { RoomDisplayStatus } from "./types";

export const FLOORS = [1, 2, 3, 4] as const;

/**
 * 호실 상태 계산에 필요한 최소 정보.
 * currentContract/currentMonthPayment는 활성 세입자가 없으면 null.
 */
export function getRoomDisplayStatus(params: {
  hasActiveTenant: boolean;
  currentContract: Pick<Contract, "status" | "end_date"> | null;
  currentMonthPayment: Pick<Payment, "status" | "due_date"> | null;
  today?: string;
}): RoomDisplayStatus {
  const today = params.today ?? todayISO();
  if (!params.hasActiveTenant) return "VACANT";

  if (
    params.currentMonthPayment &&
    getPaymentDisplayStatus(params.currentMonthPayment, today) === "OVERDUE"
  ) {
    return "OVERDUE";
  }

  if (
    params.currentContract &&
    getContractDisplayStatus(params.currentContract, today) === "EXPIRING"
  ) {
    return "EXPIRING";
  }

  return "OCCUPIED";
}
