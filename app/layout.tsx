import type { Metadata } from "next";
import { Inter, Geist } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "DocuAI - AI Powered Multi-tenant Document Analysis",
  description: "Analyze and collaboration on documents with Google Gemini AI",
};

export default function RootLayout({
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
              {children}
            </main>
            {/* Footer */}
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
