import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import Header from "@/components/common/header";
import { Toaster } from "sonner";
import { syncUserToDatabase } from "@/lib/sync-user";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Docinate AI - AI Powered Multi-tenant Document Analysis",
  description: "Analyze and collaboration on documents with Google Gemini AI",
};

async function UserSync({ children }: { children: React.ReactNode }) {
  await syncUserToDatabase();
  return <>{children}</>;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <Header />
            {/* Main */}
            <main className="flex-1">
              <UserSync>{children}</UserSync>
            </main>
            <Toaster position="top-right" richColors />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
