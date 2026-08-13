import GlobalSearch from "./global-search";

export default function SearchPage() {
  return (
    <main>
      <section className="assets-hero">
        <a className="back-link" href="/">
          ← Iconarium
        </a>

        <span className="section-kicker">Search</span>

        <h1>All icons</h1>

        <p className="hero-copy">
          Search Font Awesome, Devicons, and Simple Icons from one place.
        </p>
      </section>

      <GlobalSearch />
    </main>
  );
}
