import { ContractTable } from "@/entities/contract";
import { listContracts } from "@/entities/contract/api";

export default async function ContractsPage() {
  const rows = await listContracts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">계약 관리</h1>
        <p className="text-sm text-muted-foreground">세입자별 계약 정보를 관리합니다.</p>
      </div>

      <ContractTable rows={rows} />
    </div>
  );
}
