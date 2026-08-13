const providers = [
  {
    name: "Font Awesome",
    slug: "font-awesome",
    description:
      "Stylesheets, webfonts, and other mirrored Font Awesome assets.",
  },

  {
    name: "Devicons",
    slug: "devicons",
    description:
      "Devicon stylesheets and font assets mirrored from the published package.",
  },

  {
    name: "Simple Icons Font",
    slug: "simple-icons-font",
    description:
      "The official Simple Icons icon-font package, including CSS and font files.",
  },
] as const;

export default function AssetsPage() {
  return (
    <main>
      <section className="assets-hero">
        <a className="back-link" href="/">
          ← Iconarium
        </a>

        <span className="section-kicker">CDN</span>

        <h1>Assets</h1>

        <p className="hero-copy">
          Browse versioned stylesheets, fonts, and other files mirrored from
          Iconarium&apos;s supported providers.
        </p>
      </section>

      <section className="asset-provider-grid">
        {providers.map((provider) => (
          <a
            key={provider.slug}
            href={`/assets/${provider.slug}`}
            className="asset-provider-card"
          >
            <div>
              <span className="section-kicker">Package</span>

              <h2>{provider.name}</h2>

              <p>{provider.description}</p>
            </div>

            <span className="asset-provider-arrow">→</span>
          </a>
        ))}
      </section>
    </main>
  );
}
