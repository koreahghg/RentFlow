import type { Metadata } from "next";
import { Toaster } from "@/shared/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "RentFlow",
  description: "임대인을 위한 간편한 월세·세입자 관리 시스템",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-muted/30">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
