import { providerIds, providers } from "@/lib/providers";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <span className="eyebrow">JavaScript-first · TypeScript-enhanced</span>

        <h1>Iconarium</h1>

        <p className="hero-copy">
          One predictable interface for icon ecosystems. Import metadata,
          helpers, and typed icon catalogs directly from the web.
        </p>

        <pre className="hero-code">
          <code>{`import { getIcon } from "https://iconarium.vercel.app/packages/font-awesome/latest";

const facebook = getIcon("brands", "facebook");`}</code>
        </pre>
      </section>

      <section>
        <div className="section-heading">
          <div>
            <span className="section-kicker">Providers</span>

            <h2>One API, multiple ecosystems</h2>
          </div>

          <p>
            Each provider keeps the structure that makes sense for its own icon
            library.
          </p>
        </div>

        <div className="grid">
          {providerIds.map((providerId) => {
            const provider = providers[providerId];

            return (
              <article key={provider.id}>
                <div className="provider-heading">
                  <span className="provider-dot" />

                  <h3>{provider.name}</h3>
                </div>

                <p>{provider.homepageDescription}</p>

                <pre className="provider-code">
                  <code>{provider.example}</code>
                </pre>

                <div className="provider-links">
                  <a href={`/providers/${provider.id}`}>Browse icons →</a>

                  <a href={`/packages/${provider.id}/latest`}>ESM module →</a>

                  <a href={`/packages/${provider.id}/latest/metadata.json`}>
                    metadata.json →
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="usage">
        <span className="section-kicker">Usage</span>

        <h2>Use the version you want</h2>

        <div className="usage-grid">
          <div>
            <h3>Latest</h3>

            <pre>
              <code>
                https://iconarium.vercel.app/packages/font-awesome/latest
              </code>
            </pre>

            <p>
              Tracks the newest generated provider release and uses a short
              cache lifetime.
            </p>
          </div>

          <div>
            <h3>Pinned</h3>

            <pre>
              <code>
                https://iconarium.vercel.app/packages/font-awesome/7.3.1
              </code>
            </pre>

            <p>
              Immutable versioned URLs are suitable for production builds and
              long-term caching.
            </p>
          </div>
        </div>
      </section>

      <section className="footer-section">
        <p>
          Generated from provider metadata and served as ESM, JSON, browser
          bundles, and TypeScript declarations.
        </p>
      </section>
    </main>
  );
}
