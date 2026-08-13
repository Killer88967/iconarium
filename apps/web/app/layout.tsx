import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Icon Meta",
  description: "Typed metadata and runtime helpers for icon providers.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
