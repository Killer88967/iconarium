import type { Metadata } from "next";
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
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.3.1/css/all.min.css"
        />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}
