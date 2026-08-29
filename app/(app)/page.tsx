import { Building2, Users, DoorOpen, DoorClosed, Wallet, AlertTriangle, Banknote } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { OverdueList } from "@/components/dashboard/overdue-list";
import { ExpiringList } from "@/components/dashboard/expiring-list";
import { FloorGrid } from "@/components/rooms/floor-grid";
import {
  getDashboardStats,
  getExpiringContracts,
  getOverduePayments,
} from "@/lib/queries/dashboard";
import { listRoomsWithStatus } from "@/lib/queries/rooms";
import { formatCurrency } from "@/lib/domain";

export default async function DashboardPage() {
  const [stats, overdue, expiring, rooms] = await Promise.all([
    getDashboardStats(),
    getOverduePayments(),
    getExpiringContracts(),
    listRoomsWithStatus(),
  ]);

  const now = new Date();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-sm text-muted-foreground">
          {now.getFullYear()}년 {now.getMonth() + 1}월 현황
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="전체 호실 수" value={`${stats.totalRooms}개`} icon={Building2} />
        <StatCard label="입주 호실 수" value={`${stats.occupiedRooms}개`} icon={DoorClosed} />
        <StatCard label="공실 수" value={`${stats.vacantRooms}개`} icon={DoorOpen} />
        <StatCard label="전체 세입자 수" value={`${stats.totalTenants}명`} icon={Users} />
        <StatCard
          label="이번 달 월세 수입"
          value={formatCurrency(stats.monthlyIncome)}
          icon={Banknote}
        />
        <StatCard
          label="이번 달 미납 건수"
          value={`${stats.overdueCount}건`}
          icon={AlertTriangle}
          tone={stats.overdueCount > 0 ? "danger" : "default"}
        />
        <StatCard
          label="이번 달 미납 금액"
          value={formatCurrency(stats.overdueAmount)}
          icon={Wallet}
          tone={stats.overdueAmount > 0 ? "danger" : "default"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <OverdueList rows={overdue} />
        <ExpiringList rows={expiring} />
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold">층별 현황</h2>
        <FloorGrid rooms={rooms} />
      </div>
    </div>
  );
}
