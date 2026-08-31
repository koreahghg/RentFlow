import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/shared/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-30 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // button-primary: fill-brand(blue-500) 배경 + 흰 텍스트, 화면당 단 하나의 primary CTA
        default: "bg-primary text-primary-foreground hover:brightness-95",
        outline:
          "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        // button-secondary: fill-secondary(grey-100) 배경 + grey-900 텍스트, 보조 액션
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_6%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        // button-ghost: 투명 배경 + text-brand(blue-500) 라벨, 보더 없음 — 텍스트 링크에 가까운 약한 위계
        ghost:
          "text-primary hover:bg-primary-weak aria-expanded:bg-primary-weak dark:hover:bg-muted/50",
        // button-danger: fill-danger(red-500) 배경 + 흰 텍스트, 파괴적 액션 전용
        destructive:
          "bg-destructive text-destructive-foreground hover:brightness-95 focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // M — 40px, radius-m(12)
        default:
          "h-10 gap-1.5 px-4 text-[15px] has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        // S — 32px, radius-s(8)
        xs: "h-7 gap-1 rounded-sm px-2.5 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-sm px-3 text-[13px] in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        // L — 48px, radius-l(14)
        lg: "h-12 gap-1.5 rounded-lg px-5 text-[17px] font-bold has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4",
        // XL — 56px, radius-xl(16) — 화면 최하단 primary CTA에 사용
        xl: "h-14 gap-2 rounded-xl px-6 text-[17px] font-bold has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5",
        icon: "size-10",
        "icon-xs":
          "size-7 rounded-sm in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-sm in-data-[slot=button-group]:rounded-md",
        "icon-lg": "size-12 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
