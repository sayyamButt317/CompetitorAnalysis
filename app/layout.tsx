import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { APP_COMPANY } from "@/lib/app-brand";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Competitor Analysis | Competra AI",
  description: "Social media competitor analysis dashboard",
  icons: {
    icon: APP_COMPANY.logoDark,
    apple: APP_COMPANY.logoDark,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="h-full overflow-hidden">{children}</body>
    </html>
  );
}
