import type { Metadata } from "next";
import Octicon from "@/components/octicon";
import CodeBlock from "@/components/code-block";
import { providerIds, providers } from "@/lib/providers";

export const metadata: Metadata = {
  title: "Docs",
  description:
    "Learn how to use Iconarium's typed icon metadata, ESM modules, provider helpers, versioned imports, and generated assets.",
};

const baseUrl = "https://iconarium.vercel.app/packages";

export default function DocsPage() {
  return (
    <main>
      <section className="home-hero">
        <div className="home-hero-copy">
          <span className="eyebrow">Documentation</span>

          <h1>Getting started</h1>

          <p>
            Use Iconarium directly from the browser with typed ESM modules,
            version-pinned imports, searchable metadata, and provider-aware
            helper functions.
          </p>

          <div className="home-actions">
            <a className="ui-button ui-button-primary" href="#quick-start">
              <Octicon name="rocket" size={16} />
              <span>Quick start</span>
            </a>

            <a className="ui-button" href="#providers">
              <Octicon name="package" size={16} />
              <span>Providers</span>
            </a>

            <a className="ui-button" href="/search">
              <Octicon name="search" size={16} />
              <span>Search icons</span>
            </a>
          </div>
        </div>

        <div className="quick-start">
          <div className="panel-header">
            <div className="panel-title">
              <Octicon name="code" size={16} />
              <span>Browser ESM</span>
            </div>

            <span className="panel-meta">TypeScript ready</span>
          </div>

          <CodeBlock label="TypeScript">{`import { getIcon } from "${baseUrl}/octicons/latest";

const icon = getIcon("mark-github", 24);

console.log(icon.fileName);`}</CodeBlock>
        </div>
      </section>

      <section id="quick-start">
        <div className="section-heading github-section-heading">
          <div>
            <span className="section-kicker">Quick start</span>
            <h2>Use Iconarium without installing anything</h2>
          </div>
        </div>

        <div className="info-panel-grid">
          <article className="info-panel">
            <div className="panel-header">
              <div className="panel-title">
                <Octicon name="download" size={16} />
                <span>Import</span>
              </div>
            </div>

            <div className="panel-body">
              <p>
                Import a provider directly from Iconarium using a browser-ready
                ESM URL.
              </p>

              <CodeBlock label="TypeScript">
                {`import { getIcon } from "${baseUrl}/simple-icons/latest";`}
              </CodeBlock>
            </div>
          </article>

          <article className="info-panel">
            <div className="panel-header">
              <div className="panel-title">
                <Octicon name="code-square" size={16} />
                <span>Use</span>
              </div>
            </div>

            <div className="panel-body">
              <p>
                Each provider exposes helper functions with provider-aware
                autocomplete.
              </p>

              <CodeBlock label="TypeScript">{`const github = getIcon("github");

console.log(github.hex);`}</CodeBlock>
            </div>
          </article>
        </div>
      </section>

      <section id="providers">
        <div className="section-heading github-section-heading">
          <div>
            <span className="section-kicker">Providers</span>
            <h2>Provider-specific APIs</h2>
          </div>

          <span className="provider-count">{providerIds.length} providers</span>
        </div>

        <div className="provider-grid">
          {providerIds.map((providerId) => {
            const provider = providers[providerId];

            return (
              <article className="provider-panel" key={provider.id}>
                <div className="provider-panel-header">
                  <div className="provider-panel-title">
                    <Octicon name="package" size={16} />
                    <a href={`/providers/${provider.id}`}>{provider.name}</a>
                  </div>

                  <span className="status-badge">Provider</span>
                </div>

                <div className="provider-panel-body">
                  <p>{provider.homepageDescription}</p>

                  <CodeBlock label="TypeScript" className="provider-code">
                    {provider.example}
                  </CodeBlock>
                </div>

                <div className="provider-panel-footer">
                  <a href={`/providers/${provider.id}`}>
                    Browse
                    <Octicon name="chevron-right" size={16} />
                  </a>

                  <a href={`/packages/${provider.id}/latest`}>ESM</a>

                  <a href={`/packages/${provider.id}/latest/metadata.json`}>
                    Metadata
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section>
        <div className="section-heading github-section-heading">
          <div>
            <span className="section-kicker">Helpers</span>
            <h2>Common package API</h2>
          </div>
        </div>

        <div className="info-panel-grid">
          <article className="info-panel">
            <div className="panel-header">
              <div className="panel-title">
                <Octicon name="search" size={16} />
                <span>searchIcons()</span>
              </div>
            </div>

            <div className="panel-body">
              <p>Search normalized metadata within a provider.</p>

              <CodeBlock label="TypeScript">
                {`const results = searchIcons("github");`}
              </CodeBlock>
            </div>
          </article>

          <article className="info-panel">
            <div className="panel-header">
              <div className="panel-title">
                <Octicon name="check-circle" size={16} />
                <span>hasIcon()</span>
              </div>
            </div>

            <div className="panel-body">
              <p>
                Check whether a provider contains an icon before accessing it.
              </p>

              <CodeBlock label="TypeScript">{`if (hasIcon("github")) {
  const icon = getIcon("github");
}`}</CodeBlock>
            </div>
          </article>
        </div>
      </section>

      <section>
        <div className="section-heading github-section-heading">
          <div>
            <span className="section-kicker">Versioning</span>
            <h2>Latest or pinned</h2>
          </div>
        </div>

        <div className="info-panel-grid">
          <article className="info-panel">
            <div className="panel-header">
              <div className="panel-title">
                <Octicon name="sync" size={16} />
                <span>Latest</span>
              </div>
            </div>

            <div className="panel-body">
              <CodeBlock label="URL">
                {`${baseUrl}/font-awesome/latest`}
              </CodeBlock>

              <p>
                Tracks the newest provider version currently generated by
                Iconarium.
              </p>
            </div>
          </article>

          <article className="info-panel">
            <div className="panel-header">
              <div className="panel-title">
                <Octicon name="versions" size={16} />
                <span>Pinned</span>
              </div>
            </div>

            <div className="panel-body">
              <CodeBlock label="URL">
                {`${baseUrl}/font-awesome/7.3.1`}
              </CodeBlock>

              <p>
                Use immutable version URLs when you need reproducible production
                builds.
              </p>
            </div>
          </article>
        </div>
      </section>

      <section>
        <div className="section-heading github-section-heading">
          <div>
            <span className="section-kicker">TypeScript</span>
            <h2>Autocomplete without a package install</h2>
          </div>
        </div>

        <div className="info-panel">
          <div className="panel-header">
            <div className="panel-title">
              <Octicon name="file-code" size={16} />
              <span>Generated declarations</span>
            </div>
          </div>

          <div className="panel-body">
            <p>
              Iconarium serves generated TypeScript declarations alongside its
              browser ESM modules. Provider helpers preserve valid icon names,
              styles, variants, and sizes in the type system.
            </p>

            <CodeBlock label="TypeScript">{`const icon = getIcon("mark-github", 24);
//                     ^ icon name autocomplete
//                                    ^ size autocomplete`}</CodeBlock>
          </div>
        </div>
      </section>
    </main>
  );
}
