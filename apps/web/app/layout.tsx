import type { Metadata } from "next";
import SiteHeader from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://iconarium.vercel.app"),
  title: {
    default: "Iconarium",
    template: "%s | Iconarium",
  },
  description:
    "Typed icon metadata, provider helpers, and CDN-ready modules for Font Awesome, Devicons, Simple Icons, Octicons, and Iconarium.",

  applicationName: "Iconarium",
  keywords: [
    "icons",
    "icon metadata",
    "TypeScript icons",
    "Font Awesome",
    "Devicons",
    "Simple Icons",
    "Octicons",
    "SVG icons",
    "CDN icons",
    "Iconarium",
  ],
  authors: [{ name: "Killer88967", url: "https://github.com/Killer88967" }],
  creator: "Killer88967",
  publisher: "Iconarium",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    url: "/",
    siteName: "Iconarium",
    title: "Iconarium",
    description:
      "Typed icon metadata, provider helpers, and CDN-ready modules for popular icon ecosystems.",
  },

  twitter: {
    card: "summary_large_image",
    title: "Iconarium",
    description:
      "Typed icon metadata, provider helpers, and CDN-ready modules for popular icon ecosystems.",
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "technology",
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
