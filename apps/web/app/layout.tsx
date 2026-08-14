import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Iconarium",
  description:
    "Typed icon metadata, provider helpers, and CDN-ready modules for popular icon ecosystems.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />

        <div className="site-content">{children}</div>
      </body>
    </html>
  );
}
