import { providers } from "@/lib/providers";

const assetProviders = [
  {
    name: providers["font-awesome"].name,
    slug: providers["font-awesome"].assetsProvider,
    description:
      "Stylesheets, webfonts, and other mirrored Font Awesome assets.",
  },

  {
    name: providers.devicons.name,
    slug: providers.devicons.assetsProvider,
    description:
      "Devicon stylesheets and font assets mirrored from the published package.",
  },

  {
    name: "Simple Icons Font",
    slug: providers["simple-icons"].assetsProvider,
    description:
      "The official Simple Icons icon-font package, including CSS and font files.",
  },

  {
    name: providers.octicons.name,
    slug: providers.octicons.assetsProvider,
    description:
      "Octicons package files including CSS, JavaScript, SCSS, and metadata.",
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
        {assetProviders.map((provider) => (
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
