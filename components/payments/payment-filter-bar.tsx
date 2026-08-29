"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FLOORS } from "@/lib/domain";

const STATUS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "PENDING", label: "미납" },
  { value: "OVERDUE", label: "연체" },
];

export function PaymentFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        defaultValue={searchParams.get("floor") ?? "all"}
        onValueChange={(v) => updateParam("floor", v)}
      >
        <SelectTrigger className="w-28">
          <SelectValue placeholder="층" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체 층</SelectItem>
          {FLOORS.map((f) => (
            <SelectItem key={f} value={String(f)}>
              {f}층
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("status") ?? "all"}
        onValueChange={(v) => updateParam("status", v)}
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="상태" />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
