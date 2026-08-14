import Octicon from "@/components/octicon";

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <a className="site-brand" href="/">
          <span className="site-brand-mark">
            <Octicon name="mark-github" size={24} />
          </span>

          <strong>Iconarium</strong>
        </a>

        <nav className="site-nav" aria-label="Primary navigation">
          <a href="/">
            <Octicon name="home" size={16} />
            <span>Home</span>
          </a>

          <a href="/search">
            <Octicon name="search" size={16} />
            <span>Search</span>
          </a>

          <a href="/assets">
            <Octicon name="package" size={16} />
            <span>Assets</span>
          </a>

          <a
            href="https://github.com/Killer88967/iconarium"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Octicon name="mark-github" size={16} />
            <span>GitHub</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
