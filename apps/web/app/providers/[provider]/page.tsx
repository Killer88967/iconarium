import { notFound } from "next/navigation";
import ProviderBrowser from "./provider-browser";

import { getProvider, isProviderId, providerIds } from "@/lib/providers";

interface PageProps {
  params: Promise<{
    provider: string;
  }>;
}

export function generateStaticParams() {
  return providerIds.map((provider) => ({
    provider,
  }));
}

export default async function ProviderPage({ params }: PageProps) {
  const { provider } = await params;

  if (!isProviderId(provider)) {
    notFound();
  }

  const info = getProvider(provider);

  if (!info) {
    notFound();
  }

  return (
    <main>
      <section className="provider-hero">
        <a className="back-link" href="/">
          ← Iconarium
        </a>

        <span className="section-kicker">Provider</span>

        <h1 className="provider-title">{info.name}</h1>

        <p className="provider-description">{info.description}</p>

        <pre className="provider-import">
          <code>
            {`import { getIcon } from "https://iconarium.vercel.app/packages/${provider}/latest";`}
          </code>
        </pre>
      </section>

      {info.hasAssets && info.assetsProvider && (
        <a
          className="provider-assets-link"
          href={`/assets/${info.assetsProvider}`}
        >
          <div>
            <span className="section-kicker">CDN Assets</span>

            <h2>Stylesheets &amp; package files</h2>

            <p>Browse mirrored package assets and versioned CDN URLs.</p>
          </div>

          <span className="provider-assets-arrow">→</span>
        </a>
      )}

      <ProviderBrowser provider={provider} />
    </main>
  );
}
