import { FileText, Download, ExternalLink } from "lucide-react";
import { DeleteDocumentButton } from "./delete-document-button";
import type { ContractDocument } from "@/entities/contract";
import { getDocumentSignedUrls } from "@/entities/contract/api";

export async function DocumentList({ documents }: { documents: ContractDocument[] }) {
  if (documents.length === 0) {
    return <p className="text-sm text-muted-foreground">업로드된 계약서가 없어요.</p>;
  }

  const withUrls = await Promise.all(
    documents.map(async (doc) => ({ doc, urls: await getDocumentSignedUrls(doc) })),
  );

  return (
    <ul className="space-y-2">
      {withUrls.map(({ doc, urls }) => (
        <li
          key={doc.id}
          className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm"
        >
          <div className="flex min-w-0 items-center gap-2">
            <FileText className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate">{doc.file_name}</span>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {urls.viewUrl && (
              <a
                href={urls.viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="열기"
              >
                <ExternalLink className="size-4" />
              </a>
            )}
            {urls.downloadUrl && (
              <a
                href={urls.downloadUrl}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                aria-label="다운로드"
              >
                <Download className="size-4" />
              </a>
            )}
            <DeleteDocumentButton documentId={doc.id} />
          </div>
        </li>
      ))}
    </ul>
  );
}
