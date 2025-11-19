import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "ZamReal Manager",
  description:
    "Mobile-first real estate management cockpit for Zambian landlords, managers and tenants"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-slate-50">
      <body className={`${inter.variable} text-slate-900`}>
        <AppProviders>
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
