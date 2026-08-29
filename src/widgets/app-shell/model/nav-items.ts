import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  DoorClosed,
  Users,
  Wallet,
  FileText,
  Settings,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "대시보드", icon: LayoutDashboard },
  { href: "/rooms", label: "호실 관리", icon: DoorClosed },
  { href: "/tenants", label: "세입자 관리", icon: Users },
  { href: "/payments", label: "월세 관리", icon: Wallet },
  { href: "/contracts", label: "계약 관리", icon: FileText },
  { href: "/settings", label: "설정", icon: Settings },
];
