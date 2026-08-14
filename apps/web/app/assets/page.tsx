import { providers } from "@/lib/providers";
import Octicon from "@/components/octicon";

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
      <section className="assets-page-header">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/" aria-label="Home">
            <Octicon name="home" size={16} />
          </a>

          <Octicon name="chevron-right" size={16} />

          <span>Assets</span>
        </nav>

        <span className="section-kicker">CDN</span>

        <h1>Assets</h1>

        <p>
          Browse versioned stylesheets, fonts, and package files mirrored from
          Iconarium&apos;s supported providers.
        </p>
      </section>

      <section className="asset-provider-list">
        <div className="github-section-heading">
          <div>
            <span className="section-kicker">Packages</span>
            <h2>Mirrored assets</h2>
          </div>

          <span className="provider-count">
            {assetProviders.length} packages
          </span>
        </div>

        <div className="asset-provider-grid">
          {assetProviders.map((provider) => (
            <a
              key={provider.slug}
              href={`/assets/${provider.slug}`}
              className="asset-provider-card"
            >
              <div className="asset-provider-card-icon">
                <Octicon name="package" size={24} />
              </div>

              <div className="asset-provider-card-copy">
                <strong>{provider.name}</strong>
                <p>{provider.description}</p>
              </div>

              <Octicon name="chevron-right" size={16} />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
