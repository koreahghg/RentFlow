"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/shared/api/supabase/server";
import { roomHasDependents } from "@/entities/room/api";

const roomSchema = z.object({
  floor: z.coerce.number().int().min(1).max(4),
  room_number: z.string().trim().min(1, "호실 번호를 입력해주세요."),
});

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createRoom(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = roomSchema.safeParse({
    floor: formData.get("floor"),
    room_number: formData.get("room_number"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("rooms").insert(parsed.data);
  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "이미 등록된 호실 번호입니다." };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/rooms");
  revalidatePath("/");
  return { ok: true };
}

export async function updateRoom(
  roomId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = roomSchema.safeParse({
    floor: formData.get("floor"),
    room_number: formData.get("room_number"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("rooms")
    .update(parsed.data)
    .eq("id", roomId);
  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "이미 등록된 호실 번호입니다." };
    }
    return { ok: false, error: error.message };
  }

  revalidatePath("/rooms");
  revalidatePath(`/rooms/${roomId}`);
  revalidatePath("/");
  return { ok: true };
}

export async function deleteRoom(roomId: string): Promise<ActionResult> {
  const { hasDependents } = await roomHasDependents(roomId);
  if (hasDependents) {
    return {
      ok: false,
      error: "이 호실에는 세입자(이력)가 존재합니다. 먼저 세입자를 정리한 뒤 삭제해주세요.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("rooms").delete().eq("id", roomId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/rooms");
  revalidatePath("/");
  return { ok: true };
}
