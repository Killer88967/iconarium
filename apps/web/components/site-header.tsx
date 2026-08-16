"use client";

import { usePathname } from "next/navigation";
import Octicon from "@/components/octicon";
import Icon from "@/components/icon";

export default function SiteHeader() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="site-brand" href="/">
          <span className="site-brand-mark">
            <Icon name="iconarium" />
          </span>

          <strong>Iconarium</strong>
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          <a href="/" className={isActive("/") ? "active" : undefined}>
            <Octicon name="home" size={16} />
            <span>Home</span>
          </a>

          <a
            href="/search"
            className={isActive("/search") ? "active" : undefined}
          >
            <Octicon name="search" size={16} />
            <span>Search</span>
          </a>

          <a href="/docs" className={isActive("/docs") ? "active" : undefined}>
            <Octicon name="book" size={16} />
            <span>Docs</span>
          </a>

          <a
            href="/assets"
            className={isActive("/assets") ? "active" : undefined}
          >
            <Octicon name="package" size={16} />
            <span>Assets</span>
          </a>

          <span className="site-nav-divider" />

          <a
            href="https://github.com/Killer88967/iconarium"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Octicon name="mark-github" size={16} />
            <span>Repository</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
