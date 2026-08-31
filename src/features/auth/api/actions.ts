"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/shared/api/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().min(1, "이메일을 입력해주세요.").email("이메일 형식이 올바르지 않아요."),
  password: z.string().min(1, "비밀번호를 입력해주세요."),
});

export type LoginResult = { ok: true } | { ok: false; error: string };

export async function login(
  _prev: LoginResult | null,
  formData: FormData,
): Promise<LoginResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    if (error.code === "invalid_credentials") {
      return { ok: false, error: "이메일 또는 비밀번호가 일치하지 않아요." };
    }
    return { ok: false, error: error.message };
  }

  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
