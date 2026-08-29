"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { FLOORS } from "@/entities/room";

const RESIDENT_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "active", label: "입주 중" },
  { value: "moved_out", label: "퇴거" },
];

const PAYMENT_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "PAID", label: "납부 완료" },
  { value: "PENDING", label: "미납" },
  { value: "OVERDUE", label: "연체" },
];

const CONTRACT_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "ACTIVE", label: "계약 중" },
  { value: "EXPIRING", label: "만료 예정" },
  { value: "EXPIRED", label: "만료" },
];

export function SearchFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
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
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative sm:w-64">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="이름, 호실, 전화번호 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") updateParam("search", search);
          }}
          onBlur={() => updateParam("search", search)}
        />
      </div>

      <Select
        defaultValue={searchParams.get("floor") ?? "all"}
        onValueChange={(v) => updateParam("floor", v)}
      >
        <SelectTrigger className="sm:w-28">
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
        defaultValue={searchParams.get("resident") ?? "all"}
        onValueChange={(v) => updateParam("resident", v)}
      >
        <SelectTrigger className="sm:w-32">
          <SelectValue placeholder="거주 상태" />
        </SelectTrigger>
        <SelectContent>
          {RESIDENT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("payment") ?? "all"}
        onValueChange={(v) => updateParam("payment", v)}
      >
        <SelectTrigger className="sm:w-32">
          <SelectValue placeholder="월세 상태" />
        </SelectTrigger>
        <SelectContent>
          {PAYMENT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={searchParams.get("contract") ?? "all"}
        onValueChange={(v) => updateParam("contract", v)}
      >
        <SelectTrigger className="sm:w-32">
          <SelectValue placeholder="계약 상태" />
        </SelectTrigger>
        <SelectContent>
          {CONTRACT_OPTIONS.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
