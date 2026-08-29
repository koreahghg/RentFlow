import { differenceInCalendarDays } from "date-fns";
import { todayISO } from "@/shared/lib/date";
import type { Contract, ContractDisplayStatus } from "./types";

export const EXPIRING_SOON_DAYS = 30;

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
