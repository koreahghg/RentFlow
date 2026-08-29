"use client";

import { useActionState, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createRoom, updateRoom, type ActionResult } from "@/lib/actions/rooms";
import { FLOORS } from "@/lib/domain";
import type { Room } from "@/lib/types";

export function RoomFormDialog({ room }: { room?: Room }) {
  const [open, setOpen] = useState(false);
  const action = room ? updateRoom.bind(null, room.id) : createRoom;
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    action,
    null,
  );

  const [prevState, setPrevState] = useState(state);
  if (state !== prevState) {
    setPrevState(state);
    if (state?.ok) setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          room ? (
            <Button variant="ghost" size="sm">
              <Pencil className="size-4" />
              수정
            </Button>
          ) : (
            <Button>
              <Plus className="size-4" />
              호실 등록
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{room ? "호실 수정" : "호실 등록"}</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="floor">층</Label>
            <Select name="floor" defaultValue={room ? String(room.floor) : undefined}>
              <SelectTrigger id="floor" className="w-full">
                <SelectValue placeholder="층을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {FLOORS.map((floor) => (
                  <SelectItem key={floor} value={String(floor)}>
                    {floor}층
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="room_number">호실 번호</Label>
            <Input
              id="room_number"
              name="room_number"
              placeholder="예: 101"
              defaultValue={room?.room_number}
              required
            />
          </div>
          {state && !state.ok && (
            <p className="text-sm text-destructive">{state.error}</p>
          )}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "저장 중..." : "저장"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
