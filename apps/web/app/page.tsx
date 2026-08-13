const providers = [
  ["Font Awesome", "font-awesome", 'getIcon("brands", "facebook")'],
  ["Devicons", "devicons", 'getIcon("typescript", "original")'],
  ["Simple Icons", "simple-icons", 'getIcon("github")'],
] as const;

export default function Home() {
  return (
    <main>
      <section className="hero">
        <span className="eyebrow">JavaScript-first · TypeScript-enhanced</span>
        <h1>Icon Meta</h1>
        <p>
          One predictable metadata layer for icon ecosystems, with generated
          autocomplete-friendly APIs and CDN-ready browser modules.
        </p>
        <pre>
          <code>{`import { getIcon } from "https://your-domain.example/packages/font-awesome/latest/index.js";

const facebook = getIcon("brands", "facebook");`}</code>
        </pre>
      </section>
      <section>
        <h2>Providers</h2>
        <div className="grid">
          {providers.map(([name, slug, example]) => (
            <article key={slug}>
              <h3>{name}</h3>
              <code>{example}</code>
              <a href={`/packages/${slug}/latest/metadata.json`}>
                metadata.json →
              </a>
            </article>
          ))}
        </div>
      </section>
      <section>
        <h2>Generate the complete catalogs</h2>
        <pre>
          <code>pnpm generate</code>
        </pre>
        <p>
          The repository ships tiny seed datasets so the API is readable before
          generation. The generator replaces them using each provider&apos;s
          official metadata.
        </p>
      </section>
    </main>
  );
}
