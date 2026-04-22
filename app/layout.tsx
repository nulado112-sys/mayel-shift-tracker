import type { Metadata } from "next";
import "./globals.css";
import MobileNav from "@/components/MobileNav";

export const metadata: Metadata = {
  title: "Mayel Shift Tracker",
  description: "Staff shift tracking system for Mayel Restaurant",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
        <MobileNav />
      </body>
    </html>
  );
}