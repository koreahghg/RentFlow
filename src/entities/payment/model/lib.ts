import { differenceInCalendarDays } from "date-fns";
import { todayISO } from "@/shared/lib/date";
import type { Payment, PaymentDisplayStatus } from "./types";

export function getPaymentDisplayStatus(
  payment: Pick<Payment, "status" | "due_date">,
  today: string = todayISO(),
): PaymentDisplayStatus {
  if (payment.status === "PAID") return "PAID";
  return payment.due_date < today ? "OVERDUE" : "PENDING";
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
