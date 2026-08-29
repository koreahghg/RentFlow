import Link from "next/link";
import { Building2, Settings } from "lucide-react";

export function MobileHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <Building2 className="size-5" />
        RentFlow
      </Link>
      <Link href="/settings" aria-label="설정">
        <Settings className="size-5 text-muted-foreground" />
      </Link>
    </header>
  );
}
