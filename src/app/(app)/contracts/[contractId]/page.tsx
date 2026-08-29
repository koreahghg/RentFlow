import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { ContractStatusBadge } from "@/entities/contract";
import { getContractDetail } from "@/entities/contract/api";
import {
  ContractForm,
  TerminateContractButton,
  DocumentList,
  DocumentUploader,
} from "@/features/contract-manage";

export default async function ContractDetailPage({
  params,
}: PageProps<"/contracts/[contractId]">) {
  const { contractId } = await params;

  let detail;
  try {
    detail = await getContractDetail(contractId);
  } catch {
    notFound();
  }

  const { contract, tenant, room, documents, displayStatus } = detail;

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <Link
          href="/contracts"
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          계약 관리로
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">
              {room ? `${room.floor}층 ${room.room_number}호` : "계약"} 계약
            </h1>
            <ContractStatusBadge status={displayStatus} />
          </div>
          {contract.status === "ACTIVE" && (
            <TerminateContractButton contractId={contract.id} />
          )}
        </div>
        {tenant && (
          <p className="mt-1 text-sm text-muted-foreground">
            세입자:{" "}
            <Link href={`/tenants/${tenant.id}`} className="text-primary hover:underline">
              {tenant.name}
            </Link>
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">계약 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <ContractForm contract={contract} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">계약서</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <DocumentList documents={documents} />
          <DocumentUploader contractId={contract.id} />
        </CardContent>
      </Card>
    </div>
  );
}
