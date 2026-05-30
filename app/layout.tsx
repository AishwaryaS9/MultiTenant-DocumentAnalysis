import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const urbanist = Urbanist({ subsets: ["latin"], variable: "--font-urbanist" });

export const metadata: Metadata = {
  title: "Docinate AI - AI Powered Multi-tenant Document Analysis",
  description: "Analyze and collaborate on documents with Google Gemini AI",
  applicationName: "Docinate AI",
  keywords: [
    "AI document analysis",
    "multi-tenant SaaS",
    "document collaboration",
    "Google Gemini AI",
    "workspace AI tools"
  ],
  metadataBase: new URL("https://multi-tenant-document-analysis-three.vercel.app/"),
  openGraph: {
    title: "Docinate AI",
    description: "AI-powered document analysis and collaboration platform",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${urbanist.className}`}
      // className={`${inter.variable} ${urbanist.variable}`}
      >
        <body className="min-h-screen flex flex-col font-sans bg-white text-slate-900 antialiased">

          <a href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-slate-900 text-white px-3 py-2 rounded-md focus:ring-1 
            focus:ring-slate-800 focus:ring-offset-1">
            Skip to content
          </a>

          <div className="min-h-screen flex flex-col">
            <main id="main-content" role="main" className="flex-1 outline-none">
              {children}
            </main>

            <Toaster position="top-right" richColors />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}