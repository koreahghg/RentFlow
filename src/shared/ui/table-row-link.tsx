"use client"

import { useRouter } from "next/navigation"
import type { ComponentProps } from "react"

import { cn } from "@/shared/lib/utils"
import { TableRow } from "@/shared/ui/table"

export function TableRowLink({
  href,
  className,
  ...props
}: { href: string } & ComponentProps<typeof TableRow>) {
  const router = useRouter()

  return (
    <TableRow
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(event) => {
        if (event.key === "Enter") router.push(href)
      }}
      className={cn("cursor-pointer", className)}
      {...props}
    />
  )
}
