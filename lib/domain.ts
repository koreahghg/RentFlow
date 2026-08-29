import { differenceInCalendarDays } from "date-fns";
import type {
  Contract,
  ContractDisplayStatus,
  Payment,
  PaymentDisplayStatus,
  RoomDisplayStatus,
} from "@/lib/types";

export const EXPIRING_SOON_DAYS = 30;

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getPaymentDisplayStatus(
  payment: Pick<Payment, "status" | "due_date">,
  today: string = todayISO(),
): PaymentDisplayStatus {
  if (payment.status === "PAID") return "PAID";
  return payment.due_date < today ? "OVERDUE" : "PENDING";
}

export function getContractDisplayStatus(
  contract: Pick<Contract, "status" | "end_date">,
  today: string = todayISO(),
): ContractDisplayStatus {
  if (contract.status === "TERMINATED") return "TERMINATED";
  if (contract.end_date < today) return "EXPIRED";
  const daysLeft = differenceInCalendarDays(
    new Date(contract.end_date),
    new Date(today),
  );
  if (daysLeft <= EXPIRING_SOON_DAYS) return "EXPIRING";
  return "ACTIVE";
}

export function getOverdueDays(
  dueDate: string,
  today: string = todayISO(),
): number {
  return Math.max(
    0,
    differenceInCalendarDays(new Date(today), new Date(dueDate)),
  );
}

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

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("ko-KR").format(Math.round(amount)) + "원";
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return dateStr;
}

/** 계약 기간(start~end) 동안의 월별 (year, month, dueDate) 목록 생성 */
export function buildMonthlyScheduleForContract(
  startDate: string,
  endDate: string,
): { year: number; month: number; dueDate: string }[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayOfMonth = start.getDate();

  const schedule: { year: number; month: number; dueDate: string }[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  const endCursor = new Date(end.getFullYear(), end.getMonth(), 1);

  while (cursor <= endCursor) {
    const year = cursor.getFullYear();
    const month = cursor.getMonth() + 1;
    const lastDayOfMonth = new Date(year, month, 0).getDate();
    const due = new Date(year, month - 1, Math.min(dayOfMonth, lastDayOfMonth));
    schedule.push({
      year,
      month,
      dueDate: due.toISOString().slice(0, 10),
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }

  return schedule;
}

export const FLOORS = [1, 2, 3, 4] as const;
