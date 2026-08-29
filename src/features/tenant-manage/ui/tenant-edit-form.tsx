"use client";

import { useActionState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { updateTenant, type ActionResult } from "../api/actions";
import type { Room } from "@/entities/room";
import type { Tenant } from "@/entities/tenant";

export function TenantEditForm({ tenant, rooms }: { tenant: Tenant; rooms: Room[] }) {
  const action = updateTenant.bind(null, tenant.id);
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">이름 *</Label>
          <Input id="name" name="name" defaultValue={tenant.name} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">전화번호 *</Label>
          <Input id="phone" name="phone" defaultValue={tenant.phone} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">이메일</Label>
          <Input id="email" name="email" type="email" defaultValue={tenant.email ?? ""} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="birth_date">생년월일</Label>
          <Input
            id="birth_date"
            name="birth_date"
            type="date"
            defaultValue={tenant.birth_date ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="room_id">호실</Label>
          <Select name="room_id" defaultValue={tenant.room_id ?? undefined}>
            <SelectTrigger id="room_id" className="w-full">
              <SelectValue placeholder="호실을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.floor}층 {room.room_number}호
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="move_in_date">입주일 *</Label>
          <Input
            id="move_in_date"
            name="move_in_date"
            type="date"
            defaultValue={tenant.move_in_date}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="move_out_date">퇴거일</Label>
          <Input
            id="move_out_date"
            name="move_out_date"
            type="date"
            defaultValue={tenant.move_out_date ?? ""}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="memo">메모</Label>
        <Textarea id="memo" name="memo" rows={3} defaultValue={tenant.memo ?? ""} />
      </div>

      {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "저장 중..." : "저장"}
      </Button>
    </form>
  );
}
