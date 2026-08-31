"use client";

import { useActionState } from "react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { login, type LoginResult } from "@/features/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginResult | null, FormData>(
    login,
    null,
  );

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-muted/30 p-4">
      <h1 className="text-center text-[32px] font-bold">관리자 로그인</h1>
      <Card className="w-full max-w-sm border-none">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-xl font-semibold">RentFlow</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            {state && !state.ok && (
              <p className="text-sm text-destructive">{state.error}</p>
            )}
            <Button type="submit" size="xl" className="w-full" disabled={pending}>
              {pending ? "로그인 중..." : "로그인"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
