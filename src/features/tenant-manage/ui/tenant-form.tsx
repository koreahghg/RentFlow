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
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { createTenant, type ActionResult } from "../api/actions";
import type { Room } from "@/entities/room";

export function TenantForm({ rooms }: { rooms: Room[] }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    createTenant,
    null,
  );

  return (
    <form action={formAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">개인정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">이름 *</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">전화번호 *</Label>
              <Input id="phone" name="phone" placeholder="010-0000-0000" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" name="email" type="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birth_date">생년월일</Label>
              <Input id="birth_date" name="birth_date" type="date" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="memo">메모</Label>
            <Textarea id="memo" name="memo" rows={3} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">호실 선택 및 입주 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="room_id">호실 *</Label>
              <Select name="room_id">
                <SelectTrigger id="room_id" className="w-full">
                  <SelectValue placeholder="공실을 선택하세요" />
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
              <Input id="move_in_date" name="move_in_date" type="date" required />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">계약 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="deposit">보증금 *</Label>
              <Input id="deposit" name="deposit" type="number" min={0} step={10000} defaultValue={0} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monthly_rent">월세 *</Label>
              <Input id="monthly_rent" name="monthly_rent" type="number" min={0} step={10000} defaultValue={0} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenance_fee">관리비 *</Label>
              <Input id="maintenance_fee" name="maintenance_fee" type="number" min={0} step={10000} defaultValue={0} required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_date">계약 시작일 *</Label>
              <Input id="start_date" name="start_date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">계약 종료일 *</Label>
              <Input id="end_date" name="end_date" type="date" required />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">계약서 업로드</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="document">계약서 파일 (PDF, JPG, JPEG, PNG)</Label>
            <Input id="document" name="document" type="file" accept=".pdf,.jpg,.jpeg,.png" />
          </div>
        </CardContent>
      </Card>

      {state && !state.ok && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "저장 중..." : "세입자 등록"}
      </Button>
    </form>
  );
}
