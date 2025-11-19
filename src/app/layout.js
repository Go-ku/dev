import "./globals.css";
import { Inter } from "next/font/google";
import { AppProviders } from "@/components/providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "ZamReal Manager",
  description:
    "Mobile-first real estate management workspace for Zambian landlords, managers and tenants"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-slate-50">
      <body className={`${inter.variable} min-h-screen bg-slate-50 text-slate-900`}>
        <AppProviders>
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
