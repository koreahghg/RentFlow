import { Card, CardContent } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  size = "default",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "warning" | "danger";
  size?: "default" | "lg";
}) {
  return (
    <Card>
      <CardContent
        className={cn(
          "flex items-center justify-between gap-3",
          size === "lg" ? "px-5 py-5" : "px-4 py-4",
        )}
      >
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-muted-foreground">{label}</p>
          <p
            className={cn(
              "mt-1.5 truncate font-bold tabular-nums",
              size === "lg" ? "text-2xl" : "text-lg",
              tone === "warning" && "text-warning",
              tone === "danger" && "text-destructive",
            )}
          >
            {value}
          </p>
        </div>
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground",
            size === "lg" ? "size-11" : "size-9",
            tone === "warning" && "bg-warning/10 text-warning",
            tone === "danger" && "bg-destructive/10 text-destructive",
          )}
        >
          <Icon className={size === "lg" ? "size-5" : "size-4.5"} />
        </div>
      </CardContent>
    </Card>
  );
}
