export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  return dateStr;
}
